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

// Admin endpoints
app.get('/api/admin/groups', (req, res) => {
  const mockGroups = [
    {
      id: "group-1",
      name: "קבוצה א' - כיתה ג'",
      currentStep: 2,
      participantCount: 6,
      participants: [
        { name: "דוד", joinedAt: "2024-01-15T09:00:00Z" },
        { name: "שרה", joinedAt: "2024-01-15T09:00:00Z" },
        { name: "יוסי", joinedAt: "2024-01-15T09:00:00Z" }
      ],
      script: { title: "האי הבודד - הרפתקת יזמות", description: "שיעור פתיחה בנושא יזמות" },
      isActive: true,
      createdAt: "2024-01-15T09:00:00Z",
      progress: {
        completedSteps: 2,
        status: "in-progress"
      }
    },
    {
      id: "group-2",
      name: "קבוצה ב' - כיתה ד'",
      currentStep: 1,
      participantCount: 5,
      participants: [
        { name: "מיה", joinedAt: "2024-01-15T10:00:00Z" },
        { name: "איתי", joinedAt: "2024-01-15T10:00:00Z" }
      ],
      script: { title: "האי הבודד - הרפתקת יזמות", description: "שיעור פתיחה בנושא יזמות" },
      isActive: true,
      createdAt: "2024-01-15T10:00:00Z",
      progress: {
        completedSteps: 1,
        status: "in-progress"
      }
    }
  ];
  res.json(mockGroups);
});

app.get('/api/admin/scripts', (req, res) => {
  const mockScripts = [
    {
      _id: "script-1",
      title: "האי הבודד - הרפתקת יזמות",
      description: "שיעור פתיחה בנושא יזמות דרך תרחיש מרתק של נחיתה על אי בודד",
      targetAge: { min: 8, max: 12 },
      duration: 45,
      steps: [
        { title: "פתיחה והכרות", duration: 5 },
        { title: "הצגת התרחיש", duration: 10 },
        { title: "דיון פתוח", duration: 15 },
        { title: "משימה קבוצתית", duration: 10 },
        { title: "סיכום והשראה", duration: 5 }
      ],
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z"
    },
    {
      _id: "script-2",
      title: "מסע בחלל - חקר מדעי",
      description: "שיעור מדעים אינטראקטיבי על מערכת השמש",
      targetAge: { min: 9, max: 13 },
      duration: 50,
      steps: [
        { title: "הכרות עם החלל", duration: 8 },
        { title: "סיור וירטואלי", duration: 15 },
        { title: "ניסויים מדעיים", duration: 20 },
        { title: "סיכום ותובנות", duration: 7 }
      ],
      isActive: true,
      createdAt: "2024-01-05T00:00:00Z"
    }
  ];
  res.json(mockScripts);
});

// CRUD operations for lessons
app.post('/api/lessons', (req, res) => {
  const newLesson = {
    id: Date.now().toString(),
    ...req.body,
    participants: [],
    createdAt: new Date().toISOString()
  };
  mockData.lessons.push(newLesson);
  res.json(newLesson);
});

app.put('/api/lessons/:id', (req, res) => {
  const lessonIndex = mockData.lessons.findIndex(l => l.id === req.params.id);
  if (lessonIndex === -1) {
    return res.status(404).json({ error: 'Lesson not found' });
  }
  mockData.lessons[lessonIndex] = { ...mockData.lessons[lessonIndex], ...req.body };
  res.json(mockData.lessons[lessonIndex]);
});

app.delete('/api/lessons/:id', (req, res) => {
  const lessonIndex = mockData.lessons.findIndex(l => l.id === req.params.id);
  if (lessonIndex === -1) {
    return res.status(404).json({ error: 'Lesson not found' });
  }
  mockData.lessons.splice(lessonIndex, 1);
  res.json({ message: 'Lesson deleted successfully' });
});

// CRUD operations for children/users
app.post('/api/children', (req, res) => {
  const newChild = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  mockData.children.push(newChild);
  res.json(newChild);
});

app.put('/api/children/:id', (req, res) => {
  const childIndex = mockData.children.findIndex(c => c.id === req.params.id);
  if (childIndex === -1) {
    return res.status(404).json({ error: 'Child not found' });
  }
  mockData.children[childIndex] = { ...mockData.children[childIndex], ...req.body };
  res.json(mockData.children[childIndex]);
});

app.delete('/api/children/:id', (req, res) => {
  const childIndex = mockData.children.findIndex(c => c.id === req.params.id);
  if (childIndex === -1) {
    return res.status(404).json({ error: 'Child not found' });
  }
  mockData.children.splice(childIndex, 1);
  res.json({ message: 'Child deleted successfully' });
});

app.listen(3000, () => {
  console.log('Working server running on http://localhost:3000');
  console.log('Using mock data for development');
});