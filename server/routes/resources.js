const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/resources');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

// Check file type
function checkFileType(file, cb) {
    const filetypes = /pdf|doc|docx|zip|rar|txt|js|py|java|cpp|html|css/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Invalid file type!');
    }
}

// Get all resources
router.get('/', async (req, res) => {
    try {
        const resources = await Resource.find()
            .populate('relatedTo.id', 'title')
            .sort({ createdAt: -1 });
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching resources', error: error.message });
    }
});

// Get resources by type
router.get('/type/:type', async (req, res) => {
    try {
        const resources = await Resource.find({ type: req.params.type })
            .populate('relatedTo.id', 'title')
            .sort({ createdAt: -1 });
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching resources', error: error.message });
    }
});

// Get resources for a specific target
router.get('/target/:targetType/:targetId', async (req, res) => {
    try {
        const { targetType, targetId } = req.params;
        const resources = await Resource.find({
            'relatedTo.type': targetType,
            'relatedTo.id': targetId
        }).sort({ createdAt: -1 });
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching target resources', error: error.message });
    }
});

// Create new resource (protected route)
router.post('/', auth, upload.single('file'), async (req, res) => {
    try {
        const { title, description, type, relatedTo, isPremium, tags } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: 'File is required' });
        }

        const resource = new Resource({
            title,
            description,
            type,
            fileUrl: `/uploads/resources/${req.file.filename}`,
            fileSize: req.file.size,
            fileType: path.extname(req.file.originalname).substring(1),
            relatedTo: JSON.parse(relatedTo),
            isPremium: isPremium === 'true',
            tags: tags ? tags.split(',').map(tag => tag.trim()) : []
        });

        await resource.save();
        res.status(201).json(resource);
    } catch (error) {
        res.status(500).json({ message: 'Error creating resource', error: error.message });
    }
});

// Update resource (protected route)
router.put('/:id', auth, upload.single('file'), async (req, res) => {
    try {
        const { title, description, type, relatedTo, isPremium, tags } = req.body;
        
        const updateData = {
            title,
            description,
            type,
            relatedTo: JSON.parse(relatedTo),
            isPremium: isPremium === 'true',
            tags: tags ? tags.split(',').map(tag => tag.trim()) : []
        };

        if (req.file) {
            updateData.fileUrl = `/uploads/resources/${req.file.filename}`;
            updateData.fileSize = req.file.size;
            updateData.fileType = path.extname(req.file.originalname).substring(1);
        }

        const resource = await Resource.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        res.json(resource);
    } catch (error) {
        res.status(500).json({ message: 'Error updating resource', error: error.message });
    }
});

// Delete resource (protected route)
router.delete('/:id', auth, async (req, res) => {
    try {
        const resource = await Resource.findByIdAndDelete(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        res.json({ message: 'Resource deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting resource', error: error.message });
    }
});

// Download resource
router.get('/download/:id', async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // Increment download count
        resource.downloadCount += 1;
        await resource.save();

        res.download(path.join(__dirname, '..', resource.fileUrl));
    } catch (error) {
        res.status(500).json({ message: 'Error downloading resource', error: error.message });
    }
});

module.exports = router; 