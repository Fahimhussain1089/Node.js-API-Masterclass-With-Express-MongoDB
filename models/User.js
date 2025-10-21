const crypto = require('crypto');
const mongoose = require('mongoose');
const slugify = require('slugify');
const jwt = require('jsonwebtoken'); // ADD THIS IMPORT
const bcrypt = require('bcryptjs');


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    role: {
        type: String,
        enum: ['user', 'publisher', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    createdAt: {
        type: Date,
        default: Date.now
    }
});
// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
}
);
//Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
        // Debug: Check what JWT_SECRET is being used
    console.log('🔐 JWT_SECRET being used:', process.env.JWT_SECRET || 'Using fallback secret');
    
    const jwtSecret = process.env.JWT_SECRET || 'devcamper_fallback_secret_key_2024_123456789';
    const jwtExpire = process.env.JWT_EXPIRE || '30d';
     return jwt.sign({ id: this._id }, jwtSecret, {
        expiresIn: jwtExpire
    });


    // return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    //     expiresIn: process.env.JWT_EXPIRE
    // });
}
// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken;
}






module.exports = mongoose.model('User', UserSchema);
