const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

router.post('/register', (req, res) => {
  const { fullname, email, password, role } = req.body;
  if (!fullname || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const existing = db.prepare("SELECT * FROM USERS WHERE Email = ?").get(email);
  if (existing) return res.status(400).json({ error: 'Email already registered' });

  const hash = bcrypt.hashSync(password, 12);
  const allowed = ['Contractor', 'Beneficiary'];
  const userRole = allowed.includes(role) ? role : 'Contractor';
  db.prepare("INSERT INTO USERS (FullName, Email, PasswordHash, Role) VALUES (?, ?, ?, ?)")
    .run(fullname, email, hash, userRole);
  res.json({ message: 'Registration successful' });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare("SELECT * FROM USERS WHERE Email = ?").get(email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  if (!bcrypt.compareSync(password, user.PasswordHash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign(
    { id: user.UserID, role: user.Role, name: user.FullName },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  res.json({ token, role: user.Role, name: user.FullName });
});

module.exports = router;
