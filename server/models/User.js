const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
}, {
    timestamps: true
});

// Set admin role for specific email
userSchema.pre('save', async function(next) {
    // Always set admin role for specific email
    if (this.email === 'phanigdg@gmail.com') {
        this.role = 'admin';
    }
    
    // Hash password if modified
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

// Also set admin role on findOneAndUpdate
userSchema.pre('findOneAndUpdate', async function(next) {
    const update = this.getUpdate();
    if (update && update.email === 'phanigdg@gmail.com') {
        this.set({ role: 'admin' });
    }
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function(password) {
    try {
        const isMatch = await bcrypt.compare(password, this.password);
        console.log('Password comparison:', {
            providedPassword: password,
            hashedPassword: this.password,
            isMatch: isMatch
        });
        return isMatch;
    } catch (error) {
        console.error('Password comparison error:', error);
        return false;
    }
};

const User = mongoose.model('User', userSchema);
module.exports = User; 