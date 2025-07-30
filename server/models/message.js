const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  senderId: String,
  senderName: String,
  senderType: String, // 'child' | 'ai'
  content: String,
  timestamp: { type: Date, default: Date.now },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }
});

module.exports = mongoose.model('Message', MessageSchema);