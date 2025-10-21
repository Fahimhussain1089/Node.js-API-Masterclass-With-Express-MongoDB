const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password) {
        return next(new ErrorResponse('Please provide name, email and password', 400));
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role: role || 'user' // Default to 'user' if not provided
    });
    // Create token
    //const token = user.getSignedJwtToken();
    const token = user.getSignedJwtToken();


    res.status(200).json({ 
        success: true, 
        token: token, // THIS LINE RETURNS THE TOKEN
        message: 'User registered successfully',
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // For now, just return a success message
    // You'll implement actual login logic later
    // res.status(200).json({
    //     success: true,
    //     message: 'Login route - authentication will be implemented'
    // });

    // Create token
    sendTokenResponse(user, 200, res);
});
//Get toeken from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        });
}

//desc    Get current logged in user
//route   POST /api/v1/auth/me
//access  Private
// exports.getMe = asyncHandler(async (req, res, next) => {
//     const user = await User.findById(req.user.id);
//     if (!user) {
//         console.log('User not found in database with ID:', req.user.id);
//         return next(new ErrorResponse('User not found', 404));
//     }

//     res.status(200).json({
//         success: true,
//         data: user
//     });
// }
// );

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me  // ← FIX: This should be GET, not POST
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
    console.log('=== getMe function called ===');
    console.log('req.user:', req.user);
    console.log('req.user.id:', req.user ? req.user.id : 'undefined');
    
    if (!req.user) {
        console.log('❌ req.user is undefined!');
        return next(new ErrorResponse('User not authenticated', 401));
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
        console.log('User not found in database with ID:', req.user.id);
        return next(new ErrorResponse('User not found', 404));
    }

    console.log('✅ User found:', user.email);
    
    res.status(200).json({
        success: true,
        data: user
    });
});
//@desc    Forgot password
//@route   POST /api/v1/auth/forgotpassword
//@access  Public
// exports.forgotPassword = asyncHandler(async (req, res, next) => {
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) {
//         return next(new ErrorResponse('There is no user with that email', 404));
//     }
//     //Get reset token
//     const resetToken = user.getResetPasswordToken();
//      await user.save({ validateBeforeSave: false });

//     console.log('Reset Token:', resetToken);


//     // For now, just return a success message
//     // You'll implement actual forgot password logic later
//     res.status(200).json({
//         success: true,
//         message: 'Forgot password route - functionality to be implemented'
//     });
// });

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public




exports.forgotPassword = asyncHandler(async (req, res, next) => {
    // Debug: Check environment variables
    console.log('=== DEBUG ENV VARIABLES ===');
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_PORT:', process.env.SMTP_PORT);
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***' : 'undefined');
    console.log('FROM_NAME:', process.env.FROM_NAME);
    console.log('FROM_EMAIL:', process.env.FROM_EMAIL);
    
    // Check if env vars are loaded
    if (!process.env.SMTP_HOST) {
        console.warn('⚠️  Environment variables not loaded! Using fallback values.');
    }

    const user = await User.findOne({ email: req.body.email });
    
    if (!user) {
        return next(new ErrorResponse('There is no user with that email', 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    console.log('Reset Token:', resetToken);
    console.log('User email:', user.email);

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        console.log('Password reset email would be sent to:', user.email);
        console.log('Reset URL:', resetUrl);
        
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Token',
            message: message
        });

        res.status(200).json({
            success: true,
            message: 'Password reset email sent successfully',
            data: {
                email: user.email
                // Remove resetToken and resetUrl in production
            }
        });

    } catch (err) {
        console.error('Error in forgotPassword:', err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse(`Email could not be sent: ${err.message}`, 500));
    }
});

//@desc    Reset password
//@route   PUT /api/v1/auth/resetpassword/:resettoken
//@access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    const user
        = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

    if (!user) {
        return next(new ErrorResponse('Invalid token', 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
});

//@desc    Update user details
//@route   PUT /api/v1/auth/updatedetails
//@access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    };

    const user = await
        User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

    res.status(200).json({
        success: true,
        data: user
    });
});

//@desc    Update password
//@route   PUT /api/v1/auth/updatepassword
//@access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Password is incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
});

//@desc    Logout user / clear cookie
//@route   GET /api/v1/auth/logout
//@access  Private
exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });
});
