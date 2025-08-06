import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// יצירת Axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// ----------------- TYPES -----------------

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

// ----------------- HELPERS -----------------

const convertMongoId = (obj: any) => {
  if (obj._id) {
    obj.id = obj._id;
    delete obj._id;
  }
  return obj;
};

// ----------------- API SERVICE -----------------

export const apiService = {
  async getLessons(): Promise<Lesson[]> {
    const response = await api.get('/lessons');
    return response.data.map((lesson: any) => ({
      ...convertMongoId(lesson),
      participants: lesson.participants.map((child: any) => convertMongoId(child)),
      steps: lesson.steps.map((step: any, index: number) => ({
        ...convertMongoId(step),
        id: step._id || `step-${index}`,
      })),
    }));
  },

  async getLesson(id: string): Promise<Lesson> {
    const response = await api.get(`/lessons/${id}`);
    const lesson = response.data;
    return {
      ...convertMongoId(lesson),
      participants: lesson.participants.map((child: any) => convertMongoId(child)),
      steps: lesson.steps.map((step: any, index: number) => ({
        ...convertMongoId(step),
        id: step._id || `step-${index}`,
      })),
    };
  },

  async getChildren(): Promise<Child[]> {
    const response = await api.get('/children');
    return response.data.map((child: any) => convertMongoId(child));
  },

  async getMessages(lessonId: string): Promise<Message[]> {
    const response = await api.get(`/messages/${lessonId}`);
    return response.data.map((message: any) => convertMongoId(message));
  },

  async addMessage(message: Omit<Message, 'id' | 'timestamp'>): Promise<Message> {
    const response = await api.post('/messages', message);
    return convertMongoId(response.data);
  },

  async getAITexts(type?: string, context?: string): Promise<AIText[]> {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (context) params.append('context', context);

    const response = await api.get(`/ai-texts?${params.toString()}`);
    return response.data.map((text: any) => convertMongoId(text));
  },

  async getRandomAIText(type: string): Promise<AIText> {
    const response = await api.get(`/ai-texts/random/${type}`);
    return convertMongoId(response.data);
  },

  async addAIText(text: Omit<AIText, 'id'>): Promise<AIText> {
    const response = await api.post('/ai-texts', text);
    return convertMongoId(response.data);
  },

  async updateAIText(id: string, text: Partial<AIText>): Promise<AIText> {
    const response = await api.put(`/ai-texts/${id}`, text);
    return convertMongoId(response.data);
  },

  async deleteAIText(id: string): Promise<void> {
    await api.delete(`/ai-texts/${id}`);
  },
};
