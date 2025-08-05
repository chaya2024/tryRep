import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, BookOpen, Users, Clock } from 'lucide-react';
import { api } from '@/services/apiCopy';

interface Lesson {
  id: string;
  title: string;
  subject: string;
  targetAge: number;
  description: string;
  steps: Array<{
    id: string;
    title: string;
    description: string;
    aiPrompt: string;
    duration: number;
  }>;
  participants: Array<{
    id: string;
    name: string;
    avatar: string;
    personality: string;
  }>;
}

export const LessonManager: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    targetAge: 8,
    description: '',
    steps: [{ id: '1', title: '', description: '', aiPrompt: '', duration: 5 }]
  });

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const response = await api.get('/lessons');
      setLessons(response.data);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLesson) {
        await api.put(`/lessons/${editingLesson.id}`, formData);
      } else {
        await api.post('/lessons', formData);
      }
      setIsDialogOpen(false);
      setEditingLesson(null);
      resetForm();
      fetchLessons();
    } catch (error) {
      console.error('Error saving lesson:', error);
    }
  };

  const handleDelete = async (lessonId: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק שיעור זה?')) {
      try {
        await api.delete(`/lessons/${lessonId}`);
        fetchLessons();
      } catch (error) {
        console.error('Error deleting lesson:', error);
      }
    }
  };

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      subject: lesson.subject,
      targetAge: lesson.targetAge,
      description: lesson.description,
      steps: lesson.steps
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subject: '',
      targetAge: 8,
      description: '',
      steps: [{ id: '1', title: '', description: '', aiPrompt: '', duration: 5 }]
    });
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, { 
        id: Date.now().toString(), 
        title: '', 
        description: '', 
        aiPrompt: '', 
        duration: 5 
      }]
    }));
  };

  const removeStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const updateStep = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => 
        i === index ? { ...step, [field]: value } : step
      )
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">טוען שיעורים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">ניהול שיעורים</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingLesson(null); resetForm(); }}>
              <Plus className="w-4 h-4 mr-2" />
              הוסף שיעור חדש
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingLesson ? 'ערוך שיעור' : 'הוסף שיעור חדש'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">כותרת השיעור</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subject">נושא</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="targetAge">גיל יעד</Label>
                  <Input
                    id="targetAge"
                    type="number"
                    value={formData.targetAge}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetAge: parseInt(e.target.value) }))}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">תיאור השיעור</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>שלבי השיעור</Label>
                  <Button type="button" onClick={addStep} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    הוסף שלב
                  </Button>
                </div>
                <div className="space-y-4">
                  {formData.steps.map((step, index) => (
                    <Card key={step.id} className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">שלב {index + 1}</h4>
                        {formData.steps.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeStep(index)}
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>כותרת השלב</Label>
                          <Input
                            value={step.title}
                            onChange={(e) => updateStep(index, 'title', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label>משך (דקות)</Label>
                          <Input
                            type="number"
                            value={step.duration}
                            onChange={(e) => updateStep(index, 'duration', parseInt(e.target.value))}
                            required
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Label>תיאור השלב</Label>
                        <Textarea
                          value={step.description}
                          onChange={(e) => updateStep(index, 'description', e.target.value)}
                          rows={2}
                          required
                        />
                      </div>
                      <div className="mt-4">
                        <Label>הוראה ל-AI</Label>
                        <Textarea
                          value={step.aiPrompt}
                          onChange={(e) => updateStep(index, 'aiPrompt', e.target.value)}
                          rows={2}
                          required
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  ביטול
                </Button>
                <Button type="submit">
                  {editingLesson ? 'עדכן שיעור' : 'הוסף שיעור'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{lesson.title}</h3>
                <p className="text-gray-600 mb-3">{lesson.description}</p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{lesson.subject}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>גיל {lesson.targetAge}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{lesson.steps.reduce((total, step) => total + step.duration, 0)} דקות</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Badge variant="outline">{lesson.steps.length} שלבים</Badge>
                  <Badge variant="secondary">{lesson.participants.length} משתתפים</Badge>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(lesson)} variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  ערוך
                </Button>
                <Button onClick={() => handleDelete(lesson.id)} variant="outline" size="sm" className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  מחק
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};