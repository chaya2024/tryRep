require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// דוגמה למסלול בדיקה
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// חיבור ה-API routes
app.use('/api', apiRoutes);

// חיבור ל-MongoDB
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/ignite-curiosity', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(4000, () => console.log('Server running on http://localhost:4000'));
  })
  .catch(err => console.error('MongoDB connection error:', err));