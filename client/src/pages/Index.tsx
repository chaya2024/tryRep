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

  const [showLessonSelector, setShowLessonSelector] = useState(false);
  const [availableLessons, setAvailableLessons] = useState<Lesson[]>([]);

  const loadAllLessons = async () => {
    try {
      const lessons = await apiService.getLessons();
      setAvailableLessons(lessons);
    } catch (err) {
      console.error('Error loading lessons:', err);
    }
  };

  const handleSelectLesson = (selectedLesson: Lesson) => {
    setLesson(selectedLesson);
    setShowLessonSelector(false);
  };

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
      <div className="absolute top-4 right-4 flex gap-2">
        <button 
          onClick={() => { setShowLessonSelector(true); loadAllLessons(); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
        >
          📚 בחר שיעור
        </button>
        <button 
          onClick={handleShowAdmin}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
        >
          ⚙️ ניהול
        </button>
      </div>

      {/* Lesson Selector Modal */}
      {showLessonSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">בחר שיעור</h2>
              <button 
                onClick={() => setShowLessonSelector(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="grid gap-4">
              {availableLessons.map((lesson) => (
                <div 
                  key={lesson.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelectLesson(lesson)}
                >
                  <h3 className="text-lg font-semibold">{lesson.title}</h3>
                  <p className="text-gray-600">{lesson.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {lesson.subject}
                    </span>
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                      גיל {lesson.targetAge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
