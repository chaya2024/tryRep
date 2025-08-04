const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173'],
  credentials: true
}));
app.use(express.json());

// Mock data
const mockData = {
  lessons: [
    {
      id: "1",
      title: "מתמטיקה בסיסית",
      subject: "מתמטיקה",
      targetAge: 8,
      description: "שיעור בסיסי במתמטיקה לילדים",
      steps: [
        {
          id: "step-1",
          title: "ספירה",
          description: "בואו נספור יחד",
          aiPrompt: "עזור לילדים לספור עד 10",
          duration: 5
        },
        {
          id: "step-2",
          title: "חיבור",
          description: "נלמד לחבר מספרים",
          aiPrompt: "הסבר חיבור פשוט",
          duration: 8
        }
      ],
      participants: [
        {
          id: "child-1",
          name: "דוד",
          avatar: "👦",
          personality: "סקרן ואוהב לשאול שאלות"
        },
        {
          id: "child-2",
          name: "שרה",
          avatar: "👧",
          personality: "שקטה אבל חכמה מאוד"
        }
      ]
    }
  ],
  children: [
    {
      id: "child-1",
      name: "דוד",
      avatar: "👦",
      personality: "סקרן ואוהב לשאול שאלות"
    },
    {
      id: "child-2",
      name: "שרה",
      avatar: "👧",
      personality: "שקטה אבל חכמה מאוד"
    },
    {
      id: "child-3",
      name: "יוסי",
      avatar: "👦",
      personality: "אנרגטי ואוהב משחקים"
    }
  ],
  messages: [],
  aiTexts: [
    {
      id: "ai-1",
      type: "greeting",
      content: "שלום ילדים! בואו נתחיל את השיעור שלנו",
      context: "start",
      order: 1,
      isActive: true
    },
    {
      id: "ai-2",
      type: "encouragement",
      content: "מעולה! אתם עושים עבודה נהדרת",
      context: "general",
      order: 2,
      isActive: true
    }
  ]
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get all lessons
app.get('/api/lessons', (req, res) => {
  res.json(mockData.lessons);
});

// Get specific lesson
app.get('/api/lessons/:id', (req, res) => {
  const lesson = mockData.lessons.find(l => l.id === req.params.id);
  if (!lesson) {
    return res.status(404).json({ error: 'Lesson not found' });
  }
  res.json(lesson);
});

// Get all children
app.get('/api/children', (req, res) => {
  res.json(mockData.children);
});

// Get messages for a lesson
app.get('/api/messages/:lessonId', (req, res) => {
  const messages = mockData.messages.filter(m => m.lessonId === req.params.lessonId);
  res.json(messages);
});

// Add new message
app.post('/api/messages', (req, res) => {
  const message = {
    ...req.body,
    id: Date.now().toString(),
    timestamp: new Date().toISOString()
  };
  mockData.messages.push(message);
  res.json(message);
});

// Get AI texts
app.get('/api/ai-texts', (req, res) => {
  const { type, context } = req.query;
  let texts = mockData.aiTexts.filter(t => t.isActive);
  
  if (type) {
    texts = texts.filter(t => t.type === type);
  }
  if (context) {
    texts = texts.filter(t => t.context === context);
  }
  
  texts.sort((a, b) => a.order - b.order);
  res.json(texts);
});

// Get random AI text
app.get('/api/ai-texts/random/:type', (req, res) => {
  const texts = mockData.aiTexts.filter(t => t.type === req.params.type && t.isActive);
  
  if (texts.length === 0) {
    return res.status(404).json({ error: 'No texts found for this type' });
  }
  
  const randomText = texts[Math.floor(Math.random() * texts.length)];
  res.json(randomText);
});

app.listen(3000, () => {
  console.log('Working server running on http://localhost:3000');
  console.log('Using mock data for development');
});