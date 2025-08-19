const User = require('../models/User');
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

/**
 * @desc    Register user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    sendTokenResponse(user, 200, res);
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

/**
 * @desc    Get current logged in user
 * @route   POST /api/v1/auth/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});


/**
 * @desc    Get token from model, create cookie and send response
 */
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
    });
};

/**
 * @desc      Google OAuth callback
 * @route     GET /api/v1/auth/google/callback
 * @access    Public
 */
exports.googleCallback = (req, res, next) => {
  const token = req.user.getSignedJwtToken();
  // Redirect to a frontend route that will handle the token
  res.redirect(`${process.env.CLIENT_URL}/login-success?token=${token}`);
};

/**
 * @desc      Facebook OAuth callback
 * @route     GET /api/v1/auth/facebook/callback
 * @access    Public
 */
exports.facebookCallback = (req, res, next) => {
  const token = req.user.getSignedJwtToken();
  // Redirect to a frontend route that will handle the token
  res.redirect(`${process.env.CLIENT_URL}/login-success?token=${token}`);
};
