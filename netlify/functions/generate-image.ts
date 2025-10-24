import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { GoogleAuth } from 'google-auth-library';

// Extend max duration to reduce 504s on slower image generations
export const config = { maxDuration: 26 };

// Remove PII-like terms and sensitive attributes to avoid policy blocks
function sanitizePrompt(input: string): string {
  const lowered = input.toLowerCase();
  
  // Extract age range if present (we'll keep this for the prompt structure)
  const ageMatch = lowered.match(/\b(\d{1,2}[-–]\d{1,2})\b/);
  const ageRange = ageMatch ? ageMatch[1] : '30-40';
  
  // Remove specific identifiers but keep general descriptors
  let p = lowered
    .replace(/\b\d{1,2}\s*year\s*old\b/g, '')
    .replace(/\bphoto id\b|\bunique individual\b|\bseed\b|\bssn\b|\bidentifier\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Extract profession/role from the input
  const professionMatch = p.match(/\b(manager|analyst|director|coordinator|specialist|consultant|professional|executive|administrator|officer)\b/);
  const profession = professionMatch ? professionMatch[0] : 'business professional';

  // Compose realistic DSLR headshot prompt (explicitly de-stylized)
  const base = `Professional headshot photo of a ${ageRange} year old ${profession}, photographed with a DSLR (Canon 5D Mark IV) and 85mm lens at f/2.8, ISO 200, 1/125s. Neutral color balance, soft two‑softbox key/fill lighting, even exposure, minimal post‑processing. Soft gray seamless studio background. Wearing navy suit jacket, light blue dress shirt, simple solid tie. Natural facial expression, confident and approachable. Realistic human photo with natural skin texture and subtle imperfections. Not illustration, not 3D render, not CGI, not digital art, not airbrushed, no cinematic look, no dramatic rim lighting, no hyper‑realism, no beauty retouch, no filters`;
  
  return base;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const GOOGLE_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || 'sharp-quest-476102-i2';
    const LOCATION = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

    if (!GOOGLE_CREDENTIALS) {
      return { statusCode: 500, body: JSON.stringify({ error: 'GOOGLE_APPLICATION_CREDENTIALS_JSON not configured' }) };
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Supabase credentials not configured',
          details: {
            hasUrl: !!SUPABASE_URL,
            hasServiceRole: !!SUPABASE_SERVICE_KEY,
          },
        }),
      };
    }

    const body = event.body ? JSON.parse(event.body) : {};
    const rawPrompt: string = body.prompt || '';
    const personaId: string = body.personaId || '';
    
    if (!rawPrompt || rawPrompt.length < 10) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing or too short prompt' }) };
    }

    if (!personaId) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing personaId' }) };
    }

    const prompt = sanitizePrompt(rawPrompt);

    // Step 1: Authenticate with Google Cloud using service account
    const credentials = JSON.parse(GOOGLE_CREDENTIALS);
    const auth = new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    if (!accessToken.token) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to get access token' }) };
    }

    // Step 2: Generate image with Vertex AI Imagen 3 (with retry for network errors)
    let resp;
    let text;
    const maxRetries = 3;
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Vertex AI Imagen 3 generation attempt ${attempt}/${maxRetries}`);
        
        // Use Vertex AI Imagen 3 API
        const apiUrl = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/imagen-3.0-generate-001:predict`;
        
        resp = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            instances: [{
              prompt: prompt
            }],
            parameters: {
              sampleCount: 1,
              aspectRatio: "1:1",
              negativePrompt: "illustration, 3D render, CGI, digital art, airbrushed, cinematic look, dramatic rim lighting, hyper-realism, beauty retouch, filters, cartoon, anime, painting, drawing, sketch",
              safetyFilterLevel: "block_some",
              personGeneration: "allow_adult"
            }
          }),
        });

        text = await resp.text();
        
        if (!resp.ok) {
          console.error(`Vertex AI Imagen 3 error (attempt ${attempt}):`, resp.status, text);
          if (attempt < maxRetries && [408, 429, 500, 502, 503, 504].includes(resp.status)) {
            const delay = Math.pow(2, attempt - 1) * 1000;
            console.log(`Retrying after ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          return { statusCode: resp.status, body: JSON.stringify({ error: 'Vertex AI Imagen 3 error', details: text }) };
        }
        
        // Success - break out of retry loop
        break;
      } catch (err: any) {
        lastError = err;
        console.error(`Network error on attempt ${attempt}:`, err.message);
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt - 1) * 1000;
          console.log(`Retrying after ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        return { statusCode: 500, body: JSON.stringify({ error: 'Network error calling Vertex AI Imagen 3', message: err.message }) };
      }
    }

    const data = JSON.parse(text!);
    // Extract base64 image from Vertex AI Imagen response
    const b64: string | undefined = data?.predictions?.[0]?.bytesBase64Encoded;
    if (!b64) {
      return { statusCode: 502, body: JSON.stringify({ error: 'No image data returned', details: data }) };
    }

    // Step 2: Convert base64 to Blob
    const imageBuffer = Buffer.from(b64, 'base64');
    const imageBlob = new Blob([imageBuffer], { type: 'image/png' });

    // Step 3: Upload to Supabase Storage for permanent storage
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const fileName = `${personaId}-${Date.now()}.png`;
    const filePath = `persona-avatars/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('persona-images')
      .upload(filePath, imageBlob, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to upload image to storage', details: uploadError.message }) };
    }

    // Step 4: Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('persona-images')
      .getPublicUrl(filePath);

    const permanentUrl = publicUrlData.publicUrl;

    return { statusCode: 200, body: JSON.stringify({ imageUrl: permanentUrl }) };
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error', message: err?.message || String(err) }) };
  }
};
