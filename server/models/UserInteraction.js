const mongoose = require('mongoose');

const userInteractionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['like', 'bookmark', 'rating', 'comment'],
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
    rating: {
        type: Number,
        min: 1,
        max: 5,
        validate: {
            validator: function(v) {
                return this.type === 'rating' ? v >= 1 && v <= 5 : true;
            },
            message: 'Rating must be between 1 and 5'
        }
    },
    comment: {
        type: String,
        validate: {
            validator: function(v) {
                return this.type === 'comment' ? v && v.length > 0 : true;
            },
            message: 'Comment is required for comment type'
        }
    }
}, {
    timestamps: true
});

// Compound index to ensure unique interactions
userInteractionSchema.index({ user: 1, type: 1, targetType: 1, targetId: 1 }, { unique: true });

const UserInteraction = mongoose.model('UserInteraction', userInteractionSchema);
module.exports = UserInteraction; 