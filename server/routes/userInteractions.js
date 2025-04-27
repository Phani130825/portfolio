const express = require('express');
const router = express.Router();
const UserInteraction = require('../models/UserInteraction');
const auth = require('../middleware/auth');

// Get user interactions
router.get('/', auth, async (req, res) => {
    try {
        const interactions = await UserInteraction.find({ user: req.user._id })
            .populate('targetId', 'title');
        res.json(interactions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching interactions', error: error.message });
    }
});

// Add interaction (like, bookmark, rating, comment)
router.post('/', auth, async (req, res) => {
    try {
        const { type, targetType, targetId, rating, comment } = req.body;

        // Check if interaction already exists
        const existingInteraction = await UserInteraction.findOne({
            user: req.user._id,
            type,
            targetType,
            targetId
        });

        if (existingInteraction) {
            // Update existing interaction
            if (rating) existingInteraction.rating = rating;
            if (comment) existingInteraction.comment = comment;
            await existingInteraction.save();
            return res.json(existingInteraction);
        }

        // Create new interaction
        const interaction = new UserInteraction({
            user: req.user._id,
            type,
            targetType,
            targetId,
            rating,
            comment
        });

        await interaction.save();
        res.status(201).json(interaction);
    } catch (error) {
        res.status(500).json({ message: 'Error creating interaction', error: error.message });
    }
});

// Remove interaction
router.delete('/:id', auth, async (req, res) => {
    try {
        const interaction = await UserInteraction.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!interaction) {
            return res.status(404).json({ message: 'Interaction not found' });
        }

        res.json({ message: 'Interaction removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing interaction', error: error.message });
    }
});

// Get interactions for a specific target
router.get('/target/:targetType/:targetId', async (req, res) => {
    try {
        const { targetType, targetId } = req.params;
        const interactions = await UserInteraction.find({ targetType, targetId })
            .populate('user', 'username')
            .sort({ createdAt: -1 });
        res.json(interactions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching target interactions', error: error.message });
    }
});

module.exports = router; 