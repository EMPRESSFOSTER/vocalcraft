const https = require('https');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
  fs.writeFileSync('models_debug.json', JSON.stringify({ error: 'No API Key' }));
  process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      fs.writeFileSync('models_debug.json', JSON.stringify(json, null, 2));
      const names = json.models?.map(m => m.name) || [];
      console.log('MODELS:', names.join(', '));
    } catch (e) {
      fs.writeFileSync('models_debug.json', data);
    }
  });
}).on('error', (e) => {
  fs.writeFileSync('models_debug.json', JSON.stringify({ error: e.message }));
});
