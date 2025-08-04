import React from 'react';
import { Users, Clock, CheckCircle, PlayCircle, Calendar } from 'lucide-react';

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

interface GroupListProps {
  groups: Group[];
}

export const GroupList: React.FC<GroupListProps> = ({ groups }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'הושלם';
      case 'in-progress':
        return 'בתהליך';
      case 'paused':
        return 'מושהה';
      default:
        return 'לא החל';
    }
  };

  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-600 mb-2">אין קבוצות עדיין</h3>
        <p className="text-gray-500">קבוצות שייווצרו יופיעו כאן</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">קבוצות פעילות</h2>
        <span className="text-sm text-gray-600">{groups.length} קבוצות</span>
      </div>

      <div className="grid gap-6">
        {groups.map((group) => (
          <div key={group.id} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{group.name}</h3>
                <p className="text-gray-600 mb-3">{group.script.title}</p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>{group.participantCount} משתתפים</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <PlayCircle className="h-4 w-4" />
                    <span>שלב {group.currentStep}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(group.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-left">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  group.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {group.isActive ? 'פעיל' : 'לא פעיל'}
                </span>
                
                {group.progress && (
                  <div className="mt-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      getStatusColor(group.progress.status)
                    }`}>
                      {getStatusText(group.progress.status)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Participants List */}
            {group.participants.length > 0 && (
              <div className="bg-white rounded-lg p-4 mt-4">
                <h4 className="font-medium text-gray-800 mb-3">משתתפים:</h4>
                <div className="flex flex-wrap gap-2">
                  {group.participants.map((participant, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {participant.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Progress Bar */}
            {group.progress && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>התקדמות:</span>
                  <span>{group.progress.completedSteps} שלבים הושלמו</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((group.progress.completedSteps / group.currentStep) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};