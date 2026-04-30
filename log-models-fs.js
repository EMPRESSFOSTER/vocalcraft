const { genkit } = require('genkit');
const { googleAI } = require('@genkit-ai/google-genai');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function listModels() {
  const ai = genkit({
    plugins: [googleAI()],
  });

  let output = '';
  try {
    const actions = await ai.registry.listActions();
    const models = Object.keys(actions)
      .filter(key => key.startsWith('model/'))
      .map(key => key.replace('model/', ''));
    
    output += '--- ALL REGISTERED MODELS ---\n';
    output += JSON.stringify(models, null, 2) + '\n';
    output += '-----------------------------\n';

    const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY;
    output += 'API Key starts with: ' + (apiKey ? apiKey.substring(0, 5) : 'MISSING') + '\n';
    
    fs.writeFileSync('models_actual_list.txt', output);
  } catch (err) {
    fs.writeFileSync('models_actual_list.txt', 'Error: ' + err.message);
  }
}

listModels().then(() => process.exit(0));
