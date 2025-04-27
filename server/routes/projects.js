const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/projects');
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
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Get all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ order: 1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error: error.message });
    }
});

// Get single project
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching project', error: error.message });
    }
});

// Create new project (protected route)
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const { title, description, technologies, githubUrl, liveUrl, order, featured } = req.body;
        
        // Validate input
        if (!title || !description || !req.file) {
            return res.status(400).json({ message: 'Title, description, and image are required' });
        }

        const serverUrl = process.env.SERVER_URL || 'http://localhost:5000';

        const project = new Project({
            title,
            description,
            imageUrl: `${serverUrl}/uploads/projects/${req.file.filename}`,
            technologies: technologies ? technologies.split(',').map(tech => tech.trim()) : [],
            githubUrl,
            liveUrl,
            order: order || 0,
            featured: featured === 'true'
        });

        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error creating project', error: error.message });
    }
});

// Update project (protected route)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
    try {
        const { title, description, technologies, githubUrl, liveUrl, order, featured } = req.body;
        
        const updateData = {
            title,
            description,
            technologies: technologies ? technologies.split(',').map(tech => tech.trim()) : [],
            githubUrl,
            liveUrl,
            order: order || 0,
            featured: featured === 'true'
        };

        if (req.file) {
            const serverUrl = process.env.SERVER_URL || 'http://localhost:5000';
            updateData.imageUrl = `${serverUrl}/uploads/projects/${req.file.filename}`;
        }

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error updating project', error: error.message });
    }
});

// Delete project (protected route)
router.delete('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting project', error: error.message });
    }
});

module.exports = router; 