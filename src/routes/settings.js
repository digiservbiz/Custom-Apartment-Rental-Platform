const express = require('express');
const {
  getSetting,
  updateSetting,
} = require('../controllers/settingController');

const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

// Route to get a specific setting
router.route('/:key').get(getSetting);

// Route to update a specific setting (admin only)
router.route('/:key').put(protect, authorize('admin'), updateSetting);

module.exports = router;
