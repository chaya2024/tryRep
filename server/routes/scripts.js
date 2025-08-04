const express = require('express');
const router = express.Router();
const Script = require('../models/Script');

// Get all available scripts
router.get('/', async (req, res) => {
  try {
    const scripts = await Script.find({ isActive: true })
      .select('title description targetAge duration')
      .sort({ createdAt: -1 });
    res.json(scripts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific script by ID
router.get('/:id', async (req, res) => {
  try {
    const script = await Script.findById(req.params.id);
    if (!script || !script.isActive) {
      return res.status(404).json({ error: 'Script not found' });
    }
    res.json(script);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;