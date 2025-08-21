const Booking = require('../models/Booking');
const Apartment = require('../models/Apartment');
const { processPayment } = require('../services/paymentService');
const { sendEmail } = require('../services/emailService');
const { sendMessage } = require('../services/whatsappService');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

/**
 * @desc    Create new booking
 * @route   POST /api/v1/bookings
 * @access  Private (Renters)
 */
exports.createBooking = asyncHandler(async (req, res, next) => {
  const { apartment, checkInDate, checkOutDate } = req.body;

  // 1. Check for conflicting bookings before creating a new one
  const existingBooking = await Booking.findOne({
    apartment,
    status: 'Confirmed',
    $or: [
      { checkInDate: { $lt: checkOutDate }, checkOutDate: { $gt: checkInDate } },
    ],
  });

  if (existingBooking) {
    return next(new ErrorResponse('Sorry, the apartment is already booked for the selected dates.', 400));
  }

  // 2. Add renter and set initial status
  req.body.renter = req.user.id;
  req.body.status = 'Pending'; // All bookings start as pending until payment is confirmed

  // 3. Create the booking
  const booking = await Booking.create(req.body);

  res.status(201).json({ success: true, data: booking });
});

/**
 * @desc    Get all bookings
 * @route   GET /api/v1/bookings
 * @access  Private (Admin)
 */
exports.getBookings = asyncHandler(async (req, res, next) => {
    const bookings = await Booking.find().populate('apartment', 'location').populate('renter', 'name email');
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
});

/**
 * @desc    Get my bookings
 * @route   GET /api/v1/bookings/mybookings
 * @access  Private
 */
exports.getMyBookings = asyncHandler(async (req, res, next) => {
    const bookings = await Booking.find({ renter: req.user.id }).populate('apartment', 'location');
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
});

/**
 * @desc    Get single booking
 * @route   GET /api/v1/bookings/:id
 * @access  Private
 */
exports.getBooking = asyncHandler(async (req, res, next) => {
    const booking = await Booking.findById(req.params.id).populate('apartment', 'location').populate('renter', 'name email');
    if (!booking) {
        return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is the renter or an admin
    if (booking.renter.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to view this booking`, 401));
    }

    res.status(200).json({ success: true, data: booking });
});
