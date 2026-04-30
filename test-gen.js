const { genkit } = require('genkit');
const { googleAI } = require('@genkit-ai/google-genai');
require('dotenv').config({ path: '.env.local' });

async function main() {
  const ai = genkit({
    plugins: [googleAI()],
    model: 'googleai/gemini-2.0-flash',
  });

  try {
    console.log('Testing model with simple prompt...');
    const response = await ai.generate('Hello, are you there?');
    console.log('Response:', response.text);
  } catch (err) {
    console.error('Test failed:', err.message || err);
  }
}

main().then(() => process.exit(0));
