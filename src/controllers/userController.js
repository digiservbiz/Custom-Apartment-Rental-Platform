const User = require('../models/User');
const { sendEmail } = require('../services/emailService');

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private (Admin)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private (Admin)
exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update user status (for KYC)
// @route   PUT /api/v1/users/:id/updatestatus
// @access  Private (Admin)
exports.updateUserStatus = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { kycStatus: req.body.kycStatus }, {
            new: true,
            runValidators: true,
        });

        // Send notification to user
        const message = `Your KYC status has been updated to ${user.kycStatus}.`;
        await sendEmail(user.email, 'KYC Status Update', message);

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private (Admin)
exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
