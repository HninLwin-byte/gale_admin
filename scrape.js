const https = require('https');
https.get('https://www.shitsuren-tarot.com/tarot/minor-arcana/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const lines = data.split('\n');
    let output = [];
    lines.forEach(line => {
      if(line.includes('<a') && line.includes('href') && line.includes('/tarot/minor-arcana/')) {
        output.push(line.trim());
      }
    });
    console.log("Links found:");
    console.log(output.slice(0, 10).join('\n'));
  });
});
