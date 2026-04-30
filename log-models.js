const { genkit } = require('genkit');
const { googleAI } = require('@genkit-ai/google-genai');
require('dotenv').config({ path: '.env.local' });

async function listModels() {
  const ai = genkit({
    plugins: [googleAI()],
  });

  try {
    const actions = await ai.registry.listActions();
    const models = Object.keys(actions)
      .filter(key => key.startsWith('model/'))
      .map(key => key.replace('model/', ''));
    
    console.log('--- ALL REGISTERED MODELS ---');
    console.log(JSON.stringify(models, null, 2));
    console.log('-----------------------------');

    const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY;
    console.log('API Key starts with:', apiKey ? apiKey.substring(0, 5) : 'MISSING');
  } catch (err) {
    console.error('Error listing models:', err);
  }
}

listModels();
