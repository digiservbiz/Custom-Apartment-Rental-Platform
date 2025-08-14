const express = require('express');
const {
  createBooking,
  getBookings,
  getMyBookings,
  getBooking,
} = require('../controllers/bookingController');

const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

router
  .route('/')
  .post(protect, authorize('renter', 'admin'), createBooking)
  .get(protect, authorize('admin'), getBookings);

router.route('/mybookings').get(protect, getMyBookings);

router.route('/:id').get(protect, getBooking);

module.exports = router;
