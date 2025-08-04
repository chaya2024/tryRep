const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const Script = require('../models/Script');
const Progress = require('../models/Progress');

// Get all groups with progress
router.get('/groups', async (req, res) => {
  try {
    const groups = await Group.find().populate('scriptId', 'title description');
    const groupsWithProgress = await Promise.all(
      groups.map(async (group) => {
        const progress = await Progress.findOne({ groupId: group._id });
        return {
          id: group._id,
          name: group.name,
          currentStep: group.currentStep,
          participantCount: group.participants.length,
          participants: group.participants,
          script: group.scriptId,
          isActive: group.isActive,
          createdAt: group.createdAt,
          progress: progress ? {
            completedSteps: progress.completedSteps.length,
            status: progress.status
          } : null
        };
      })
    );
    
    res.json(groupsWithProgress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all scripts
router.get('/scripts', async (req, res) => {
  try {
    const scripts = await Script.find({ isActive: true });
    res.json(scripts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new script
router.post('/scripts', async (req, res) => {
  try {
    const script = new Script(req.body);
    await script.save();
    res.status(201).json({ success: true, script });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update script
router.put('/scripts/:id', async (req, res) => {
  try {
    const script = await Script.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    if (!script) {
      return res.status(404).json({ error: 'Script not found' });
    }
    res.json({ success: true, script });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete script (soft delete)
router.delete('/scripts/:id', async (req, res) => {
  try {
    const script = await Script.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!script) {
      return res.status(404).json({ error: 'Script not found' });
    }
    res.json({ success: true, message: 'Script deactivated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get detailed progress for a group
router.get('/groups/:id/progress', async (req, res) => {
  try {
    const progress = await Progress.findOne({ groupId: req.params.id })
      .populate('groupId', 'name participants')
      .populate('scriptId', 'title steps');
    
    if (!progress) {
      return res.status(404).json({ error: 'Progress not found' });
    }
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;