const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Serve uploads cleanly (extracting basename for absolute path backward compatibility)
app.use((req, res, next) => {
  if (req.path.startsWith('/uploads/')) {
    const filename = path.basename(req.path);
    const filePath = path.join(__dirname, 'uploads', filename);
    return res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).send('Document not found');
      }
    });
  }
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tenders', require('./routes/tenders'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/news', require('./routes/news'));
app.use('/api/admin', require('./routes/admin'));

// Base route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`TETFund server running on port ${PORT}`);
});

module.exports = app;
