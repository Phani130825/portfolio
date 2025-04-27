const express = require('express');
const router = express.Router();
const LearningProgress = require('../models/LearningProgress');
const auth = require('../middleware/auth');

// Get user's learning progress
router.get('/', auth, async (req, res) => {
    try {
        const progress = await LearningProgress.find({ user: req.user._id })
            .populate('targetId', 'title')
            .sort({ createdAt: -1 });
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching learning progress', error: error.message });
    }
});

// Add learning progress (note, snippet, progress)
router.post('/', auth, async (req, res) => {
    try {
        const { type, targetType, targetId, content, progress, tags, isPublic } = req.body;

        const learningProgress = new LearningProgress({
            user: req.user._id,
            type,
            targetType,
            targetId,
            content,
            progress,
            tags,
            isPublic
        });

        await learningProgress.save();
        res.status(201).json(learningProgress);
    } catch (error) {
        res.status(500).json({ message: 'Error creating learning progress', error: error.message });
    }
});

// Update learning progress
router.put('/:id', auth, async (req, res) => {
    try {
        const { content, progress, tags, isPublic } = req.body;

        const learningProgress = await LearningProgress.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { content, progress, tags, isPublic },
            { new: true, runValidators: true }
        );

        if (!learningProgress) {
            return res.status(404).json({ message: 'Learning progress not found' });
        }

        res.json(learningProgress);
    } catch (error) {
        res.status(500).json({ message: 'Error updating learning progress', error: error.message });
    }
});

// Delete learning progress
router.delete('/:id', auth, async (req, res) => {
    try {
        const learningProgress = await LearningProgress.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!learningProgress) {
            return res.status(404).json({ message: 'Learning progress not found' });
        }

        res.json({ message: 'Learning progress deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting learning progress', error: error.message });
    }
});

// Get public learning progress for a target
router.get('/public/:targetType/:targetId', async (req, res) => {
    try {
        const { targetType, targetId } = req.params;
        const progress = await LearningProgress.find({
            targetType,
            targetId,
            isPublic: true
        })
            .populate('user', 'username')
            .sort({ createdAt: -1 });
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching public learning progress', error: error.message });
    }
});

module.exports = router; 