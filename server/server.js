const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? true  // Allow all origins in production since we're serving from the same domain
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Create upload directories if they don't exist
const fs = require('fs');
const uploadDirs = ['uploads/projects', 'uploads/resources', 'uploads/feedback'];
uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/interactions', require('./routes/userInteractions'));
app.use('/api/learning', require('./routes/learningProgress'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/feedback', require('./routes/feedback'));

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
    // Serve static files from the React app
    app.use(express.static(path.join(__dirname, '../client/build')));

    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err.name === 'ValidationError') {
        return res.status(400).json({ 
            message: 'Validation Error', 
            errors: Object.values(err.errors).map(e => e.message) 
        });
    }
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
    }
    if (err.name === 'MulterError') {
        return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 