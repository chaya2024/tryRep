const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  openingText: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  choices: [{
    id: String,
    text: String,
    isCorrect: Boolean
  }],
  instructorResponse: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  }
});

const scriptSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  targetAge: {
    min: Number,
    max: Number
  },
  duration: {
    type: Number, // in minutes
    default: 30
  },
  steps: [stepSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Script', scriptSchema);