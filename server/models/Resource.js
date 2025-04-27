const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['code', 'tutorial', 'premium', 'exclusive'],
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    relatedTo: {
        type: {
            type: String,
            enum: ['blog', 'project'],
            required: true
        },
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    downloadCount: {
        type: Number,
        default: 0
    },
    tags: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

// Index for efficient querying
resourceSchema.index({ 'relatedTo.type': 1, 'relatedTo.id': 1 });
resourceSchema.index({ type: 1, isPremium: 1 });

const Resource = mongoose.model('Resource', resourceSchema);
module.exports = Resource; 