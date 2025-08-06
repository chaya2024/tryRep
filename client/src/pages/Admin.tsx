import React, { useState, useEffect } from 'react';
import { GroupList } from '../components/admin/GroupList';
import { LessonManager } from '../components/admin/LessonManager';
import { UserManager } from '../components/admin/UserManager';
import { Users, FileText, BarChart3, BookOpen, User } from 'lucide-react';
import { api } from '../services/api';

interface Group {
  id: string;
  name: string;
  currentStep: number;
  participantCount: number;
  participants: Array<{ name: string; joinedAt: string }>;
  script: { title: string; description: string };
  isActive: boolean;
  createdAt: string;
  progress: {
    completedSteps: number;
    status: string;
  } | null;
}

interface Script {
  _id: string;
  title: string;
  description: string;
  targetAge: { min: number; max: number };
  duration: number;
  steps: any[];
  isActive: boolean;
  createdAt: string;
}

export const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'groups' | 'lessons' | 'users'>('groups');
  const [groups, setGroups] = useState<Group[]>([]);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [groupsResponse, scriptsResponse] = await Promise.all([
        api.get('/admin/groups'),
        api.get('/admin/scripts')
      ]);
      
      setGroups(groupsResponse.data);
      setScripts(scriptsResponse.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScriptUpdate = () => {
    fetchData(); // Refresh data after script changes
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">טוען נתוני ניהול...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-purple-400">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">ממשק ניהול</h1>
        <p className="text-xl text-gray-600">ניהול קבוצות, תסריטים והתקדמות</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-400">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mr-4">
              <p className="text-2xl font-bold text-gray-800">{groups.length}</p>
              <p className="text-gray-600">קבוצות פעילות</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-400">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
            <div className="mr-4">
              <p className="text-2xl font-bold text-gray-800">{scripts.length}</p>
              <p className="text-gray-600">תסריטי שיעור</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-400">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mr-4">
              <p className="text-2xl font-bold text-gray-800">0</p>
              <p className="text-gray-600">שיעורים פעילים</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-400">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-full">
              <User className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mr-4">
              <p className="text-2xl font-bold text-gray-800">0</p>
              <p className="text-gray-600">משתמשים רשומים</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex flex-wrap">
            <button
              onClick={() => setActiveTab('groups')}
              className={`px-6 py-4 text-lg font-medium border-b-2 transition-colors ${
                activeTab === 'groups'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="inline-block w-5 h-5 ml-2" />
              ניהול קבוצות
            </button>
            <button
              onClick={() => setActiveTab('lessons')}
              className={`px-6 py-4 text-lg font-medium border-b-2 transition-colors ${
                activeTab === 'lessons'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BookOpen className="inline-block w-5 h-5 ml-2" />
              ניהול שיעורים
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-4 text-lg font-medium border-b-2 transition-colors ${
                activeTab === 'users'
                  ? 'border-orange-500 text-orange-600 bg-orange-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <User className="inline-block w-5 h-5 ml-2" />
              ניהול משתמשים
            </button>
          </nav>
        </div>

        <div className="p-8">
          {activeTab === 'groups' && <GroupList groups={groups} />}
          {activeTab === 'lessons' && <LessonManager />}
          {activeTab === 'users' && <UserManager />}
        </div>
      </div>
    </div>
  );
};