const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const vars = Object.keys(process.env).filter(k => 
  k.includes('GOOGLE') || k.includes('GEMINI') || k.includes('GENAI') || k.includes('PROJECT')
);

fs.writeFileSync('env_vars_check.txt', vars.join('\n'));
