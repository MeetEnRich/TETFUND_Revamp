const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const db = new Database(path.join(__dirname, 'tetfund.db'));
const CLONE_PATH = path.join(__dirname, '../clone/tetfund.gov.ng');

function readFile(filePath) {
  try { return fs.readFileSync(filePath, 'utf8'); }
  catch { return null; }
}

function cleanText(text) {
  return text ? text.replace(/\s+/g, ' ').trim() : '';
}

// ── 1. SEED ADMIN ─────────────────────────────────────────────────
function seedAdmin() {
  const existing = db.prepare("SELECT * FROM USERS WHERE Email = ?").get('admin@tetfund.gov.ng');
  if (!existing) {
    db.prepare(`INSERT INTO USERS (FullName, Email, PasswordHash, Role)
      VALUES (?, ?, ?, ?)`
    ).run('TETFund Administrator', 'admin@tetfund.gov.ng', '$2a$12$placeholder_hash', 'Administrator');
    console.log('Admin user seeded');
  } else {
    console.log('Admin already exists');
  }
}

// ── 2. SCRAPE NEWS FROM DETAIL PAGES ─────────────────────────────
function scrapeNews() {
  const adminID = db.prepare("SELECT UserID FROM USERS WHERE Role = 'Administrator'").get()?.UserID || 1;
  const insert = db.prepare(`
    INSERT OR IGNORE INTO NEWS (Title, Content, ImagePath, DatePosted, AdminID)
    VALUES (?, ?, ?, ?, ?)
  `);

  // First collect all news detail links from news.html
  const newsIndex = readFile(path.join(CLONE_PATH, 'news.html'));
  if (!newsIndex) { console.log('news.html not found'); return; }

  const $ = cheerio.load(newsIndex);
  const detailLinks = [];

  $('a[href*="news/details"]').each((i, el) => {
    const href = $(el).attr('href');
    if (href && !detailLinks.includes(href)) {
      detailLinks.push(href);
    }
  });

  console.log(`Found ${detailLinks.length} news detail links`);

  let count = 0;
  detailLinks.forEach(link => {
    // link is like "news/details/83.html"
    const filePath = path.join(CLONE_PATH, link);
    const content = readFile(filePath);
    if (!content) return;

    const $d = cheerio.load(content);

    // Extract from detail page
    const title = cleanText($d('h1, h2, .news-title, [class*="title"]').first().text());
    const body = cleanText($d('article, .news-content, .content, main p').text());
    const image = $d('article img, .news-image img, main img').first().attr('src') || null;
    const dateRaw = cleanText($d('time, .date, [class*="date"]').first().text());
    const date = dateRaw || new Date().toISOString().split('T')[0];

    if (title && title.length > 5) {
      insert.run(title, body || title, image, date, adminID);
      count++;
    }
  });

  console.log(`News seeded: ${count} articles`);
}

// ── 3. SCRAPE MANAGEMENT TEAM ─────────────────────────────────────
function scrapeTeam() {
  const file = readFile(path.join(CLONE_PATH, 'management.html')) ||
               readFile(path.join(CLONE_PATH, 'about.html'));
  if (!file) { console.log('Team file not found'); return; }

  const $ = cheerio.load(file);
  const results = [];

  // Look for team member cards
  $('div, section').filter((i, el) => {
    const cls = $(el).attr('class') || '';
    return cls.includes('team') || cls.includes('management') || cls.includes('staff') || cls.includes('member');
  }).each((i, el) => {
    const name = cleanText($(el).find('h2, h3, h4').first().text());
    const title = cleanText($(el).find('p').first().text());
    const image = $(el).find('img').first().attr('src') || null;
    if (name && name.length > 3) results.push({ name, title, image });
  });

  // Fallback: grab all img+h2/h3 pairs on the page
  if (results.length === 0) {
    $('img').each((i, el) => {
      const name = cleanText($(el).attr('alt') || '');
      const title = cleanText($(el).closest('div').find('p, h4, h5').first().text());
      const image = $(el).attr('src') || null;
      if (name && name.length > 5 && !name.toLowerCase().includes('logo')) {
        results.push({ name, title, image });
      }
    });
  }

  fs.writeFileSync(path.join(__dirname, 'team_seed.json'), JSON.stringify(results, null, 2));
  console.log(`Team members found: ${results.length}`);
}

// ── 4. SCRAPE DOCUMENTS ───────────────────────────────────────────
function scrapeDocuments() {
  const pages = ['index.html', 'resources.html', 'publications.html', 'downloads.html', 'interventions.html'];
  const docs = [];

  pages.forEach(page => {
    const content = readFile(path.join(CLONE_PATH, page));
    if (!content) return;
    const $ = cheerio.load(content);
    $('a').each((i, el) => {
      const href = $(el).attr('href') || '';
      if (href.match(/\.(pdf|doc|docx|zip)$/i)) {
        const label = cleanText($(el).text()) || path.basename(href);
        if (!docs.find(d => d.href === href)) {
          docs.push({ label, href, page });
        }
      }
    });
  });

  fs.writeFileSync(path.join(__dirname, 'documents_seed.json'), JSON.stringify(docs, null, 2));
  console.log(`Documents found: ${docs.length}`);
}

// ── 5. SCRAPE NAVIGATION ──────────────────────────────────────────
function scrapeNavigation() {
  const indexFile = readFile(path.join(CLONE_PATH, 'index.html'));
  if (!indexFile) return;

  const $ = cheerio.load(indexFile);
  const nav = [];

  $('.top-nav a, .main-nav a, nav a, header a').each((i, el) => {
    const label = cleanText($(el).text());
    const href = $(el).attr('href') || '#';
    if (label && label.length > 1 && !nav.find(n => n.label === label)) {
      nav.push({ label, href });
    }
  });

  fs.writeFileSync(path.join(__dirname, 'navigation_seed.json'), JSON.stringify(nav, null, 2));
  console.log(`Navigation links: ${nav.length}`);
}

// ── RUN ───────────────────────────────────────────────────────────
console.log('Starting TETFund scraper...\n');
seedAdmin();
scrapeNews();
scrapeTeam();
scrapeDocuments();
scrapeNavigation();
console.log('\nDone. Check database/ folder for seed files.');
db.close();
