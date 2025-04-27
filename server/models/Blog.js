const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    imageUrl: {
        type: String
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    slug: {
        type: String,
        unique: true,
        required: true
    }
}, {
    timestamps: true
});

// Create slug from title before validation
blogSchema.pre('validate', function(next) {
    if (!this.slug || this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, '-')
            .replace(/-+/g, '-');
    }
    next();
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog; 