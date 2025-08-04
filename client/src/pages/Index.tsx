import { useState, useEffect } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { LessonInterface } from "@/components/LessonInterface";
import { Admin } from "@/pages/Admin";
import { apiService } from "@/services/api";
import { Lesson } from "@/types/lesson";

const Index = () => {
  const [isLessonStarted, setIsLessonStarted] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLesson = async () => {
      try {
        setLoading(true);
        const lessons = await apiService.getLessons();
        if (lessons.length > 0) {
          setLesson(lessons[0]); // לוקח את השיעור הראשון
        } else {
          setError('לא נמצאו שיעורים');
        }
      } catch (err) {
        setError('שגיאה בטעינת השיעור');
        console.error('Error loading lesson:', err);
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, []);

  const handleStartLesson = () => {
    setIsLessonStarted(true);
  };

  const handleEndLesson = () => {
    setIsLessonStarted(false);
  };

  const handleShowAdmin = () => {
    setShowAdmin(true);
  };

  const handleBackToMain = () => {
    setShowAdmin(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">טוען שיעור...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-primary-foreground px-4 py-2 rounded"
          >
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">לא נמצא שיעור</p>
        </div>
      </div>
    );
  }

  if (showAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-4">
          <button 
            onClick={handleBackToMain}
            className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← חזרה לדף הראשי
          </button>
        </div>
        <Admin />
      </div>
    );
  }

  if (isLessonStarted) {
    return (
      <LessonInterface 
        lesson={lesson} 
        onEndLesson={handleEndLesson}
        onShowAdmin={handleShowAdmin}
      />
    );
  }

  return (
    <div className="relative">
      <WelcomeScreen 
        lesson={lesson}
        onStartLesson={handleStartLesson}
      />
      <button 
        onClick={handleShowAdmin}
        className="absolute top-4 right-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
      >
        ⚙️ ניהול
      </button>
    </div>
  );
};

export default Index;
