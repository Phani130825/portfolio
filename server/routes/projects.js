const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'portfolio/projects',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
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

// Helper function to get base URL
const getBaseUrl = (req) => {
    if (process.env.NODE_ENV === 'production') {
        return 'https://phanis-portfolio.onrender.com';
    }
    return `http://localhost:${process.env.PORT || 5000}`;
};

// Get all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ order: 1 });
        // Update image URLs with correct base URL
        const updatedProjects = projects.map(project => {
            const projectObj = project.toObject();
            if (projectObj.imageUrl) {
                projectObj.imageUrl = projectObj.imageUrl.replace(
                    /^http:\/\/localhost:5000/,
                    getBaseUrl(req)
                );
            }
            return projectObj;
        });
        res.json(updatedProjects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Error fetching projects' });
    }
});

// Get single project
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        const projectObj = project.toObject();
        if (projectObj.imageUrl) {
            projectObj.imageUrl = projectObj.imageUrl.replace(
                /^http:\/\/localhost:5000/,
                getBaseUrl(req)
            );
        }
        res.json(projectObj);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ message: 'Error fetching project' });
    }
});

// Create project (admin only)
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const projectData = {
            ...req.body,
            technologies: req.body.technologies.split(','),
            imageUrl: req.file ? req.file.path : null
        };

        const project = new Project(projectData);
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Error creating project' });
    }
});

// Update project (admin only)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const projectData = {
            ...req.body,
            technologies: req.body.technologies.split(',')
        };

        if (req.file) {
            projectData.imageUrl = req.file.path;
        }

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            projectData,
            { new: true }
        );

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(project);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Error updating project' });
    }
});

// Delete project (admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Delete image from Cloudinary if it exists
        if (project.imageUrl) {
            const publicId = project.imageUrl.split('/').slice(-1)[0].split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Error deleting project', error: error.message });
    }
});

module.exports = router; 