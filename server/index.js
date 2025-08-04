require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173'],
  credentials: true
}));
app.use(express.json());

// דוגמה למסלול בדיקה
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// חיבור ה-API routes
app.use('/api', apiRoutes);

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  console.log('Using file-based database for development');
});