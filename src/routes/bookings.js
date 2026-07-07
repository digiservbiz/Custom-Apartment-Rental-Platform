const express = require('express');
const {
  createBooking,
  getBookings,
  getMyBookings,
  getOwnerBookings,
  getBooking,
} = require('../controllers/bookingController');

const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

router
  .route('/')
  .post(protect, authorize('renter', 'admin'), createBooking)
  .get(protect, authorize('admin'), getBookings);

router.route('/mybookings').get(protect, getMyBookings);
router.route('/owner-bookings').get(protect, authorize('owner', 'agent', 'admin'), getOwnerBookings);

router.route('/:id').get(protect, getBooking);

module.exports = router;
