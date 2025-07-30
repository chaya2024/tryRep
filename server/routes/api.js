const express = require('express');
const Lesson = require('../models/Lesson');
const Child = require('../models/Child');
const Message = require('../models/Message');
const AIText = require('../models/AIText');
const router = express.Router();

// שליפת כל הילדים
router.get('/children', async (req, res) => {
  try {
    const children = await Child.find();
    res.json(children);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// שליפת כל השיעורים
router.get('/lessons', async (req, res) => {
  try {
    const lessons = await Lesson.find().populate('participants');
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// שליפת שיעור ספציפי
router.get('/lessons/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('participants');
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// שליפת כל ההודעות לשיעור מסוים
router.get('/messages/:lessonId', async (req, res) => {
  try {
    const messages = await Message.find({ lessonId: req.params.lessonId });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// הוספת הודעה חדשה
router.post('/messages', async (req, res) => {
  try {
    const msg = new Message(req.body);
    await msg.save();
    res.json(msg);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// שליפת טקסטים של AI
router.get('/ai-texts', async (req, res) => {
  try {
    const { type, context } = req.query;
    let query = { isActive: true };
    
    if (type) query.type = type;
    if (context) query.context = context;
    
    const texts = await AIText.find(query).sort('order');
    res.json(texts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// שליפת טקסט AI אקראי לפי סוג
router.get('/ai-texts/random/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const texts = await AIText.find({ type, isActive: true });
    
    if (texts.length === 0) {
      return res.status(404).json({ error: 'No texts found for this type' });
    }
    
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    res.json(randomText);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// הוספת טקסט AI חדש
router.post('/ai-texts', async (req, res) => {
  try {
    const aiText = new AIText(req.body);
    await aiText.save();
    res.json(aiText);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// עדכון טקסט AI
router.put('/ai-texts/:id', async (req, res) => {
  try {
    const aiText = await AIText.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    if (!aiText) {
      return res.status(404).json({ error: 'AI Text not found' });
    }
    res.json(aiText);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// מחיקת טקסט AI
router.delete('/ai-texts/:id', async (req, res) => {
  try {
    const aiText = await AIText.findByIdAndDelete(req.params.id);
    if (!aiText) {
      return res.status(404).json({ error: 'AI Text not found' });
    }
    res.json({ message: 'AI Text deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;