const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/db');
const { authenticate, requireRole } = require('../middleware/auth');
const nodemailer = require('nodemailer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}_${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'application/zip',
                     'application/x-zip-compressed', 'application/octet-stream'];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new Error('Only PDF and ZIP files are accepted'));
  }
});

router.post('/', authenticate, requireRole('Contractor'), upload.single('bidDocument'), (req, res) => {
  const { tenderID, category } = req.body;

  if (!category || !['Works','Goods','Services'].includes(category)) {
    return res.status(400).json({ error: 'A valid procurement category must be selected' });
  }
  if (!req.file) {
    return res.status(400).json({ error: 'A bid document is required' });
  }

  const tender = db.prepare("SELECT * FROM TENDERS WHERE TenderID = ? AND Status = 'Active'").get(tenderID);
  if (!tender) return res.status(404).json({ error: 'Tender not found or closed' });

  const now = new Date();
  if (now > new Date(tender.ClosingDate)) {
    return res.status(400).json({ error: 'The closing date for this tender has passed' });
  }

  const duplicate = db.prepare(
    "SELECT * FROM SUBMISSIONS WHERE UserID = ? AND TenderID = ?"
  ).get(req.user.id, tenderID);
  if (duplicate) return res.status(400).json({ error: 'You have already submitted for this tender' });

  const result = db.prepare(
    "INSERT INTO SUBMISSIONS (UserID, TenderID, FilePath, Status) VALUES (?, ?, ?, 'Received')"
  ).run(req.user.id, tenderID, req.file.filename);

  db.prepare(
    "INSERT INTO AUDIT_LOG (EventType, UserID, AffectedRecord, IPAddress) VALUES (?, ?, ?, ?)"
  ).run('Submission', req.user.id, result.lastInsertRowid, req.ip);

  res.json({
    submissionID: result.lastInsertRowid,
    message: 'Your bid has been received successfully',
    timestamp: now.toISOString()
  });
});

router.get('/mine', authenticate, requireRole('Contractor'), (req, res) => {
  const subs = db.prepare(`
    SELECT s.*, t.Title as TenderTitle, t.Category
    FROM SUBMISSIONS s JOIN TENDERS t ON s.TenderID = t.TenderID
    WHERE s.UserID = ? ORDER BY s.Timestamp DESC
  `).all(req.user.id);
  res.json(subs);
});

module.exports = router;
