const db = require('../src/config/db');
const bcrypt = require('bcryptjs');

console.log('Cleaning existing dummy data...');
db.prepare("DELETE FROM AUDIT_LOG").run();
db.prepare("DELETE FROM Submissions").run();
db.prepare("DELETE FROM Tenders").run();
db.prepare("DELETE FROM Users WHERE Role != 'Administrator'").run();

console.log('Seeding dummy data...');

// Insert Tenders
const tendersStmt = db.prepare(`
    INSERT INTO Tenders (Title, Description, Category, PublishedDate, ClosingDate, Status)
    VALUES (?, ?, ?, ?, ?, ?)
`);

const tendersData = [
    ["Construction of 500-Capacity Lecture Theatre", "Full construction and furnishing of a modern 500-capacity lecture theatre at Federal University of Lafia.", "Works", new Date(Date.now() - 86400000 * 2).toISOString(), new Date(Date.now() + 86400000 * 14).toISOString(), "Active"],
    ["Procurement of 100 Desktop Computers", "Supply and installation of 100 high-end desktop computers for the Computer Science Laboratory.", "Goods", new Date(Date.now() - 86400000 * 5).toISOString(), new Date(Date.now() + 86400000 * 7).toISOString(), "Active"],
    ["Campus Wi-Fi Infrastructure Upgrade", "Consultancy and implementation services for upgrading the university-wide Wi-Fi network infrastructure.", "Services", new Date(Date.now() - 86400000 * 1).toISOString(), new Date(Date.now() + 86400000 * 21).toISOString(), "Active"],
    ["Supply of Library Books and Journals", "Procurement of physical and digital medical journals for the College of Medicine.", "Goods", new Date(Date.now() - 86400000 * 10).toISOString(), new Date(Date.now() + 86400000 * 30).toISOString(), "Active"],
    ["Renovation of Student Hostels", "Comprehensive structural repair and painting of Block A and B student hostels.", "Works", new Date(Date.now() - 86400000 * 3).toISOString(), new Date(Date.now() + 86400000 * 12).toISOString(), "Active"],
    ["Supply and Installation of Solar Power Mini-Grid", "Design, procurement, and deployment of a 150kW solar hybrid mini-grid for campus-wide administrative buildings.", "Works", new Date(Date.now() - 86400000 * 6).toISOString(), new Date(Date.now() + 86400000 * 25).toISOString(), "Active"],
    ["Procurement of Science Laboratory Equipment", "Acquisition and calibration of chemical research testing apparatuses and spectrophotometers.", "Goods", new Date(Date.now() - 86400000 * 12).toISOString(), new Date(Date.now() + 86400000 * 15).toISOString(), "Active"],
    ["Development of Smart Classroom Software System", "Design and licensing of an integrated e-learning and lecture capture software suite for smart board devices.", "Services", new Date(Date.now() - 86400000 * 4).toISOString(), new Date(Date.now() + 86400000 * 18).toISOString(), "Active"],
    ["Construction of College of Medicine Complex", "Civil engineering works for the main administrative building and lecture block of the new College of Medicine.", "Works", new Date(Date.now() - 86400000 * 15).toISOString(), new Date(Date.now() + 86400000 * 45).toISOString(), "Active"],
    ["Provision of Janitorial Services", "Annual contract for cleaning and maintenance of the administrative building.", "Services", new Date(Date.now() - 86400000 * 40).toISOString(), new Date(Date.now() - 86400000 * 5).toISOString(), "Closed"]
];

const tenderIds = [];
for (const t of tendersData) {
    const info = tendersStmt.run(t);
    if (t[5] === 'Active') {
        tenderIds.push({ id: info.lastInsertRowid, title: t[0] });
    }
}

// Insert Companies (Contractors)
const hash = bcrypt.hashSync('Password123', 12);
const contractorsData = [
    ['Julius Berger Nigeria', 'bids@julius-berger.com'],
    ['CCECC Nigeria Ltd', 'bids@ccecc.com.ng'],
    ['Dantata & Sawoe Construction', 'bids@dantata-sawoe.com'],
    ['Zinox Technologies Ltd', 'bids@zinox.com.ng'],
    ['MainOne Cable Company', 'bids@mainone.net'],
    ['Honeywell Group', 'bids@honeywell.com.ng']
];

