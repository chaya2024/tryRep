const express = require('express');
const fileDb = require('../services/fileDb');
const router = express.Router();

// שליפת כל הילדים
router.get('/children', async (req, res) => {
  try {
    const children = await fileDb.find('children');
    res.json(children);
  } catch (error) {
    console.error('Error fetching children:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// שליפת כל השיעורים
router.get('/lessons', async (req, res) => {
  try {
    const lessons = await fileDb.find('lessons');

    // ודא שהשיעורים הם מערך
    if (!Array.isArray(lessons)) {
      console.warn('Invalid lessons format from fileDb');
      return res.status(500).json({ error: 'Invalid data format' });
    }

    res.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// שליפת שיעור ספציפי
router.get('/lessons/:id', async (req, res) => {
  try {
    const lesson = await fileDb.findById('lessons', req.params.id);
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
    const messages = await fileDb.find('messages', { lessonId: req.params.lessonId });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// הוספת הודעה חדשה
router.post('/messages', async (req, res) => {
  try {
    const msg = await fileDb.create('messages', req.body);
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
    
    const texts = await fileDb.find('aiTexts', query);
    // Sort by order
    texts.sort((a, b) => a.order - b.order);
    res.json(texts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// שליפת טקסט AI אקראי לפי סוג
router.get('/ai-texts/random/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const texts = await fileDb.find('aiTexts', { type, isActive: true });
    
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
    const aiText = await fileDb.create('aiTexts', req.body);
    res.json(aiText);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// עדכון טקסט AI
router.put('/ai-texts/:id', async (req, res) => {
  try {
    const aiText = await fileDb.update('aiTexts', req.params.id, req.body);
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
    const success = await fileDb.delete('aiTexts', req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'AI Text not found' });
    }
    res.json({ message: 'AI Text deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// שליפת כל הסקריפטים (admin)
router.get('/admin/scripts', async (req, res) => {
  try {
    const scripts = await fileDb.find('scripts');
    res.json(scripts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// שליפת כל הקבוצות (admin)
router.get('/admin/groups', async (req, res) => {
  try {
    const groups = await fileDb.find('groups');
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// יצירת ילד חדש
router.post('/children', async (req, res) => {
  try {
    const child = await fileDb.create('children', req.body);
    res.json(child);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// יצירת שיעור חדש
router.post('/lessons', async (req, res) => {
  try {
    const lesson = await fileDb.create('lessons', req.body);
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;