const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['bug', 'feature', 'improvement', 'general'],
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'resolved', 'rejected'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    relatedTo: {
        type: {
            type: String,
            enum: ['blog', 'project', 'resource', 'general'],
            required: true
        },
        id: {
            type: mongoose.Schema.Types.ObjectId
        }
    },
    attachments: [{
        url: String,
        type: String,
        size: Number
    }],
    responses: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            default: false
        }
    }],
    isPublic: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for efficient querying
feedbackSchema.index({ user: 1, status: 1 });
feedbackSchema.index({ type: 1, priority: 1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback; 