const Booking = require('../models/Booking');
const Apartment = require('../models/Apartment');
const Setting = require('../models/Setting');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

/**
 * @desc    Create new booking
 * @route   POST /api/v1/bookings
 * @access  Private (Renters)
 */
exports.createBooking = asyncHandler(async (req, res, next) => {
  const { apartment, checkInDate, checkOutDate } = req.body;

  // Validate required fields
  if (!apartment || !checkInDate || !checkOutDate) {
    return next(new ErrorResponse('Please provide apartment, checkInDate and checkOutDate', 400));
  }

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    return next(new ErrorResponse('Invalid date format', 400));
  }

  if (checkOut <= checkIn) {
    return next(new ErrorResponse('Check-out date must be after check-in date', 400));
  }

  if (checkIn < new Date()) {
    return next(new ErrorResponse('Check-in date cannot be in the past', 400));
  }

  // Verify apartment exists
  const apartmentDoc = await Apartment.findById(apartment);
  if (!apartmentDoc) {
    return next(new ErrorResponse(`Apartment not found with id of ${apartment}`, 404));
  }

  // Check for conflicting confirmed bookings
  const existingBooking = await Booking.findOne({
    apartment,
    status: 'Confirmed',
    $or: [
      { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } },
    ],
  });

  if (existingBooking) {
    return next(new ErrorResponse('Sorry, the apartment is already booked for the selected dates.', 400));
  }

  // Calculate total price with commission
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  const commissionSetting = await Setting.findOne({ key: 'commission_fee' });
  const commissionRate = commissionSetting ? parseFloat(commissionSetting.value) : 10;
  const totalPrice = parseFloat((nights * apartmentDoc.pricePerNight * (1 + commissionRate / 100)).toFixed(2));

  const booking = await Booking.create({
    apartment,
    checkInDate: checkIn,
    checkOutDate: checkOut,
    totalPrice,
    renter: req.user.id,
    status: 'Pending',
  });

  res.status(201).json({ success: true, data: booking });
});

/**
 * @desc    Get all bookings
 * @route   GET /api/v1/bookings
 * @access  Private (Admin)
 */
exports.getBookings = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const total = await Booking.countDocuments();
    const bookings = await Booking.find()
      .populate('apartment', 'location pricePerNight')
      .populate('renter', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({ success: true, count: bookings.length, total, page, data: bookings });
});

/**
 * @desc    Get my bookings
 * @route   GET /api/v1/bookings/mybookings
 * @access  Private
 */
exports.getMyBookings = asyncHandler(async (req, res, next) => {
    const bookings = await Booking.find({ renter: req.user.id })
      .populate('apartment', 'location pricePerNight photos description')
      .sort({ createdAt: -1 });
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
