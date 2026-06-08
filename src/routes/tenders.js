const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
  const { category, status } = req.query;
  let query = "SELECT * FROM TENDERS WHERE 1=1";
  const params = [];
  if (category) { query += " AND Category = ?"; params.push(category); }
  if (status)   { query += " AND Status = ?";   params.push(status);   }
  query += " ORDER BY PublishedDate DESC";
  res.json(db.prepare(query).all(...params));
});

router.get('/:id', (req, res) => {
  const tender = db.prepare("SELECT * FROM TENDERS WHERE TenderID = ?").get(req.params.id);
  if (!tender) return res.status(404).json({ error: 'Not found' });
  res.json(tender);
});

module.exports = router;
