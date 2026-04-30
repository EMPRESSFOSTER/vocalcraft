const { suggestGenre } = require('./src/ai/flows/suggest-genre');
require('dotenv').config({ path: '.env.local' });

async function test() {
  try {
    console.log('Testing genre suggestion...');
    // Mock the ai.definePrompt for investigation if needed, 
    // but first let's try direct call if Genkit handles ESM/CJS mix
    // Actually, Genkit 1.x is usually ESM. 
  } catch (err) {
    console.error('Test failed:', err);
  }
}
