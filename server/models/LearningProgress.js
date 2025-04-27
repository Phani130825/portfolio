const mongoose = require('mongoose');

const learningProgressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['note', 'snippet', 'progress'],
        required: true
    },
    targetType: {
        type: String,
        enum: ['blog', 'project'],
        required: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        validate: {
            validator: function(v) {
                return this.type === 'progress' ? v >= 0 && v <= 100 : true;
            },
            message: 'Progress must be between 0 and 100'
        }
    },
    tags: [{
        type: String,
        trim: true
    }],
    isPublic: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for efficient querying
learningProgressSchema.index({ user: 1, targetType: 1, targetId: 1 });

const LearningProgress = mongoose.model('LearningProgress', learningProgressSchema);
module.exports = LearningProgress; 