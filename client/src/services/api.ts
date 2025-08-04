import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Child {
  id: string;
  name: string;
  avatar: string;
  personality: string;
}

export interface LessonStep {
  id: string;
  title: string;
  description: string;
  aiPrompt: string;
  duration: number;
}

export interface Lesson {
  id: string;
  title: string;
  subject: string;
  targetAge: number;
  description: string;
  steps: LessonStep[];
  participants: Child[];
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'child' | 'ai';
  content: string;
  timestamp: string;
  lessonId: string;
}

export interface AIText {
  id: string;
  type: 'greeting' | 'ai_response' | 'system_message' | 'encouragement' | 'transition';
  content: string;
  context: string;
  order: number;
  isActive: boolean;
}

// Helper function to convert MongoDB _id to id
const convertMongoId = (obj: any) => {
  if (obj._id) {
    obj.id = obj._id;
    delete obj._id;
  }
  return obj;
};

// API functions
export const apiService = {
  // שליפת כל השיעורים
  async getLessons(): Promise<Lesson[]> {
    const response = await api.get('/lessons');
    return response.data.map((lesson: any) => ({
      ...convertMongoId(lesson),
      participants: lesson.participants.map((child: any) => convertMongoId(child)),
      steps: lesson.steps.map((step: any, index: number) => ({
        ...convertMongoId(step),
        id: step._id || `step-${index}`
      }))
    }));
  },

  // שליפת שיעור ספציפי
  async getLesson(id: string): Promise<Lesson> {
    const response = await api.get(`/lessons/${id}`);
    const lesson = response.data;
    return {
      ...convertMongoId(lesson),
      participants: lesson.participants.map((child: any) => convertMongoId(child)),
      steps: lesson.steps.map((step: any, index: number) => ({
        ...convertMongoId(step),
        id: step._id || `step-${index}`
      }))
    };
  },

  // שליפת כל הילדים
  async getChildren(): Promise<Child[]> {
    const response = await api.get('/children');
    return response.data.map((child: any) => convertMongoId(child));
  },

  // שליפת הודעות לשיעור
  async getMessages(lessonId: string): Promise<Message[]> {
    const response = await api.get(`/messages/${lessonId}`);
    return response.data.map((message: any) => convertMongoId(message));
  },

  // הוספת הודעה חדשה
  async addMessage(message: Omit<Message, 'id' | 'timestamp'>): Promise<Message> {
    const response = await api.post('/messages', message);
    return convertMongoId(response.data);
  },

  // שליפת טקסטים של AI
  async getAITexts(type?: string, context?: string): Promise<AIText[]> {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (context) params.append('context', context);
    
    const response = await api.get(`/ai-texts?${params.toString()}`);
    return response.data.map((text: any) => convertMongoId(text));
  },

  // שליפת טקסט AI אקראי
  async getRandomAIText(type: string): Promise<AIText> {
    const response = await api.get(`/ai-texts/random/${type}`);
    return convertMongoId(response.data);
  },

  // הוספת טקסט AI חדש
  async addAIText(text: Omit<AIText, 'id'>): Promise<AIText> {
    const response = await api.post('/ai-texts', text);
    return convertMongoId(response.data);
  },

  // עדכון טקסט AI
  async updateAIText(id: string, text: Partial<AIText>): Promise<AIText> {
    const response = await api.put(`/ai-texts/${id}`, text);
    return convertMongoId(response.data);
  },

  // מחיקת טקסט AI
  async deleteAIText(id: string): Promise<void> {
    await api.delete(`/ai-texts/${id}`);
  },
}; 