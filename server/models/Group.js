const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  currentStep: {
    type: Number,
    default: 0
  },
  participants: [{
    name: String,
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  scriptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Script',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedSteps: [{
    stepIndex: Number,
    selectedChoice: String,
    completedAt: {
      type: Date,
      default: Date.now
    }
  }]
});

module.exports = mongoose.model('Group', groupSchema);