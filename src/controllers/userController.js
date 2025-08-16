const User = require('../models/User');
const { sendEmail } = require('../services/emailService');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private (Admin)
exports.getUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({ success: true, count: users.length, data: users });
});

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private (Admin)
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: user });
});

// @desc    Update user status (for KYC)
// @route   PUT /api/v1/users/:id/updatestatus
// @access  Private (Admin)
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

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private (Admin)
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({ success: true, data: user });
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private (Admin)
exports.deleteUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
});
