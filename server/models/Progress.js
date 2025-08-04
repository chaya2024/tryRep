const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  scriptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Script',
    required: true
  },
  completedSteps: [{
    stepIndex: Number,
    selectedChoices: [String],
    completedAt: {
      type: Date,
      default: Date.now
    },
    participantResponses: [{
      participantName: String,
      choice: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }]
  }],
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'paused'],
    default: 'in-progress'
  }
});

module.exports = mongoose.model('Progress', progressSchema);