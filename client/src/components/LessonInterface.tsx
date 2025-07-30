import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChatMessage } from "./ChatMessage";
import { ParticipantList } from "./ParticipantList";
import { Message, ChatSession, Child, Lesson } from "@/types/lesson";
import { mockChildResponses } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { apiService, AIText } from "@/services/api";

interface LessonInterfaceProps {
  lesson: Lesson;
  onEndLesson: () => void;
}

export const LessonInterface = ({ lesson, onEndLesson }: LessonInterfaceProps) => {
  const [session, setSession] = useState<ChatSession>({
    id: `session-${Date.now()}`,
    lessonId: lesson.id,
    messages: [],
    currentStep: 0,
    currentSpeaker: null,
    isActive: true,
    startTime: new Date()
  });
  
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [childResponseIndex, setChildResponseIndex] = useState<Record<string, number>>({});
  const [showParticipants, setShowParticipants] = useState(true);
  const [aiTexts, setAiTexts] = useState<AIText[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // גלילה אוטומטית להודעה האחרונה
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // גלילה למעלה
  const scrollToTop = () => {
    chatContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.messages]);

  // טעינת טקסטים של AI
  useEffect(() => {
    const loadAITexts = async () => {
      try {
        const texts = await apiService.getAITexts();
        setAiTexts(texts);
      } catch (error) {
        console.error('Error loading AI texts:', error);
      }
    };
    
    loadAITexts();
  }, []);

  // פונקציה לקבלת טקסט AI אקראי
  const getRandomAIText = (type: string, context?: string) => {
    const filteredTexts = aiTexts.filter(text => 
      text.type === type && 
      (!context || text.context === context) &&
      text.isActive
    );
    
    if (filteredTexts.length === 0) {
      return null;
    }
    
    return filteredTexts[Math.floor(Math.random() * filteredTexts.length)];
  };

  // הוספת הודעה חדשה
  const addMessage = (senderId: string, senderName: string, content: string, senderType: 'child' | 'ai') => {
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      senderId,
      senderName,
      senderType,
      content,
      timestamp: new Date()
    };

    setSession(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));
  };

  // התחלת השיעור עם ברכה
  useEffect(() => {
    const startLesson = () => {
      // הודעה מערכת בתחילת השיעור
      const systemWelcome = getRandomAIText('system_message', 'lesson_start');
      if (systemWelcome) {
        addMessage("system", "מערכת", systemWelcome.content, "ai");
      }
      
      setTimeout(() => {
        // ברכה ראשונית
        const greeting = getRandomAIText('greeting', 'lesson_start');
        const greetingText = greeting 
          ? greeting.content.replace('{lessonTitle}', lesson.title)
          : `שלום ילדים יקרים! ברוכים הבאים לשיעור "${lesson.title}". אני מאוד נרגש לבלות איתכם ולחקור יחד נושאים מרתקים! 🌟`;
        
        addMessage("ai-teacher", "המנחה", greetingText, "ai");
        
        // הוספת הודעה מערכת מיד אחרי הברכה
        setTimeout(() => {
          const systemAfterGreeting = getRandomAIText('system_message', 'lesson_start');
          if (systemAfterGreeting) {
            addMessage("system", "מערכת", systemAfterGreeting.content, "ai");
          }
        }, 1000);
      }, 1000);
      
      setTimeout(() => {
        const currentStep = lesson.steps[0];
        addMessage("ai-teacher", "המנחה", currentStep.aiPrompt, "ai");
        
        // הוספת הודעה מערכת מיד אחרי השאלה
        setTimeout(() => {
          const systemChildTurn = getRandomAIText('system_message', 'child_turn');
          if (systemChildTurn) {
            addMessage("system", "מערכת", systemChildTurn.content, "ai");
          }
        }, 1000);
        
        // הוספת הודעה מעודדת אחרי השאלה הראשונה
        setTimeout(() => {
          const encouragement = getRandomAIText('encouragement', 'lesson_start');
          if (encouragement) {
            addMessage("ai-teacher", "המנחה", encouragement.content, "ai");
          }
        }, 3000);
      }, 2000);
    };

    startLesson();
  }, [lesson, aiTexts]);

  // מעבר לשלב הבא
  const moveToNextStep = () => {
    const nextStepIndex = session.currentStep + 1;
    if (nextStepIndex < lesson.steps.length) {
      setSession(prev => ({ ...prev, currentStep: nextStepIndex }));
      const nextStep = lesson.steps[nextStepIndex];
      
      setTimeout(() => {
        addMessage("ai-teacher", "המנחה", nextStep.aiPrompt, "ai");
      }, 1000);
    } else {
      // סיום השיעור
      const lessonEnd = getRandomAIText('encouragement', 'lesson_end');
      const endText = lessonEnd ? lessonEnd.content : "איזה שיעור נפלא היה לנו! תודה לכולכם על השתתפות פעילה ורעיונות מדהימים. אתם יזמים אמיתיים! 🎉";
      
      addMessage("ai-teacher", "המנחה", endText, "ai");
      
      toast({
        title: "השיעור הסתיים!",
        description: "כל הכבוד על השתתפות פעילה ויצירתית",
      });
      
      setTimeout(() => {
        setSession(prev => ({ ...prev, isActive: false }));
      }, 3000);
    }
  };

  // בחירת ילד אקראי לתגובה
  const selectRandomChild = () => {
    const availableChildren = lesson.participants.filter(child => 
      session.currentSpeaker !== child.id
    );
    
    if (availableChildren.length > 0) {
      const randomChild = availableChildren[Math.floor(Math.random() * availableChildren.length)];
      setSession(prev => ({ ...prev, currentSpeaker: randomChild.id }));
      return randomChild;
    }
    return null;
  };

  // תגובה של ילד (סימולציה)
  const simulateChildResponse = () => {
    const child = selectRandomChild();
    if (!child) return;

    const currentIndex = childResponseIndex[child.id] || 0;
    const responses = mockChildResponses[child.id as keyof typeof mockChildResponses] || ["כן, נכון!"];
    const response = responses[currentIndex % responses.length];
    
    setChildResponseIndex(prev => ({
      ...prev,
      [child.id]: currentIndex + 1
    }));

    // הוספת הודעה שמראה מי מדבר
    addMessage("system", "מערכת", `${child.name} רוצה לדבר...`, "ai");

    setTimeout(() => {
      addMessage(child.id, child.name, response, "child");
      
      // איפוס הדובר הנוכחי אחרי תגובה
      setTimeout(() => {
        setSession(prev => ({ ...prev, currentSpeaker: null }));
        
        // הוספת הודעה מערכת שמזכירה מה לעשות
        setTimeout(() => {
          addMessage(
            "system",
            "מערכת",
            "💬 מה עכשיו? לחצו על '👶 תגובת ילד' או '🤖 תגובת AI'",
            "ai"
          );
        }, 1000);
      }, 1000);
    }, 1000 + Math.random() * 2000); // תגובה אחרי 1-3 שניות
  };

  // תגובת AI חכמה לילדים
  const generateAIResponse = () => {
    setIsAISpeaking(true);
    
    const aiResponse = getRandomAIText('ai_response', 'child_response');
    const responseText = aiResponse ? aiResponse.content : "איזה רעיון מעניין! מי עוד חושב כך?";
    
    setTimeout(() => {
      addMessage("ai-teacher", "המנחה", responseText, "ai");
      setIsAISpeaking(false);
      
      // הוספת הודעה מערכת אחרי תגובת AI
      setTimeout(() => {
        const systemAfterAI = getRandomAIText('system_message', 'ai_response_end');
        if (systemAfterAI) {
          addMessage("system", "מערכת", systemAfterAI.content, "ai");
        }
      }, 1000);
    }, 2000 + Math.random() * 2000);
  };

  const currentStep = lesson.steps[session.currentStep];

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* כותרת השיעור - קבועה למעלה */}
      <div className="bg-primary text-primary-foreground p-4 shadow-lg flex-shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{lesson.title}</h1>
            <p className="text-primary-foreground/80">{lesson.subject} • גיל {lesson.targetAge}</p>
          </div>
          <div className="flex items-center gap-4">
            {currentStep && (
              <Badge variant="secondary" className="text-sm">
                שלב {session.currentStep + 1}: {currentStep.title}
              </Badge>
            )}
            <Button 
              variant="outline" 
              onClick={onEndLesson}
              className="bg-primary-foreground text-primary"
            >
              סיום השיעור
            </Button>
          </div>
        </div>
      </div>

      {/* תוכן ראשי - גלילה רק בתוך הצ'אט */}
      <div className="flex-1 flex overflow-hidden">
        {/* אזור הצ'אט - גלילה פנימית */}
        <div className="flex-1 flex flex-col lg:pr-96">
          <Card className="h-full flex flex-col m-4">
            <CardHeader className="pb-3 flex-shrink-0">
              <CardTitle className="text-lg flex items-center justify-between">
                💬 שיחת הקבוצה
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    onClick={() => setShowParticipants(!showParticipants)}
                    variant="outline"
                    size="sm"
                    className="lg:hidden"
                  >
                    {showParticipants ? "👥 הסתר משתתפים" : "👥 הצג משתתפים"}
                  </Button>
                  <Button 
                    onClick={simulateChildResponse}
                    disabled={!session.isActive}
                    size="lg"
                    className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-lg"
                  >
                    👶 תגובת ילד
                  </Button>
                  <Button 
                    onClick={generateAIResponse}
                    disabled={!session.isActive || isAISpeaking}
                    size="lg"
                    className="bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-lg"
                  >
                    🤖 תגובת AI
                  </Button>
                  <Button 
                    onClick={moveToNextStep}
                    disabled={!session.isActive || session.currentStep >= lesson.steps.length - 1}
                    size="lg"
                    className="bg-purple-500 hover:bg-purple-600 text-white border-0 shadow-lg"
                  >
                    ⏭️ שלב הבא
                  </Button>
                  <Button 
                    onClick={moveToNextStep}
                    disabled={!session.isActive || session.currentStep >= lesson.steps.length - 1}
                    variant="secondary"
                    size="lg"
                    className="bg-orange-500 hover:bg-orange-600 text-white border-0 shadow-lg"
                  >
                    ⏩ דלג לשלב הבא
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="flex-1 p-0 overflow-hidden">
              <div className="h-full flex flex-col">
                {/* אזור ההודעות - גלילה פנימית */}
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 relative">
                  {session.messages.map((message) => (
                    <ChatMessage 
                      key={message.id} 
                      message={message} 
                      isAI={message.senderType === 'ai'}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                  
                  {/* כפתור חזרה למעלה */}
                  {session.messages.length > 5 && (
                    <Button
                      onClick={scrollToTop}
                      size="sm"
                      className="fixed bottom-20 right-4 lg:right-96 bg-primary text-primary-foreground shadow-lg rounded-full w-10 h-10 p-0 z-40"
                    >
                      ↑
                    </Button>
                  )}
                </div>
                
                {/* אזור הוראות למשתמש - קבוע בתחתית */}
                {session.isActive && session.messages.length > 0 && (
                  <div className="border-t bg-muted/30 p-4 flex-shrink-0">
                    <div className="text-center space-y-3">
                      <p className="font-medium text-foreground">🎮 איך להמשיך?</p>
                      <div className="flex gap-3 justify-center flex-wrap">
                        <Button 
                          onClick={simulateChildResponse}
                          disabled={!session.isActive}
                          size="lg"
                          className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-lg min-w-[140px] text-lg font-bold"
                        >
                          👶 תגובת ילד
                        </Button>
                        <Button 
                          onClick={generateAIResponse}
                          disabled={!session.isActive || isAISpeaking}
                          size="lg"
                          className="bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-lg min-w-[140px] text-lg font-bold"
                        >
                          🤖 תגובת AI
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">לחצו על אחד הכפתורים למעלה כדי להמשיך את השיחה</p>
                      <p className="text-xs text-muted-foreground lg:hidden">💡 במסכים קטנים: לחצו על "👥 הצג משתתפים" כדי לראות את רשימת הילדים</p>
                      <p className="text-xs text-muted-foreground">💡 הגלילה היא רק בתוך חלון הצ'אט - התפריט למעלה נשאר קבוע</p>
                    </div>
                  </div>
                )}
                
                {/* כפתור התחלה גדול כשאין הודעות */}
                {session.isActive && session.messages.length === 0 && (
                  <div className="border-t bg-gradient-to-r from-green-50 to-blue-50 p-6 flex-shrink-0">
                    <div className="text-center space-y-4">
                      <p className="text-lg font-bold text-foreground">🚀 מוכנים להתחיל?</p>
                      <Button 
                        onClick={simulateChildResponse}
                        size="lg"
                        className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-xl text-xl font-bold px-8 py-4"
                      >
                        👶 התחל עם תגובת ילד
                      </Button>
                      <p className="text-xs text-muted-foreground lg:hidden">💡 במסכים קטנים: לחצו על "👥 הצג משתתפים" כדי לראות את רשימת הילדים</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* רשימת משתתפים - פאנל קבוע בצד ימין במסכים גדולים */}
        <div className={`w-full lg:w-96 flex-shrink-0 ${!showParticipants ? 'hidden lg:block' : ''} lg:fixed lg:right-0 lg:top-24 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto z-30 bg-background border-l border-muted shadow-lg`}> 
          <div className="p-4">
            <ParticipantList 
              participants={lesson.participants}
              currentSpeaker={session.currentSpeaker}
              aiSpeaking={isAISpeaking}
            />
            {/* פרטי השלב הנוכחי */}
            {currentStep && (
              <Card className="mt-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">📋 השלב הנוכחי</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <h4 className="font-medium">{currentStep.title}</h4>
                  <p className="text-sm text-muted-foreground">{currentStep.description}</p>
                  {currentStep.duration && (
                    <Badge variant="outline" className="text-xs">
                      ⏱️ {currentStep.duration} דקות
                    </Badge>
                  )}
                </CardContent>
              </Card>
            )}
            {/* הודעה למסכים קטנים */}
            <div className="mt-4 lg:hidden">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-3">
                  <p className="text-xs text-blue-700 text-center">
                    💡 במסכים קטנים: רשימת המשתתפים נמצאת כאן למעלה
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};