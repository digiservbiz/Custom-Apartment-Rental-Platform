const express = require('express');
const multer = require('multer');
const { protect, authorize } = require('../middleware/authMiddleware');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const { isConfigured, uploadImage } = require('../services/uploadService');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 5 }, // 5MB each, max 5 files
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new ErrorResponse('Only image files are allowed', 400));
    }
    cb(null, true);
  },
});

// @desc    Upload apartment photos
// @route   POST /api/v1/uploads
// @access  Private (Owners, Agents, Admin)
router.post(
  '/',
  protect,
  authorize('owner', 'agent', 'admin'),
  upload.array('photos', 5),
  asyncHandler(async (req, res, next) => {
    if (!isConfigured()) {
      return next(
        new ErrorResponse(
          'Photo upload is not configured on this server. Set the CLOUDINARY_* environment variables.',
          503
        )
      );
    }

    if (!req.files || req.files.length === 0) {
      return next(new ErrorResponse('Please attach at least one image file', 400));
    }

    const urls = await Promise.all(
      req.files.map((file) => uploadImage(file.buffer, file.mimetype))
    );

    res.status(201).json({ success: true, count: urls.length, data: urls });
  })
);

module.exports = router;
