const mongoose = require('mongoose');
const Lesson = require('./models/Lesson');
const Child = require('./models/Child');
const Message = require('./models/Message');
const AIText = require('./models/AIText');

mongoose.connect('mongodb://localhost:27017/ignite-curiosity', { useNewUrlParser: true, useUnifiedTopology: true });

async function seed() {
  await Lesson.deleteMany();
  await Child.deleteMany();
  await Message.deleteMany();
  await AIText.deleteMany();

  // ילדים
  const children = await Child.insertMany([
    { name: "נועה", avatar: "", personality: "סקרנית ואוהבת לשאול שאלות" },
    { name: "יונתן", avatar: "", personality: "יצירתי ומלא רעיונות חדשים" },
    { name: "תמר", avatar: "", personality: "מנהיגה טבעית ואחראית" }
  ]);

  // שיעור
  const lesson = await Lesson.create({
    title: "האי הבודד - הרפתקת יזמות",
    subject: "יזמות וחשיבה יצירתית",
    targetAge: 9,
    description: "שיעור פתיחה בנושא יזמות דרך תרחיש מרתק של נחיתה על אי בודד",
    steps: [
      { title: "פתיחה", description: "הכרות עם הילדים", aiPrompt: "בואו נכיר!", duration: 5 },
      { title: "הצגת התרחיש", description: "הצגת האי", aiPrompt: "אתם נוחתים על אי בודד...", duration: 10 }
    ],
    participants: children.map(c => c._id)
  });

  // טקסטים של AI
  await AIText.insertMany([
    // ברכות
    { type: 'greeting', content: 'שלום ילדים יקרים! ברוכים הבאים לשיעור "{lessonTitle}". אני מאוד נרגש לבלות איתכם ולחקור יחד נושאים מרתקים! 🌟', context: 'lesson_start', order: 1 },
    { type: 'greeting', content: 'היי ילדים! איזה כיף לראות אתכם היום! בואו נתחיל הרפתקה מדהימה יחד! 🚀', context: 'lesson_start', order: 2 },
    
    // תגובות AI
    { type: 'ai_response', content: 'איזה רעיון מעניין! מי עוד חושב כך?', context: 'child_response', order: 1 },
    { type: 'ai_response', content: 'אהבתי את הרעיון הזה! בואו נשמע עוד דעות', context: 'child_response', order: 2 },
    { type: 'ai_response', content: 'חשיבה מצוינת! איך אתם חושבים שנוכל ליישם את זה?', context: 'child_response', order: 3 },
    { type: 'ai_response', content: 'תשובה נהדרת! מי יכול להוסיף משהו לרעיון הזה?', context: 'child_response', order: 4 },
    { type: 'ai_response', content: 'מעולה! אני רואה שאתם חושבים כמו יזמים אמיתיים!', context: 'child_response', order: 5 },
    { type: 'ai_response', content: 'וואו! זה רעיון יצירתי מאוד! בואו נפתח אותו יחד', context: 'child_response', order: 6 },
    { type: 'ai_response', content: 'אני אוהב איך אתם חושבים! מי רוצה לשתף רעיון נוסף?', context: 'child_response', order: 7 },
    
    // הודעות מערכת
    { type: 'system_message', content: '🎮 ברוכים הבאים! השתמשו בכפתורים למטה כדי לנהל את השיחה', context: 'lesson_start', order: 1 },
    { type: 'system_message', content: '👋 המנחה בירך אתכם! עכשיו הוא יגיד את השאלה הראשונה...', context: 'lesson_start', order: 2 },
    { type: 'system_message', content: '🎯 עכשיו תורכם! לחצו על \'👶 תגובת ילד\' כדי לשמוע תגובה מילד', context: 'child_turn', order: 1 },
    { type: 'system_message', content: '💡 הכפתורים נמצאים למעלה או למטה במסך', context: 'child_turn', order: 2 },
    { type: 'system_message', content: '👶 עכשיו תור הילדים! לחצו על \'👶 תגובת ילד\'', context: 'ai_response_end', order: 1 },
    
    // עידוד
    { type: 'encouragement', content: 'בואו נשמע מכם! מי רוצה להתחיל? 😊', context: 'lesson_start', order: 1 },
    { type: 'encouragement', content: 'איזה שיעור נפלא היה לנו! תודה לכולכם על השתתפות פעילה ורעיונות מדהימים. אתם יזמים אמיתיים! 🎉', context: 'lesson_end', order: 1 },
    { type: 'encouragement', content: 'אתם מדהימים! בואו נמשיך לשלב הבא', context: 'step_transition', order: 1 },
    
    // מעברים
    { type: 'transition', content: 'עכשיו בואו נעבור לשלב הבא...', context: 'step_transition', order: 1 },
    { type: 'transition', content: 'מעולה! עכשיו בואו נחקור משהו חדש', context: 'step_transition', order: 2 }
  ]);

  // הודעות לדוגמה
  await Message.insertMany([
    { senderId: "ai-teacher", senderName: "המנחה", senderType: "ai", content: "שלום ילדים!", lessonId: lesson._id },
    { senderId: children[0]._id, senderName: children[0].name, senderType: "child", content: "היי!", lessonId: lesson._id }
  ]);

  console.log("Seed complete!");
  process.exit();
}

seed(); 