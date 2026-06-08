const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
  const news = db.prepare("SELECT * FROM NEWS ORDER BY DatePosted DESC LIMIT 20").all();
  res.json(news);
});

router.get('/:id', (req, res) => {
  const item = db.prepare("SELECT * FROM NEWS WHERE NewsID = ?").get(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

module.exports = router;
