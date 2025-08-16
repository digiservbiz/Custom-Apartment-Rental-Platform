const Review = require('../models/Review');
const Booking = require('../models/Booking');
const { sendEmail } = require('../services/emailService');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

/**
 * @desc    Create new review
 * @route   POST /api/v1/reviews
 * @access  Private (Renters who have booked the apartment)
 */
exports.createReview = asyncHandler(async (req, res, next) => {
    req.body.renter = req.user.id;

    // Check if the user has a completed booking for this apartment
    const booking = await Booking.findOne({
      apartment: req.body.apartment,
      renter: req.user.id,
      status: 'Confirmed', // Or whatever status means a completed stay
    });

    if (!booking) {
      return next(new ErrorResponse('You can only review apartments you have stayed at.', 401));
    }

    const review = await Review.create(req.body);

    // Send notification to admin
    // In a real app, you would have a way to get the admin's email
    await sendEmail('admin@example.com', 'New Review Submitted', `A new review has been submitted for apartment ${req.body.apartment}.`);

    res.status(201).json({ success: true, data: review });
});

/**
 * @desc    Get all reviews
 * @route   GET /api/v1/reviews
 * @route   GET /api/v1/apartments/:apartmentId/reviews
 * @access  Public
 */
exports.getReviews = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.apartmentId) {
        query = Review.find({ apartment: req.params.apartmentId, status: 'Approved' });
    } else {
        // If admin, get all reviews, otherwise only approved ones
        if (req.user && req.user.role === 'admin') {
            query = Review.find();
        } else {
            query = Review.find({ status: 'Approved' });
        }
    }

    const reviews = await query.populate('renter', 'name').populate('apartment', 'location');
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
});

/**
 * @desc    Get single review
 * @route   GET /api/v1/reviews/:id
 * @access  Public
 */
exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate('renter', 'name');
    if (!review) {
        return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: review });
});

/**
 * @desc    Update review (for moderation)
 * @route   PUT /api/v1/reviews/:id
 * @access  Private (Admin)
 */
exports.updateReview = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.id).populate('renter');

    if (!review) {
        return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
    }

    // Only admin can update the status
    if (req.user.role !== 'admin') {
        return next(new ErrorResponse('Not authorized to update this review', 401));
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    // Send notification to renter
    const renter = review.renter;
    const message = `Your review for apartment ${review.apartment} has been ${review.status}.`;
    await sendEmail(renter.email, 'Review Status Update', message);

    res.status(200).json({ success: true, data: review });
});

/**
 * @desc    Delete review
 * @route   DELETE /api/v1/reviews/:id
 * @access  Private (Admin)
 */
exports.deleteReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
    }

    // Only admin can delete
    if (req.user.role !== 'admin') {
        return next(new ErrorResponse('Not authorized to delete this review', 401));
    }

    await review.deleteOne();

    res.status(200).json({ success: true, data: {} });
});
