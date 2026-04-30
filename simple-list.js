const https = require('https');
const apiKey = 'REDACTED'; // I'll try to get it from environment in the command

function list() {
  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: '/v1beta/models?key=' + process.env.GOOGLE_API_KEY,
    method: 'GET'
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log(data);
    });
  });

  req.on('error', (e) => {
    console.error(e);
  });
  req.end();
}

list();
