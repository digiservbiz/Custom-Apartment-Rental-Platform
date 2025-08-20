const Setting = require('../models/Setting');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get a single setting by key
// @route   GET /api/v1/settings/:key
// @access  Public
exports.getSetting = asyncHandler(async (req, res, next) => {
  const setting = await Setting.findOne({ key: req.params.key });

  if (!setting) {
    // If the setting doesn't exist, we can return a default or an error.
    // For commission_fee, we'll return a default if it's not set.
    if (req.params.key === 'commission_fee') {
      return res.status(200).json({ success: true, data: { key: 'commission_fee', value: '10' } }); // Default to 10%
    }
    return next(new ErrorResponse(`Setting with key '${req.params.key}' not found`, 404));
  }

  res.status(200).json({ success: true, data: setting });
});

// @desc    Update a setting
// @route   PUT /api/v1/settings/:key
// @access  Private (Admin)
exports.updateSetting = asyncHandler(async (req, res, next) => {
  const { key } = req.params;
  const { value } = req.body;

  // Use findOneAndUpdate with upsert to create the setting if it doesn't exist
  const setting = await Setting.findOneAndUpdate(
    { key },
    { value },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({ success: true, data: setting });
});
