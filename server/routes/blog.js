const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads', 'blog');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get all blog posts (published for public, all for authenticated users)
router.get('/', auth, async (req, res) => {
    try {
        // For authenticated users, show both published and their own draft posts
        const query = {
            $or: [
                { status: 'published' },
                { author: req.user._id, status: 'draft' }
            ]
        };

        const posts = await Blog.find(query)
            .populate('author', 'username')
            .sort({ createdAt: -1 });
            
        res.json(posts);
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        res.status(500).json({ message: 'Error fetching blog posts', error: error.message });
    }
});

// Get public blog posts (for non-authenticated users)
router.get('/public', async (req, res) => {
    try {
        const posts = await Blog.find({ status: 'published' })
            .populate('author', 'username')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        console.error('Error fetching public blog posts:', error);
        res.status(500).json({ message: 'Error fetching blog posts', error: error.message });
    }
});

// Get single blog post
router.get('/:slug', async (req, res) => {
    try {
        const post = await Blog.findOne({ slug: req.params.slug })
            .populate('author', 'username');
        if (!post) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blog post', error: error.message });
    }
});

// Create new blog post (protected route)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    console.log('Received blog post request:', req.body);
    console.log('File:', req.file);

    const { title, content, excerpt, status, tags } = req.body;
    
    // Validate required fields
    if (!title || !content || !excerpt) {
      return res.status(400).json({ 
        message: 'Title, content, and excerpt are required' 
      });
    }

    // Validate status
    if (status && !['draft', 'published'].includes(status)) {
      return res.status(400).json({
        message: 'Status must be either "draft" or "published"'
      });
    }

    // Parse tags from JSON string
    let parsedTags = [];
    try {
      parsedTags = JSON.parse(tags || '[]');
    } catch (e) {
      console.error('Error parsing tags:', e);
      return res.status(400).json({
        message: 'Invalid tags format'
      });
    }

    const serverUrl = process.env.SERVER_URL || 'http://localhost:5000';
    
    const post = new Blog({
      title,
      content: content, // Store the raw HTML content from Quill
      excerpt,
      status: status || 'draft', // Default to draft if not specified
      tags: parsedTags,
      author: req.user._id,
      imageUrl: req.file ? `${serverUrl}/uploads/blog/${req.file.filename}` : null
    });

    console.log('Creating new blog post:', post);

    await post.save();
    console.log('Blog post saved successfully');
    
    // Populate author information before sending response
    const populatedPost = await Blog.findById(post._id).populate('author', 'username');
    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Error creating blog post:', error);
    // If there was a file upload error, remove the file
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    res.status(500).json({ 
      message: 'Error creating blog post', 
      error: error.message 
    });
  }
});

// Update blog post (protected route)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, status, tags } = req.body;
    
    // Find the existing post
    const existingPost = await Blog.findById(id);
    if (!existingPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Check if user is the author
    if (existingPost.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    // Validate required fields
    if (!title || !content || !excerpt) {
      return res.status(400).json({ 
        message: 'Title, content, and excerpt are required' 
      });
    }

    // Parse tags from JSON string
    let parsedTags = [];
    try {
      parsedTags = JSON.parse(tags || '[]');
    } catch (e) {
      console.error('Error parsing tags:', e);
    }

    // Prepare update data
    const updateData = {
      title,
      content: content, // Store the raw HTML content from Quill
      excerpt,
      status,
      tags: parsedTags
    };

    // Handle image update if new image is uploaded
    if (req.file) {
      const serverUrl = process.env.SERVER_URL || 'http://localhost:5000';
      // Delete old image if exists
      if (existingPost.imageUrl) {
        const oldImagePath = path.join(__dirname, '..', existingPost.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.imageUrl = `${serverUrl}/uploads/blog/${req.file.filename}`;
    }

    // Update the post
    const updatedPost = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'username');

    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    // If there was a file upload error, remove the file
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    res.status(500).json({ 
      message: 'Error updating blog post', 
      error: error.message 
    });
  }
});

// Delete blog post (protected route)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the post
    const post = await Blog.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // Delete associated image if exists
    if (post.imageUrl) {
      const imagePath = path.join(__dirname, '..', post.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete the post
    await Blog.findByIdAndDelete(id);
    
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ 
      message: 'Error deleting blog post', 
      error: error.message 
    });
  }
});

module.exports = router; 