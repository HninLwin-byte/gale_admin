const https = require('https');
const fs = require('fs');
const cheerio = require('cheerio');

const suits = ["wands", "cups", "swords", "pentacles"];
const numbers = ["ace", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "page", "knight", "queen", "king"];

const major = [
  "the-fool", "the-magician", "the-high-priestess", "the-empress", "the-emperor",
  "the-hierophant", "the-lovers", "the-chariot", "strength", "the-hermit",
  "wheel-of-fortune", "justice", "the-hanged-man", "death", "temperance",
  "the-devil", "the-tower", "the-star", "the-moon", "the-sun", "judgement", "the-world"
];

const urls = [];
major.forEach(m => urls.push({ name: m.replace(/-/g, ' '), type: 'Major Arcana', slug: m }));
suits.forEach(suit => {
  numbers.forEach(num => {
    urls.push({ name: `${num} of ${suit}`, type: 'Minor Arcana', slug: `${num}-of-${suit}` });
  });
});

const results = [];

function fetchPage(card) {
  return new Promise((resolve) => {
    https.get(`https://www.shitsuren-tarot.com/tarot/${card.slug}/`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, (res) => {
      if (res.statusCode !== 200) {
        resolve({ ...card, meaning: "Meaning not available." });
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const $ = cheerio.load(data);
        const ps = [];
        $('p').each((i, el) => {
          const txt = $(el).text().trim();
          if (txt.length > 50 && !txt.includes('shitsuren')) ps.push(txt);
        });
        resolve({ ...card, meaning: ps.slice(0, 3).join('\n\n') || "Meaning not available." });
      });
    }).on('error', () => resolve({ ...card, meaning: "Error fetching meaning." }));
  });
}

async function run() {
  console.log("Fetching 78 cards...");
  const batchSize = 10;
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const res = await Promise.all(batch.map(fetchPage));
    results.push(...res);
    console.log(`Fetched ${results.length}/78`);
  }
  
  const jsContent = `const tarotCards = ${JSON.stringify(results, null, 2)};\n`;
  fs.writeFileSync('tarotData.js', jsContent);
  console.log("Done writing tarotData.js");
}

run();
