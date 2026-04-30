import { config } from 'dotenv';
config({ path: '.env.local' });

async function checkModels() {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error('API Key missing in .env.local');
    return;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.error) {
      console.error('API Error:', data.error);
    } else {
      console.log('Available Models:');
      data.models.forEach((m: any) => console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`));
    }
  } catch (e) {
    console.error('Fetch failed:', e);
  }
}

checkModels();
