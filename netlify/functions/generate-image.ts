import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// Remove PII-like terms and sensitive attributes to avoid policy blocks
function sanitizePrompt(input: string): string {
  const lowered = input.toLowerCase();
  // Remove age, gender, ethnicity, unique identifiers
  let p = lowered
    .replace(/\b\d{1,2}\s*year\s*old\b/g, '')
    .replace(/\b(male|female|non\s*binary|man|woman|boy|girl)\b/g, '')
    .replace(/\b(caucasian|white|black|african american|asian|hispanic|latino|middle eastern|indian|european|pacific islander|native american|ethnicity)\b/g, '')
    .replace(/\bphoto id\b|\bunique individual\b|\bseed\b|\bssn\b|\bidentifier\b/g, '')
    .replace(/\s+/g, ' ') // collapse whitespace
    .trim();

  // Compose safe, neutral headshot style with strong photorealism emphasis
  const base = 'Photorealistic professional business headshot portrait photograph, real human person, polished business attire, neutral studio background, professional portrait lighting, sharp focus, natural skin texture, realistic facial features, corporate photography style, high-resolution professional headshot, studio quality';
  return `${base}, ${p}`;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!OPENAI_API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: 'OPENAI_API_KEY not configured' }) };
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Supabase credentials not configured' }) };
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

    const imageBuffer = await imageResp.arrayBuffer();
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
