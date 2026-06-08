const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const db = new Database(path.join(__dirname, 'tetfund.db'));
const CLONE = path.join(__dirname, '../clone/tetfund.gov.ng');

db.prepare("DELETE FROM NEWS").run();

const adminID = db.prepare("SELECT UserID FROM USERS WHERE Role = 'Administrator'").get().UserID;
const insert = db.prepare(
  "INSERT INTO NEWS (Title, Content, ImagePath, DatePosted, AdminID) VALUES (?, ?, ?, ?, ?)"
);

const newsIndex = fs.readFileSync(path.join(CLONE, 'news.html'), 'utf8');
const $idx = cheerio.load(newsIndex);
const links = [];
$idx('a[href*="news/details"]').each((i, el) => {
  const href = $idx(el).attr('href');
  if (href && !links.includes(href)) links.push(href);
});

let seeded = 0;
links.forEach(link => {
  const filePath = path.join(CLONE, link);
  if (!fs.existsSync(filePath)) return;

  const raw = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(raw);

  // Remove nav, header, footer, newsletter sections before extracting
  $('nav, header, footer, form, script, style').remove();
  $('[class*="newsletter"]').remove();
  $('[class*="nav"]').remove();
  $('[class*="footer"]').remove();
  $('[class*="menu"]').remove();

  // Now grab the first meaningful heading
  let title = '';
  $('h1, h2, h3').each((i, el) => {
    const t = $(el).text().trim();
    if (t.length > 10 && t.length < 200 && !title) title = t;
  });

  // Fallback: first bold paragraph
  if (!title) {
    $('p').each((i, el) => {
      const t = $(el).text().trim();
      if (t.length > 15 && t.length < 200 && !title) title = t;
    });
  }

  // Content: all remaining paragraphs
  const paragraphs = [];
  $('p').each((i, el) => {
    const t = $(el).text().trim();
    if (t.length > 30) paragraphs.push(t);
  });
  const body = paragraphs.join(' ').substring(0, 2000) || title;

  const img = $('img[src*="cloudinary"]').first().attr('src') || null;
  const dateRaw = $('time').first().attr('datetime') || $('time').first().text().trim() || '';
  const date = dateRaw || new Date().toISOString().split('T')[0];

  if (!title) title = 'TETFund News ' + path.basename(link, '.html');

  insert.run(title, body, img, date, adminID);
  seeded++;
});

console.log('News re-seeded: ' + seeded);

const sample = db.prepare("SELECT NewsID, Title FROM NEWS LIMIT 10").all();
console.log('\nTitles:');
sample.forEach(r => console.log(' [' + r.NewsID + '] ' + r.Title));

db.close();
