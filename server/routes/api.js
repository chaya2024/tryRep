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
    let lessons = await fileDb.find('lessons');
    if (!Array.isArray(lessons)) {
      console.warn('Invalid lessons format from fileDb');
      return res.status(500).json({ error: 'Invalid data format' });
    }
    // Normalize lessons
    lessons = lessons.map((lesson, idx) => {
      return {
        id: lesson.id || `lesson-${idx}`,
        title: lesson.title || '',
        subject: lesson.subject || '',
        targetAge: lesson.targetAge || 0,
        description: lesson.description || '',
        steps: Array.isArray(lesson.steps)
          ? lesson.steps.map((step, sidx) => ({
              id: step.id || `step-${sidx}`,
              title: step.title || '',
              description: step.description || '',
              aiPrompt: step.aiPrompt || '',
              duration: typeof step.duration === 'number' ? step.duration : 5
            }))
          : [],
        participants: Array.isArray(lesson.participants) ? lesson.participants : [],
      };
    });
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
// Normalize lesson helper
function normalizeLesson(lesson, idx = 0) {
  return {
    id: lesson.id || `lesson-${idx}`,
    title: lesson.title || '',
    subject: lesson.subject || '',
    targetAge: lesson.targetAge || 0,
    description: lesson.description || '',
    steps: Array.isArray(lesson.steps)
      ? lesson.steps.map((step, sidx) => ({
          id: step.id || `step-${sidx}`,
          title: step.title || '',
          description: step.description || '',
          aiPrompt: step.aiPrompt || '',
          duration: typeof step.duration === 'number' ? step.duration : 5
        }))
      : [],
    participants: Array.isArray(lesson.participants) ? lesson.participants : [],
  };
}
// Normalize child helper
function normalizeChild(child, idx = 0) {
  return {
    id: child.id || `child-${idx}`,
    name: child.name || '',
    avatar: child.avatar || '👦',
    personality: child.personality || '',
    age: typeof child.age === 'number' ? child.age : undefined,
    grade: child.grade || undefined,
    isActive: typeof child.isActive === 'boolean' ? child.isActive : true,
  };
}
// POST/PUT lessons
router.post('/lessons', async (req, res) => {
  try {
    const lesson = normalizeLesson(req.body);
    const saved = await fileDb.create('lessons', lesson);
    res.json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.put('/lessons/:id', async (req, res) => {
  try {
    const lesson = normalizeLesson({ ...req.body, id: req.params.id });
    const updated = await fileDb.update('lessons', req.params.id, lesson);
    if (!updated) return res.status(404).json({ error: 'Lesson not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// מחיקת שיעור
router.delete('/lessons/:id', async (req, res) => {
  try {
    const deleted = await fileDb.delete('lessons', req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Lesson not found' });
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// POST/PUT children
router.post('/children', async (req, res) => {
  try {
    const child = normalizeChild(req.body);
    const saved = await fileDb.create('children', child);
    res.json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.put('/children/:id', async (req, res) => {
  try {
    const child = normalizeChild({ ...req.body, id: req.params.id });
    const updated = await fileDb.update('children', req.params.id, child);
    if (!updated) return res.status(404).json({ error: 'Child not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// מחיקת ילד
router.delete('/children/:id', async (req, res) => {
  try {
    const deleted = await fileDb.delete('children', req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Child not found' });
    res.json({ message: 'Child deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;