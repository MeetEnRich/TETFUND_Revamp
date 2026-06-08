const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const db = new Database(path.join(__dirname, 'tetfund.db'));
const CLONE = path.join(__dirname, '../clone/tetfund.gov.ng');

// ── 1. FIX TEAM ───────────────────────────────────────────────
function scrapeTeam() {
  const file = fs.readFileSync(path.join(CLONE, 'management.html'), 'utf8');
  const $ = cheerio.load(file);
  const results = [];

  $('p.mb-2').each((i, el) => {
    const name = $(el).text().trim();
    if (!name || name.length < 3) return;
    const card = $(el).closest('div');
    const img = card.find('img').first().attr('src') || null;
    results.push({ name, position: '', image: img });
  });

  fs.writeFileSync(path.join(__dirname, 'team_seed.json'), JSON.stringify(results, null, 2));
  console.log('Team members saved: ' + results.length);
  results.forEach(r => console.log(' - ' + r.name));
}

// ── 2. FIX NEWS (re-seed with better content) ─────────────────
function fixNews() {
  const adminID = db.prepare("SELECT UserID FROM USERS WHERE Role = 'Administrator'").get().UserID;

  // Clear bad news entries first
  db.prepare("DELETE FROM NEWS").run();
  console.log('Cleared old news entries');

  const insert = db.prepare(
    "INSERT INTO NEWS (Title, Content, ImagePath, DatePosted, AdminID) VALUES (?, ?, ?, ?, ?)"
  );

  // Collect all detail links from news listing
  const newsIndex = fs.readFileSync(path.join(CLONE, 'news.html'), 'utf8');
  const $idx = cheerio.load(newsIndex);
  const links = [];
  $idx('a[href*="news/details"]').each((i, el) => {
    const href = $idx(el).attr('href');
    if (href && !links.includes(href)) links.push(href);
  });

  console.log('News links found: ' + links.length);

  let seeded = 0;
  links.forEach(link => {
    const filePath = path.join(CLONE, link);
    if (!fs.existsSync(filePath)) return;

    const content = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(content);

    // Title: try multiple selectors
    let title = $('h1').first().text().trim() ||
                $('h2').first().text().trim() ||
                $('[class*="title"]').first().text().trim() ||
                $('p.font-bold').first().text().trim();

    // Content: grab all meaningful p tags
    const paragraphs = [];
    $('p').each((i, el) => {
      const t = $(el).text().trim();
      if (t.length > 30) paragraphs.push(t);
    });
    const body = paragraphs.join(' ').substring(0, 2000) || title;

    // Image
    const img = $('article img, main img, .news img').first().attr('src') ||
                $('img[src*="cloudinary"]').first().attr('src') || null;

    // Date
    const dateRaw = $('time').first().attr('datetime') ||
                    $('time').first().text().trim() ||
                    $('[class*="date"]').first().text().trim();
    const date = dateRaw || new Date().toISOString().split('T')[0];

    // Fallback title from link
    if (!title) title = 'TETFund News ' + path.basename(link, '.html');

    if (title) {
      insert.run(title, body, img, date, adminID);
      seeded++;
    }
  });

  console.log('News re-seeded: ' + seeded + ' articles');

  // Show what we got
  const sample = db.prepare("SELECT NewsID, Title, substr(Content,1,80) as Preview FROM NEWS LIMIT 5").all();
  console.log('\nSample NEWS entries:');
  sample.forEach(r => console.log(' [' + r.NewsID + '] ' + r.Title + ' | ' + r.Preview));
}

// ── 3. CHECK NAV ──────────────────────────────────────────────
function checkNav() {
  const nav = JSON.parse(fs.readFileSync(path.join(__dirname, 'navigation_seed.json'), 'utf8'));
  console.log('\nNavigation links (' + nav.length + '):');
  nav.slice(0, 10).forEach(n => console.log(' ' + n.label + ' -> ' + n.href));
}

scrapeTeam();
fixNews();
checkNav();
db.close();
console.log('\nAll done.');
