const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protect routes
// exports.protect = asyncHandler(async (req, res, next) => {
//     let token;

//     // Check for token in Authorization header
//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//         token = req.headers.authorization.split(' ')[1];

//     }
//     else if (req.cookies.token) {// Check for token in cookies
//         token = req.cookies.token;
//     }

//     // Make sure token exists
//     if (!token) {//if token nai hai 
//         return next(new ErrorResponse('Not authorized to access this route', 401));
//     }

//     try {
        
//         console.log('Token:', token); // Debug: Log the token

//         // Verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         console.log('Decoded JWT:', decoded); // Debug: Log the decoded token

//         // req.user = await User.findById(decoded.id);

//         // Find user and check if they exist
//         const user = await User.findById(decoded.id);
        
//         if (!user) {
//             console.log('User not found with ID:', decoded.id);
//             return next(new ErrorResponse('User no longer exists', 401));
//         }

//         next();
//     }catch (err) {
//         return next(new ErrorResponse('Not authorized to access this route', 401));
//     }
// });


// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    console.log('Authorization header:', req.headers.authorization);

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        console.log('Token extracted:', token);
    }
    // Check for token in cookies
    else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
        console.log('Token from cookies:', token);
    }

    // Make sure token exists
    if (!token) {
        console.log('No token found');
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        console.log('Token to verify:', token);
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded JWT:', decoded);

        // Find user and check if they exist
        const user = await User.findById(decoded.id);
        
        if (!user) {
            console.log('User not found with ID:', decoded.id);
            return next(new ErrorResponse('User no longer exists', 401));
        }

        // ✅ CRITICAL: Set req.user so it's available in next middleware
        req.user = user;
        console.log('✅ req.user set successfully:', req.user.id);
        
        next();
    } catch (err) {
        console.log('JWT verification error:', err.message);
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
});

//Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403)
            );
        }
        next();
    }
};
