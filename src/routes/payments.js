const express = require('express');
const {
  createPaymentIntent,
  stripeWebhook,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/v1/payments/create-payment-intent
// @desc    Create a stripe payment intent
// @access  Private
router.post('/create-payment-intent', protect, createPaymentIntent);


module.exports = router;