const contractorIds = [];
const userStmt = db.prepare(`INSERT INTO Users (FullName, Email, PasswordHash, Role) VALUES (?, ?, ?, 'Contractor')`);
for (const c of contractorsData) {
    const info = userStmt.run(c[0], c[1], hash);
    contractorIds.push({ id: info.lastInsertRowid, name: c[0] });
}

// Insert dummy submissions (Bids)
const subsStmt = db.prepare(`
    INSERT INTO Submissions (TenderID, UserID, FilePath, Timestamp, Status)
    VALUES (?, ?, ?, ?, ?)
`);

// Various mock companies bidding on various active tenders
const submissionsData = [
    // Tender 1: Lecture Theatre
    { tenderIdx: 0, contractorIdx: 0, file: 'julius_berger_lecture_theatre_proposal.pdf', status: 'Received' },
    { tenderIdx: 0, contractorIdx: 1, file: 'ccecc_lecture_theatre_bid_docs.zip', status: 'Under Evaluation' },
    { tenderIdx: 0, contractorIdx: 2, file: 'dantata_lecture_theatre_engineering_proposal.pdf', status: 'Rejected' },

    // Tender 2: Desktop Computers
    { tenderIdx: 1, contractorIdx: 3, file: 'zinox_desktops_technical_offer.pdf', status: 'Approved' },
    { tenderIdx: 1, contractorIdx: 5, file: 'honeywell_desktops_bid.zip', status: 'Rejected' },

    // Tender 3: Wi-Fi Upgrade
    { tenderIdx: 2, contractorIdx: 4, file: 'mainone_wifi_infrastructure_bid.pdf', status: 'Under Evaluation' },
    { tenderIdx: 2, contractorIdx: 3, file: 'zinox_network_upgrade_proposal.pdf', status: 'Received' },

    // Tender 4: Library Books
    { tenderIdx: 3, contractorIdx: 5, file: 'honeywell_medical_journals_list.pdf', status: 'Received' },

    // Tender 5: Student Hostels Renovation
    { tenderIdx: 4, contractorIdx: 0, file: 'julius_berger_hostels_renovation_costing.pdf', status: 'Under Evaluation' },
    { tenderIdx: 4, contractorIdx: 2, file: 'dantata_hostels_structural_repair_bid.zip', status: 'Approved' },

    // Tender 6: Solar Power Mini-Grid
    { tenderIdx: 5, contractorIdx: 1, file: 'ccecc_solar_grid_engineering_plan.pdf', status: 'Received' },
    { tenderIdx: 5, contractorIdx: 2, file: 'dantata_solar_grid_proposal.zip', status: 'Under Evaluation' },

    // Tender 7: Science Lab Equipment
    { tenderIdx: 6, contractorIdx: 3, file: 'zinox_lab_apparatus_specifications.pdf', status: 'Received' },

    // Tender 8: Smart Classroom Software
    { tenderIdx: 7, contractorIdx: 4, file: 'mainone_e_learning_platform_license.pdf', status: 'Approved' },
    { tenderIdx: 7, contractorIdx: 3, file: 'zinox_smartboard_classroom_software.zip', status: 'Rejected' },

    // Tender 9: College of Medicine Complex
    { tenderIdx: 8, contractorIdx: 0, file: 'julius_berger_medicine_complex_civil_works.pdf', status: 'Received' },
    { tenderIdx: 8, contractorIdx: 1, file: 'ccecc_medicine_complex_phase_1_bid.zip', status: 'Under Evaluation' },
    { tenderIdx: 8, contractorIdx: 2, file: 'dantata_medicine_complex_proposal.pdf', status: 'Received' }
];

let bidCount = 0;
for (const sub of submissionsData) {
    const tender = tenderIds[sub.tenderIdx];
    const contractor = contractorIds[sub.contractorIdx];
    if (tender && contractor) {
        const randomTime = new Date(Date.now() - Math.floor(Math.random() * 86400000 * 10)).toISOString();
        subsStmt.run(tender.id, contractor.id, sub.file, randomTime, sub.status);
        bidCount++;
    }
}

console.log(`Seeding completed! Added ${tendersData.length} tenders, ${contractorsData.length} contractors, and ${bidCount} bid submissions.`);
