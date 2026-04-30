require('dotenv').config({path:'.env.local'});
const k = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY;

async function test() {
  const model = 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${k}`;
  const data = {
    contents: [{ parts: [{ text: "Suggest a music genre for these lyrics: 'I love the way you dance under the moon'" }] }],
    generationConfig: {
        response_mime_type: "application/json",
        response_schema: {
            type: "object",
            properties: {
                genre: { type: "string" }
            },
            required: ["genre"]
        }
    }
  };

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const j = await r.json();
    console.log(JSON.stringify(j, null, 2));
  } catch (e) {
    console.error(e);
  }
}

test();
