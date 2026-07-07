const User = require('../models/User');
const Apartment = require('../models/Apartment');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const asyncHandler = require('../middleware/async');

// @desc    Get platform statistics
// @route   GET /api/v1/admin/stats
// @access  Private (Admin)
exports.getStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalApartments,
    totalBookings,
    pendingKyc,
    pendingReviews,
    revenueResult,
  ] = await Promise.all([
    User.countDocuments(),
    Apartment.countDocuments(),
    Booking.countDocuments(),
    User.countDocuments({ role: { $in: ['owner', 'agent'] }, kycStatus: 'pending' }),
    Review.countDocuments({ status: 'Pending' }),
    Booking.aggregate([
      { $match: { status: 'Confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
  ]);

  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalApartments,
      totalBookings,
      pendingKyc,
      pendingReviews,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    },
  });
});
