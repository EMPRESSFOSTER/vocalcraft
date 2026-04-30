import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const ai = genkit({
  plugins: [googleAI()],
});

async function main() {
  const actions = await ai.registry.listActions();
  const models = Object.keys(actions).filter(a => a.startsWith('model/'));
  console.log('--- REGISTERED MODELS ---');
  models.forEach(m => console.log(m));
  console.log('-------------------------');
}

main().catch(console.error);
