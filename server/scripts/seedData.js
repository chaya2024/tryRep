const mongoose = require('mongoose');
require('dotenv').config();

const Script = require('../models/Script');

// Sample educational script for children aged 8-11
const sampleScript = {
  title: "חקר החלל - מסע בין כוכבים",
  description: "מסע מרתק לחקר החלל והכוכבים עבור ילדים",
  targetAge: { min: 8, max: 11 },
  duration: 25,
  steps: [
    {
      title: "פתיחה - ברוכים הבאים לחלל!",
      openingText: "שלום חברים! אני רובי הרובוט, והיום נצא יחד למסע מרגש בחלל! נלמד על כוכבים, כוכבי לכת ועל מערכת השמש שלנו. מוכנים להרפתקה?",
      question: "איך לדעתכם נוכל להגיע לחלל?",
      choices: [
        { id: "rocket", text: "ברקטה מיוחדת", isCorrect: true },
        { id: "plane", text: "במטוס רגיל", isCorrect: false },
        { id: "balloon", text: "בבלון אוויר חם", isCorrect: false },
        { id: "car", text: "במכונית מהירה", isCorrect: false }
      ],
      instructorResponse: "כל הכבוד! אכן, כדי להגיע לחלל אנחנו צריכים רקטה מיוחדת שיכולה להתגבר על כוח המשיכה של כדור הארץ. רקטות הן חזקות מאוד ויכולות לטוס מהר מאוד!",
      summary: "למדנו שכדי להגיע לחלל צריך רקטה מיוחדת שיכולה להתגבר על כוח המשיכה של כדור הארץ."
    },
    {
      title: "מערכת השמש שלנו",
      openingText: "עכשיו שאנחנו בחלל, בואו נכיר את מערכת השמש שלנו! במרכז יש לנו את השמש, והיא מחממת ומאירה לכל כוכבי הלכת שמסתובבים סביבה.",
      question: "כמה כוכבי לכת יש במערכת השמש שלנו?",
      choices: [
        { id: "six", text: "6 כוכבי לכת", isCorrect: false },
        { id: "eight", text: "8 כוכבי לכת", isCorrect: true },
        { id: "ten", text: "10 כוכבי לכת", isCorrect: false },
        { id: "twelve", text: "12 כוכבי לכת", isCorrect: false }
      ],
      instructorResponse: "נכון מאוד! יש 8 כוכבי לכת במערכת השמש: מרקורי, נוגה, כדור הארץ, מאדים, צדק, שבתאי, אורנוס ונפטון. כל אחד מהם מיוחד ושונה!",
      summary: "במערכת השמש שלנו יש 8 כוכבי לכת שמסתובבים סביב השמש."
    },
    {
      title: "כדור הארץ - הבית שלנו",
      openingText: "כדור הארץ הוא הכוכב הכי מיוחד בעינינו - כי זה הבית שלנו! הוא הכוכב היחיד שאנחנו יודעים שיש בו חיים.",
      question: "מה עושה את כדור הארץ מיוחד לחיים?",
      choices: [
        { id: "water", text: "יש בו מים ואוויר", isCorrect: true },
        { id: "gold", text: "יש בו הרבה זהב", isCorrect: false },
        { id: "robots", text: "יש בו רובוטים", isCorrect: false },
        { id: "ice", text: "הוא עשוי מקרח", isCorrect: false }
      ],
      instructorResponse: "מעולה! כדור הארץ מיוחד כי יש בו מים נוזליים ואוויר לנשימה. הוא נמצא במרחק הנכון מהשמש - לא חם מדי ולא קר מדי. זה נקרא 'הגזון הזהב'!",
      summary: "כדור הארץ מיוחד לחיים כי יש בו מים, אוויר, והוא במרחק הנכון מהשמש."
    },
    {
      title: "סיכום המסע",
      openingText: "איזה מסע נפלא היה לנו! חקרנו את החלל, למדנו על מערכת השמש ועל כדור הארץ המיוחד שלנו.",
      question: "מה הכי מעניין אתכם לחקור הבא בחלל?",
      choices: [
        { id: "moon", text: "הירח וההרים שלו", isCorrect: true },
        { id: "mars", text: "כוכב מאדים האדום", isCorrect: true },
        { id: "stars", text: "כוכבים רחוקים", isCorrect: true },
        { id: "aliens", text: "חיים בחלל", isCorrect: true }
      ],
      instructorResponse: "כל התשובות נהדרות! יש כל כך הרבה דברים מרתקים לחקור בחלל. הדבר הכי חשוב הוא לשמור על הסקרנות ולהמשיך לשאול שאלות. אולי יום אחד תהיו חוקרי חלל אמיתיים!",
      summary: "סיימנו את המסע בחלל! למדנו על רקטות, מערכת השמש, וכדור הארץ המיוחד. הכי חשוב - לשמור על הסקרנות!"
    }
  ]
};

async function seedDatabase() {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/ican_education');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ican_education');
    console.log('Connected to MongoDB');

    // Clear existing scripts
    await Script.deleteMany({});
    console.log('Cleared existing scripts');

    // Insert sample script
    const script = new Script(sampleScript);
    await script.save();
    console.log('Sample script created:', script._id);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    console.log('\n🚨 MongoDB Connection Failed!');
    console.log('Please ensure MongoDB is running before seeding the database.');
    console.log('\nTo start MongoDB:');
    console.log('1. Install MongoDB: https://docs.mongodb.com/manual/installation/');
    console.log('2. Start MongoDB service:');
    console.log('   - On macOS: brew services start mongodb/brew/mongodb-community');
    console.log('   - On Ubuntu: sudo systemctl start mongod');
    console.log('   - On Windows: net start MongoDB');
    console.log('   - Or run: mongod');
    console.log('\nAlternatively, use MongoDB Atlas (cloud):');
    console.log('1. Create account at https://cloud.mongodb.com');
    console.log('2. Create cluster and get connection string');
    console.log('3. Update MONGODB_URI in server/.env file');
    console.log('\nThen run: npm run seed');
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();