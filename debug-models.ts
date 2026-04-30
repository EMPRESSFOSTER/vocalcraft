import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const ai = genkit({
  plugins: [googleAI()],
});

async function main() {
  try {
    const actions = await ai.registry.listActions();
    const models = Object.keys(actions).filter(a => a.startsWith('model/'));
    console.log('REGISTERED_MODELS:' + JSON.stringify(models));
    
    // Try to generate with the first one found
    if (models.length > 0) {
      console.log('Attempting generation with: ' + models[0]);
      const res = await ai.generate({
        model: models[0],
        prompt: 'test',
      });
      console.log('SUCCESS:' + res.text);
    } else {
      console.log('NO_MODELS_FOUND');
    }
  } catch (e) {
    console.log('ERROR:' + (e.message || e));
  }
}

main();
