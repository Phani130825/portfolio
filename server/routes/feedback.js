const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/feedback');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Invalid file type!');
    }
}

// Get all feedback (admin only)
router.get('/admin', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const feedback = await Feedback.find()
            .populate('user', 'username email')
            .populate('relatedTo.id', 'title')
            .sort({ createdAt: -1 });
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedback', error: error.message });
    }
});

// Get user's feedback
router.get('/', auth, async (req, res) => {
    try {
        const feedback = await Feedback.find({ user: req.user._id })
            .populate('relatedTo.id', 'title')
            .sort({ createdAt: -1 });
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedback', error: error.message });
    }
});

// Get public feedback
router.get('/public', async (req, res) => {
    try {
        const feedback = await Feedback.find({ isPublic: true })
            .populate('user', 'username')
            .populate('relatedTo.id', 'title')
            .sort({ createdAt: -1 });
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching public feedback', error: error.message });
    }
});

// Create feedback
router.post('/', auth, upload.array('attachments', 5), async (req, res) => {
    try {
        const { type, title, description, relatedTo, priority, isPublic } = req.body;

        const attachments = req.files ? req.files.map(file => ({
            url: `/uploads/feedback/${file.filename}`,
            type: path.extname(file.originalname).substring(1),
            size: file.size
        })) : [];

        const feedback = new Feedback({
            user: req.user._id,
            type,
            title,
            description,
            relatedTo: JSON.parse(relatedTo),
            priority,
            attachments,
            isPublic: isPublic === 'true'
        });

        await feedback.save();
        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Error creating feedback', error: error.message });
    }
});

// Update feedback status (admin only)
router.put('/:id/status', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { status } = req.body;
        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Error updating feedback status', error: error.message });
    }
});

// Add response to feedback
router.post('/:id/responses', auth, async (req, res) => {
    try {
        const { content } = req.body;
        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        feedback.responses.push({
            user: req.user._id,
            content,
            isAdmin: req.user.role === 'admin'
        });

        await feedback.save();
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Error adding response', error: error.message });
    }
});

// Delete feedback
router.delete('/:id', auth, async (req, res) => {
    try {
        const feedback = await Feedback.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        res.json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting feedback', error: error.message });
    }
});

module.exports = router; 