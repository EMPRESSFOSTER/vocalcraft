import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { config } from 'dotenv';
config({ path: '.env.local' });

const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-pro-latest',
});

async function main() {
  try {
    console.log('Testing model with simple prompt...');
    const response = await ai.generate('Hello, are you there?');
    console.log('Response:', response.text);
  } catch (err: any) {
    console.error('Test failed:', err);
    if (err.message) {
      console.error('Error message:', err.message);
    }
  }
}

main().then(() => process.exit(0)).catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
