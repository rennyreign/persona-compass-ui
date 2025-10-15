import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

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
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

    if (!OPENAI_API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: 'OPENAI_API_KEY not configured' }) };
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

    // Step 1: Generate image with DALL-E
    const resp = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '512x512',
        quality: 'standard',
        style: 'natural',
        response_format: 'b64_json',
      }),
    });

    const text = await resp.text();
    if (!resp.ok) {
      return { statusCode: resp.status, body: JSON.stringify({ error: 'OpenAI error', details: text }) };
    }

    const data = JSON.parse(text);
    const b64: string | undefined = data?.data?.[0]?.b64_json;
    if (!b64) {
      return { statusCode: 502, body: JSON.stringify({ error: 'No image data returned', details: data }) };
    }

    // Step 2: Convert base64 to Blob (skip external download step)
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
