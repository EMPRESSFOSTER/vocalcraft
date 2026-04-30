const fs = require('fs');
require('dotenv').config({ path: '.env.local' });
const keys = Object.keys(process.env).filter(k => k.match(/GOOGLE|GEMINI|GENAI|API|PROJECT/i));
fs.writeFileSync('env_keys_found.txt', keys.join('\n'));
