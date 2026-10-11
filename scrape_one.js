const https = require('https');
const cheerio = require('cheerio');

https.get('https://www.shitsuren-tarot.com/tarot/ace-of-wands/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const $ = cheerio.load(data);
    const content = $('.entry-content p').text().trim().substring(0, 500);
    console.log(content);
  });
});
