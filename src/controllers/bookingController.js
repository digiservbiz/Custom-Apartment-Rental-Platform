const Booking = require('../models/Booking');
const Apartment = require('../models/Apartment');
const { processPayment } = require('../services/paymentService');
const { sendEmail } = require('../services/emailService');
const { sendMessage } = require('../services/whatsappService');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Create new booking
// @route   POST /api/v1/bookings
// @access  Private (Renters)
exports.createBooking = asyncHandler(async (req, res, next) => {
    req.body.renter = req.user.id;

    const apartment = await Apartment.findById(req.body.apartment).populate('manager');

    if (!apartment) {
        return next(new ErrorResponse(`Apartment not found with id of ${req.body.apartment}`, 404));
    }

    // Create booking with pending status
    const booking = await Booking.create({ ...req.body, status: 'Pending' });

    // Process payment
    const paymentResult = await processPayment(booking.totalPrice);

    if (paymentResult.success) {
      booking.status = 'Confirmed';
      await booking.save();
      // Mark apartment as rented
      apartment.status = 'Rented';
      await apartment.save();

      // Send notifications
      const renter = req.user;
      const owner = apartment.manager;

      const renterMessage = `Your booking for ${apartment.location} is confirmed.`;
      await sendEmail(renter.email, 'Booking Confirmation', renterMessage);
      if (renter.phoneNumber) {
        await sendMessage(renter.phoneNumber, renterMessage);
      }

      const ownerMessage = `Your apartment ${apartment.location} has been booked.`;
      await sendEmail(owner.email, 'New Booking', ownerMessage);
      if (owner.phoneNumber) {
        await sendMessage(owner.phoneNumber, ownerMessage);
      }

    } else {
        // Payment failed, booking remains pending or could be cancelled
        // For simplicity, we leave it as pending for now
    }

    res.status(201).json({ success: true, data: booking });
});

// @desc    Get all bookings
// @route   GET /api/v1/bookings
// @access  Private (Admin)
exports.getBookings = asyncHandler(async (req, res, next) => {
    const bookings = await Booking.find().populate('apartment', 'location').populate('renter', 'name email');
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
});

// @desc    Get my bookings
// @route   GET /api/v1/bookings/mybookings
// @access  Private
exports.getMyBookings = asyncHandler(async (req, res, next) => {
    const bookings = await Booking.find({ renter: req.user.id }).populate('apartment', 'location');
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
});

// @desc    Get single booking
// @route   GET /api/v1/bookings/:id
// @access  Private
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
