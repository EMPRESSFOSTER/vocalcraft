const { genkit } = require('genkit');
const { googleAI } = require('@genkit-ai/google-genai');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function testModels() {
  const ai = genkit({
    plugins: [googleAI()],
  });

  const candidates = [
    'googleai/gemini-1.5-flash',
    'googleai/gemini-1.5-flash-8b',
    'googleai/gemini-1.5-pro',
    'googleai/gemini-pro',
    'googleai/gemini-1.5-flash-001',
    'googleai/gemini-1.5-flash-002',
  ];

  let log = '';
  for (const model of candidates) {
    try {
      log += `Testing ${model}... `;
      const res = await ai.generate({
        model,
        prompt: 'say hi',
      });
      log += `SUCCESS: ${res.text}\n`;
      break; // Stop at first success
    } catch (err) {
      log += `FAILED: ${err.message}\n`;
    }
  }

  fs.writeFileSync('model_test_results.txt', log);
}

testModels().then(() => process.exit(0));
