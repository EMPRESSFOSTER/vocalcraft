const { genkit } = require('genkit');
const { googleAI } = require('@genkit-ai/google-genai');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function testAll() {
  const ai = genkit({
    plugins: [googleAI()],
  });

  // These are from the user's provided list
  const candidates = [
    'googleai/gemini-flash-latest',
    'googleai/gemini-pro-latest',
    'googleai/gemini-2.0-flash-lite',
    'googleai/gemini-1.5-flash',
    'googleai/gemini-1.5-pro',
  ];

  let log = '--- MODEL QUOTA TEST ---\n';
  for (const model of candidates) {
    try {
      log += `Testing ${model}... `;
      const res = await ai.generate({
        model,
        prompt: 'hi',
      });
      log += `SUCCESS: ${res.text.substring(0, 20)}...\n`;
      log += `\n>>> FOUND WORKING MODEL: ${model} <<<\n`;
      break; 
    } catch (err) {
      log += `FAILED: ${err.message}\n`;
    }
  }

  console.log(log);
  fs.writeFileSync('quota_test_results.txt', log);
}

testAll().then(() => process.exit(0));
