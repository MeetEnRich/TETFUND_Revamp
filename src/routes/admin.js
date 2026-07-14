const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate, requireRole } = require('../middleware/auth');

// All admin routes require authentication and Administrator role
router.use(authenticate, requireRole('Administrator'));

// Create a new tender
router.post('/tenders', (req, res) => {
  const { title, description, category, publishedDate, closingDate, status } = req.body;
  if (!title || !description || !category || !publishedDate || !closingDate) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const result = db.prepare(
    "INSERT INTO TENDERS (Title, Description, Category, PublishedDate, ClosingDate, Status, AdminID) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(title, description, category, publishedDate, closingDate, status || 'Draft', req.user.id);

  db.prepare(
    "INSERT INTO AUDIT_LOG (EventType, UserID, AffectedRecord, IPAddress) VALUES (?, ?, ?, ?)"
  ).run('Create Tender', req.user.id, result.lastInsertRowid, req.ip);

  res.json({ message: 'Tender created successfully', tenderID: result.lastInsertRowid });
});

// Update a tender
router.put('/tenders/:id', (req, res) => {
  const { title, description, category, closingDate, status } = req.body;
  
  db.prepare(
    "UPDATE TENDERS SET Title = ?, Description = ?, Category = ?, ClosingDate = ?, Status = ? WHERE TenderID = ?"
  ).run(title, description, category, closingDate, status, req.params.id);

  db.prepare(
    "INSERT INTO AUDIT_LOG (EventType, UserID, AffectedRecord, IPAddress) VALUES (?, ?, ?, ?)"
  ).run('Update Tender', req.user.id, req.params.id, req.ip);

  res.json({ message: 'Tender updated successfully' });
});

// View all submissions with user and tender details
router.get('/submissions', (req, res) => {
  const subs = db.prepare(`
    SELECT s.*, t.Title as TenderTitle, t.Category, u.FullName, u.Email
    FROM SUBMISSIONS s 
    JOIN TENDERS t ON s.TenderID = t.TenderID
    JOIN USERS u ON s.UserID = u.UserID
    ORDER BY s.Timestamp DESC
  `).all();
  res.json(subs);
});

// Update submission status
router.put('/submissions/:id/status', (req, res) => {
  const { status } = req.body;
  if (!['Received','Under Evaluation','Approved','Rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  db.prepare("UPDATE SUBMISSIONS SET Status = ? WHERE SubmissionID = ?").run(status, req.params.id);

  db.prepare(
    "INSERT INTO AUDIT_LOG (EventType, UserID, AffectedRecord, IPAddress) VALUES (?, ?, ?, ?)"
  ).run('Update Submission Status', req.user.id, req.params.id, req.ip);

  res.json({ message: 'Submission status updated successfully' });
});

// Publish news article
router.post('/news', (req, res) => {
  const { title, content, imagePath } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const today = new Date().toISOString().split('T')[0];
  
  const result = db.prepare(
    "INSERT INTO NEWS (Title, Content, ImagePath, DatePosted, AdminID) VALUES (?, ?, ?, ?, ?)"
  ).run(title, content, imagePath || null, today, req.user.id);

  db.prepare(
    "INSERT INTO AUDIT_LOG (EventType, UserID, AffectedRecord, IPAddress) VALUES (?, ?, ?, ?)"
  ).run('Publish News', req.user.id, result.lastInsertRowid, req.ip);

  res.json({ message: 'News published successfully', newsID: result.lastInsertRowid });
});

// Get dashboard stats
router.get('/stats', (req, res) => {
  const totalSubmissions = db.prepare("SELECT COUNT(*) as count FROM SUBMISSIONS").get().count;
  const activeTenders = db.prepare("SELECT COUNT(*) as count FROM TENDERS WHERE Status = 'Active'").get().count;
  const registeredContractors = db.prepare("SELECT COUNT(*) as count FROM USERS WHERE Role = 'Contractor'").get().count;
  
  res.json({
    totalSubmissions,
    activeTenders,
    registeredContractors
  });
});

// Delete a tender and its associated submissions
router.delete('/tenders/:id', (req, res) => {
  const tenderID = req.params.id;

  const deleteSubmissions = db.prepare("DELETE FROM SUBMISSIONS WHERE TenderID = ?");
  const deleteTender = db.prepare("DELETE FROM TENDERS WHERE TenderID = ?");

  const deleteTx = db.transaction((id) => {
    deleteSubmissions.run(id);
    deleteTender.run(id);
  });

  deleteTx(tenderID);

  db.prepare(
    "INSERT INTO AUDIT_LOG (EventType, UserID, AffectedRecord, IPAddress) VALUES (?, ?, ?, ?)"
  ).run('Delete Tender', req.user.id, tenderID, req.ip);

  res.json({ message: 'Tender and its submissions deleted successfully' });
});

// Delete a news article
router.delete('/news/:id', (req, res) => {
  const newsID = req.params.id;
  
  db.prepare("DELETE FROM NEWS WHERE NewsID = ?").run(newsID);

  db.prepare(
    "INSERT INTO AUDIT_LOG (EventType, UserID, AffectedRecord, IPAddress) VALUES (?, ?, ?, ?)"
  ).run('Delete News', req.user.id, newsID, req.ip);

  res.json({ message: 'News article deleted successfully' });
});

module.exports = router;
