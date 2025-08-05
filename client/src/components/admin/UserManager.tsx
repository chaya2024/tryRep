import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Edit, Trash2, User, Smile } from 'lucide-react';
import { api } from '@/services/apiCopy';

interface User {
  id: string;
  name: string;
  avatar: string;
  personality: string;
  age?: number;
  grade?: string;
  isActive: boolean;
  createdAt: string;
}

export const UserManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    avatar: '👦',
    personality: '',
    age: 8,
    grade: '',
    isActive: true
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/children');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.put(`/children/${editingUser.id}`, formData);
      } else {
        await api.post('/children', formData);
      }
      setIsDialogOpen(false);
      setEditingUser(null);
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק משתמש זה?')) {
      try {
        await api.delete(`/children/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      avatar: user.avatar,
      personality: user.personality,
      age: user.age || 8,
      grade: user.grade || '',
      isActive: user.isActive
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      avatar: '👦',
      personality: '',
      age: 8,
      grade: '',
      isActive: true
    });
  };

  const avatarOptions = ['👦', '👧', '👨', '👩', '🧒', '👶', '👴', '👵', '🤖', '🐱', '🐶', '🦄'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">טוען משתמשים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">ניהול משתמשים</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingUser(null); resetForm(); }}>
              <Plus className="w-4 h-4 mr-2" />
              הוסף משתמש חדש
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'ערוך משתמש' : 'הוסף משתמש חדש'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">שם המשתמש</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="age">גיל</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="grade">כיתה</Label>
                  <Input
                    id="grade"
                    value={formData.grade}
                    onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                    placeholder="למשל: ג', ד', ה'"
                  />
                </div>
              </div>

              <div>
                <Label>אווטאר</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {avatarOptions.map((avatar) => (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, avatar }))}
                      className={`p-2 text-2xl rounded-lg border-2 transition-colors ${
                        formData.avatar === avatar 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="personality">תיאור אישיות</Label>
                <Textarea
                  id="personality"
                  value={formData.personality}
                  onChange={(e) => setFormData(prev => ({ ...prev, personality: e.target.value }))}
                  rows={3}
                  placeholder="תאר את האישיות של המשתמש (למשל: סקרן, יצירתי, מנהיג טבעי)"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="isActive">משתמש פעיל</Label>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  ביטול
                </Button>
                <Button type="submit">
                  {editingUser ? 'עדכן משתמש' : 'הוסף משתמש'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {users.map((user) => (
          <Card key={user.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl">
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{user.name}</h3>
                  <p className="text-gray-600 mb-3">{user.personality}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>גיל {user.age}</span>
                    </div>
                    {user.grade && (
                      <div className="flex items-center space-x-2">
                        <span>כיתה {user.grade}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Smile className="h-4 w-4" />
                      <span>{user.personality.split(' ').slice(0, 3).join(' ')}...</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? 'פעיל' : 'לא פעיל'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(user)} variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  ערוך
                </Button>
                <Button onClick={() => handleDelete(user.id)} variant="outline" size="sm" className="text-red-600">
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