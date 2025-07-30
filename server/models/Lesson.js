const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: String,
  subject: String,
  targetAge: Number,
  description: String,
  steps: [
    {
      title: String,
      description: String,
      aiPrompt: String,
      duration: Number
    }
  ],
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Child' }]
});

module.exports = mongoose.model('Lesson', LessonSchema); 