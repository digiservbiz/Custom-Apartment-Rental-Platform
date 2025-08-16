const Review = require('../models/Review');
const Booking = require('../models/Booking');

// @desc    Create new review
// @route   POST /api/v1/reviews
// @access  Private (Renters who have booked the apartment)
exports.createReview = async (req, res, next) => {
  try {
    req.body.renter = req.user.id;

    // Check if the user has a completed booking for this apartment
    const booking = await Booking.findOne({
      apartment: req.body.apartment,
      renter: req.user.id,
      status: 'Confirmed', // Or whatever status means a completed stay
    });

    if (!booking) {
      return res.status(401).json({ success: false, message: 'You can only review apartments you have stayed at.' });
    }

    const review = await Review.create(req.body);

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/apartments/:apartmentId/reviews
// @access  Public
exports.getReviews = async (req, res, next) => {
    try {
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
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get single review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id).populate('renter', 'name');
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        res.status(200).json({ success: true, data: review });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update review (for moderation)
// @route   PUT /api/v1/reviews/:id
// @access  Private (Admin)
exports.updateReview = async (req, res, next) => {
    try {
        let review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        // Only admin can update the status
        if (req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to update this review' });
        }

        review = await Review.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ success: true, data: review });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
// @access  Private (Admin)
exports.deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        // Only admin can delete
        if (req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this review' });
        }

        await review.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
