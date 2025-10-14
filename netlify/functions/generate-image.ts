import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

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

  // Compose realistic DSLR headshot prompt
  const base = `Professional headshot photo of a ${ageRange} year old ${profession}, taken with a DSLR camera. Realistic lighting, soft background (gray or light neutral), wearing business professional attire. Natural facial expression, confident and approachable. No artistic filters, no hyper-realism, realistic human photo. Natural skin texture with minor imperfections, authentic photography, corporate headshot style`;
  
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
        size: '1024x1024',
        quality: 'standard',
      }),
    });

    const text = await resp.text();
    if (!resp.ok) {
      return { statusCode: resp.status, body: JSON.stringify({ error: 'OpenAI error', details: text }) };
    }

    const data = JSON.parse(text);
    const tempImageUrl: string | undefined = data?.data?.[0]?.url;
    if (!tempImageUrl) {
      return { statusCode: 502, body: JSON.stringify({ error: 'No image URL returned', details: data }) };
    }

    // Step 2: Download the image from DALL-E's temporary URL
    const imageResp = await fetch(tempImageUrl);
    if (!imageResp.ok) {
      return { statusCode: 502, body: JSON.stringify({ error: 'Failed to download generated image' }) };
    }

    const imageArrayBuffer = await imageResp.arrayBuffer();
    const imageBuffer = Buffer.from(imageArrayBuffer);

    // Step 3: Upload to Supabase Storage for permanent storage
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const fileName = `${personaId}-${Date.now()}.png`;
    const filePath = `persona-avatars/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('persona-images')
      .upload(filePath, imageBuffer, {
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
