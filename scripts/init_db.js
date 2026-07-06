const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '../database/tetfund.db');
const schemaPath = path.join(__dirname, '../database/schema.sql');
const newsSeedPath = path.join(__dirname, '../database/news_seed.json');

console.log('Initializing database at:', dbPath);

// 1. Create/Open Database
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

// 2. Read and Execute Schema
console.log('Reading database schema...');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');
db.exec(schemaSql);
console.log('Database tables created successfully.');

// 3. Seed Administrator User (if not exists)
const adminEmail = 'admin@tetfund.gov.ng';
const adminCheck = db.prepare("SELECT * FROM USERS WHERE Email = ?").get(adminEmail);

if (!adminCheck) {
    console.log('Seeding administrator account...');
    const hash = bcrypt.hashSync('Admin123', 12);
    db.prepare(`
        INSERT INTO USERS (FullName, Email, PasswordHash, Role)
        VALUES ('Administrator', ?, ?, 'Administrator')
    `).run(adminEmail, hash);
    console.log('Admin account created: email: admin@tetfund.gov.ng | password: Admin123');
} else {
    console.log('Admin account already exists.');
}

// 4. Seed News Articles (if not exists)
const newsCount = db.prepare("SELECT COUNT(*) as count FROM NEWS").get().count;
if (newsCount === 0 && fs.existsSync(newsSeedPath)) {
    console.log('Seeding scraped news articles...');
    const newsList = JSON.parse(fs.readFileSync(newsSeedPath, 'utf8'));
    
    // Find the admin user ID to assign as author
    const admin = db.prepare("SELECT UserID FROM USERS WHERE Email = ?").get(adminEmail);
    const adminId = admin ? admin.UserID : 1;
    
    const insertNews = db.prepare(`
        INSERT INTO NEWS (Title, Content, ImagePath, DatePosted, AdminID)
        VALUES (?, ?, ?, ?, ?)
    `);
    
    const insertMany = db.transaction((articles) => {
        for (const a of articles) {
            insertNews.run(a.Title, a.Content, a.ImagePath || null, a.DatePosted, adminId);
        }
    });
    
    insertMany(newsList);
    console.log(`Seeded ${newsList.length} news articles successfully.`);
} else {
    console.log('News table already seeded or news_seed.json not found.');
}

console.log('Database initialization complete!');
