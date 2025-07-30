const mongoose = require('mongoose');

const AITextSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['greeting', 'ai_response', 'system_message', 'encouragement', 'transition']
  },
  content: {
    type: String,
    required: true
  },
  context: {
    type: String,
    default: 'general' // 'greeting', 'child_response', 'step_transition', etc.
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('AIText', AITextSchema); 