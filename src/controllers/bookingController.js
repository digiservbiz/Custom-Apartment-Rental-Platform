const Booking = require('../models/Booking');
const Apartment = require('../models/Apartment');
const { processPayment } = require('../services/paymentService');
const { sendEmail } = require('../services/emailService');
const { sendMessage } = require('../services/whatsappService');

// @desc    Create new booking
// @route   POST /api/v1/bookings
// @access  Private (Renters)
exports.createBooking = async (req, res, next) => {
  try {
    req.body.renter = req.user.id;

    const apartment = await Apartment.findById(req.body.apartment).populate('manager');

    if (!apartment) {
      return res.status(404).json({ success: false, message: 'Apartment not found' });
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
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings
// @route   GET /api/v1/bookings
// @access  Private (Admin)
exports.getBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find().populate('apartment', 'location').populate('renter', 'name email');
        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get my bookings
// @route   GET /api/v1/bookings/mybookings
// @access  Private
exports.getMyBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ renter: req.user.id }).populate('apartment', 'location');
        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get single booking
// @route   GET /api/v1/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('apartment', 'location').populate('renter', 'name email');
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Make sure user is the renter or an admin
        if (booking.renter.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to view this booking' });
        }

        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
