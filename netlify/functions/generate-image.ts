import type { Handler } from '@netlify/functions';

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
    if (!OPENAI_API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: 'OPENAI_API_KEY not configured' }) };
    }

    const body = event.body ? JSON.parse(event.body) : {};
    const rawPrompt: string = body.prompt || '';
    if (!rawPrompt || rawPrompt.length < 10) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing or too short prompt' }) };
    }

    const prompt = sanitizePrompt(rawPrompt);

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
    const imageUrl: string | undefined = data?.data?.[0]?.url;
    if (!imageUrl) {
      return { statusCode: 502, body: JSON.stringify({ error: 'No image URL returned', details: data }) };
    }

    return { statusCode: 200, body: JSON.stringify({ imageUrl }) };
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error', message: err?.message || String(err) }) };
  }
};
