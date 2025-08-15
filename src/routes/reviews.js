const express = require('express');
const {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/authMiddleware');

router
  .route('/')
  .post(protect, authorize('renter', 'admin'), createReview)
  .get(getReviews);

router
    .route('/:id')
    .get(getReview)
    .put(protect, authorize('admin'), updateReview)
    .delete(protect, authorize('admin'), deleteReview);

module.exports = router;
