const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function checkModels() {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    fs.writeFileSync('api_results.txt', 'API Key missing in .env.local');
    return;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.error) {
      fs.writeFileSync('api_results.txt', 'API Error: ' + JSON.stringify(data.error, null, 2));
    } else {
      const modelNames = data.models.map((m) => m.name + " (" + m.supportedGenerationMethods.join(',') + ")").join('\n');
      fs.writeFileSync('api_results.txt', 'Available Models:\n' + modelNames);
    }
  } catch (e) {
    fs.writeFileSync('api_results.txt', 'Fetch failed: ' + e.message);
  }
}

checkModels();
