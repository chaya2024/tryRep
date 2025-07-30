import { useState, useEffect } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { LessonInterface } from "@/components/LessonInterface";
import { apiService } from "@/services/api";
import { Lesson } from "@/types/lesson";

const Index = () => {
  const [isLessonStarted, setIsLessonStarted] = useState(false);
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

  if (isLessonStarted) {
    return (
      <LessonInterface 
        lesson={lesson} 
        onEndLesson={handleEndLesson}
      />
    );
  }

  return (
    <WelcomeScreen 
      lesson={lesson}
      onStartLesson={handleStartLesson}
    />
  );
};

export default Index;
