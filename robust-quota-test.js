const https = require('https');
require('dotenv').config({path:'.env.local'});
const k = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY;

function test(model) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      contents: [{ parts: [{ text: "hi" }] }]
    });
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/${model}:generateContent?key=${k}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          const j = JSON.parse(body);
          if (j.error) resolve(`FAILED: ${j.error.message}`);
          else resolve(`SUCCESS: ${j.candidates[0].content.parts[0].text.substring(0, 10)}`);
        } catch (e) {
          resolve(`ERROR: ${body.substring(0, 100)}`);
        }
      });
    });

    req.on('error', e => resolve(`REQ_ERROR: ${e.message}`));
    req.write(data);
    req.end();
  });
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
      console.log(`\n>>> USE THIS: ${m} <<<\n`);
      process.exit(0);
    }
  }
}

run();
