import OpenAI from 'openai';

let openai = null;

// Create the client on first use, after .env has loaded
function getClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Server misconfigured: OPENAI_API_KEY is missing');
  }
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

// Call OpenAI API for dream interpretation
export async function getDreamInterpretation(dreamText) {
  const client = getClient();
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  try {
    const response = await client.chat.completions.create({
      model,
      max_tokens: 512,
      messages: [
        {
          role: 'system',
          content: 'You are a thoughtful dream interpreter. Be insightful but gentle, and consider common dream symbolism. Keep your interpretation to 2-3 paragraphs.'
        },
        {
          role: 'user',
          content: `Dream: ${dreamText}`
        }
      ]
    });

    const text = response.choices?.[0]?.message?.content;
    if (!text) {
      throw new Error('Empty response from OpenAI');
    }
    return text.trim();
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`API error: ${error.message}`);
  }
}