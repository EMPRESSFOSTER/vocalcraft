const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    fs.writeFileSync('direct_test.txt', 'API key missing');
    return;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const models = ['gemini-1.5-flash', 'gemini-1.5-flash-8b', 'gemini-pro'];
  let results = '';

  for (const m of models) {
    try {
      results += `Testing ${m}... `;
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent("hi");
      results += `SUCCESS: ${result.response.text()}\n`;
      break;
    } catch (e) {
      results += `FAILED: ${e.message}\n`;
    }
  }
  fs.writeFileSync('direct_test.txt', results);
}
run().then(() => process.exit(0));
