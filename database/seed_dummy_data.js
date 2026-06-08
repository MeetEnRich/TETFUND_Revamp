const db = require('../src/config/db');

console.log('Seeding dummy data...');

// Insert some Tenders
const tendersStmt = db.prepare(`
    INSERT INTO Tenders (Title, Description, Category, PublishedDate, ClosingDate, Status)
    VALUES (?, ?, ?, ?, ?, ?)
`);

const tenders = [
    ["Construction of 500-Capacity Lecture Theatre", "Full construction and furnishing of a modern 500-capacity lecture theatre at Federal University of Lafia.", "Works", new Date(Date.now() - 86400000 * 2).toISOString(), new Date(Date.now() + 86400000 * 14).toISOString(), "Active"],
    ["Procurement of 100 Desktop Computers", "Supply and installation of 100 high-end desktop computers for the Computer Science Laboratory.", "Goods", new Date(Date.now() - 86400000 * 5).toISOString(), new Date(Date.now() + 86400000 * 7).toISOString(), "Active"],
    ["Campus Wi-Fi Infrastructure Upgrade", "Consultancy and implementation services for upgrading the university-wide Wi-Fi network infrastructure.", "Services", new Date(Date.now() - 86400000 * 1).toISOString(), new Date(Date.now() + 86400000 * 21).toISOString(), "Active"],
    ["Supply of Library Books and Journals", "Procurement of physical and digital medical journals for the College of Medicine.", "Goods", new Date(Date.now() - 86400000 * 10).toISOString(), new Date(Date.now() + 86400000 * 30).toISOString(), "Active"],
    ["Renovation of Student Hostels", "Comprehensive structural repair and painting of Block A and B student hostels.", "Works", new Date(Date.now() - 86400000 * 3).toISOString(), new Date(Date.now() + 86400000 * 12).toISOString(), "Active"],
    ["Provision of Janitorial Services", "Annual contract for cleaning and maintenance of the administrative building.", "Services", new Date(Date.now() - 86400000 * 40).toISOString(), new Date(Date.now() - 86400000 * 5).toISOString(), "Closed"],
];

let activeTenderIds = [];
for (const t of tenders) {
    const info = tendersStmt.run(t);
    if (t[5] === 'Active') activeTenderIds.push(info.lastInsertRowid);
}

// Ensure at least one contractor user exists
let contractorId;
const userCheck = db.prepare("SELECT UserID FROM Users WHERE Role = 'Contractor'").get();
if (!userCheck) {
    const bcrypt = require('bcryptjs');
    const hash = bcrypt.hashSync('Password123', 12);
    const info = db.prepare(`INSERT INTO Users (FullName, Email, PasswordHash, Role) VALUES (?, ?, ?, ?)`).run(
        'Julius Berger Nigeria', 'bids@julius-berger.com', hash, 'Contractor'
    );
    contractorId = info.lastInsertRowid;
} else {
    contractorId = userCheck.UserID;
}

// Insert dummy submissions
const subsStmt = db.prepare(`
    INSERT INTO Submissions (TenderID, UserID, FilePath, Timestamp, Status)
    VALUES (?, ?, ?, ?, ?)
`);

const statuses = ["Received", "Under Evaluation", "Approved", "Rejected"];

let i = 1;
for (const tenderId of activeTenderIds) {
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomTime = new Date(Date.now() - Math.floor(Math.random() * 86400000 * 5)).toISOString();
    
    subsStmt.run(tenderId, contractorId, `dummy_bid_file_${i}.pdf`, randomTime, randomStatus);
    i++;
}

console.log('Seeding completed! Added 6 tenders and 10 submissions.');
