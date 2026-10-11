const https = require('https');
const cheerio = require('cheerio');

https.get('https://www.shitsuren-tarot.com/tarot/minor-arcana/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const $ = cheerio.load(data);
    const links = [];
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim();
      if (href && (href.includes('wands') || href.includes('cups') || href.includes('swords') || href.includes('pentacles'))) {
        links.push({ href, text });
      }
    });
    console.log(JSON.stringify(links, null, 2));
  });
});
