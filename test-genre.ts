import { suggestGenre } from './src/ai/flows/suggest-genre';
import { config } from 'dotenv';
config({ path: '.env.local' });

async function test() {
  try {
    console.log('Testing genre suggestion...');
    const result = await suggestGenre({ 
      lyrics: "The sun goes down and the moon comes up, I'm feeling like I've had enough of this city life." 
    });
    console.log('Result:', result);
  } catch (err) {
    console.error('Test failed:', err);
  }
}

test().then(() => process.exit(0));
