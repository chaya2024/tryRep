const express = require('express');
const cors = require('cors');

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

// Simple mock data
const mockLessons = [
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
      }
    ],
    participants: [
      {
        id: "child-1",
        name: "דוד",
        avatar: "👦",
        personality: "סקרן ואוהב לשאול שאלות"
      }
    ]
  }
];

app.get('/api/lessons', (req, res) => {
  res.json(mockLessons);
});

app.get('/api/children', (req, res) => {
  res.json([
    {
      id: "child-1",
      name: "דוד",
      avatar: "👦",
      personality: "סקרן ואוהב לשאול שאלות"
    }
  ]);
});

app.listen(3000, () => {
  console.log('Simple server running on http://localhost:3000');
});