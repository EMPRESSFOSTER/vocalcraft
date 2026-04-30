require('dotenv').config({path:'.env.local'});
const k = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY;

async function test(model) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${k}`;
  const body = JSON.stringify({
    contents: [{ parts: [{ text: "hi" }] }]
  });

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    });
    const j = await r.json();
    if (j.error) return `FAILED: ${j.error.message}`;
    return `SUCCESS: ${j.candidates[0].content.parts[0].text.substring(0, 10)}`;
  } catch (e) {
    return `ERROR: ${e.message}`;
  }
}

async function run() {
  const models = [
    'gemini-flash-latest',
    'gemini-pro-latest',
    'gemini-1.5-flash',
    'gemini-2.0-flash-lite',
    'gemini-1.5-pro'
  ];
  for (const m of models) {
    const res = await test(m);
    console.log(`${m}: ${res}`);
    if (res.startsWith('SUCCESS')) {
      console.log(`USE THIS: ${m}`);
      process.exit(0);
    }
  }
}

run();
