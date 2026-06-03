const User = require('../models/User');
const { sendEmail } = require('../services/emailService');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

/**
 * @desc    Get all users
 * @route   GET /api/v1/users
 * @access  Private (Admin)
 */
exports.getUsers = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const safeFields = 'name email phoneNumber role kycStatus createdAt';
    const total = await User.countDocuments();
    const users = await User.find().select(safeFields).skip(skip).limit(limit);

    res.status(200).json({ success: true, count: users.length, total, page, data: users });
});

/**
 * @desc    Get single user
 * @route   GET /api/v1/users/:id
 * @access  Private (Admin)
 */
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id).select('name email phoneNumber role kycStatus createdAt');
    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: user });
});

/**
 * @desc    Update user status (for KYC)
 * @route   PUT /api/v1/users/:id/updatestatus
 * @access  Private (Admin)
 */
exports.updateUserStatus = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, { kycStatus: req.body.kycStatus }, {
        new: true,
        runValidators: true,
    });

    // Send notification to user
    const message = `Your KYC status has been updated to ${user.kycStatus}.`;
    await sendEmail(user.email, 'KYC Status Update', message);

    res.status(200).json({ success: true, data: user });
});

/**
 * @desc    Update user
 * @route   PUT /api/v1/users/:id
 * @access  Private (Admin)
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
    // Prevent changing role or password through this endpoint
    delete req.body.password;
    delete req.body.role;

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    }).select('name email phoneNumber role kycStatus createdAt');

    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: user });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/v1/users/:id
 * @access  Private (Admin)
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }

    await user.deleteOne();
    res.status(200).json({ success: true, data: {} });
});
