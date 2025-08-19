const Stripe = require('stripe');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Booking = require('../models/Booking');

// @desc    Create a Stripe payment intent
// @route   POST /api/v1/payments/create-payment-intent
// @access  Private
exports.createPaymentIntent = asyncHandler(async (req, res, next) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    return next(new ErrorResponse('Booking ID is required', 400));
  }

  // Find the booking to get the total price
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return next(new ErrorResponse(`No booking found with the id of ${bookingId}`, 404));
  }

  // Ensure the user trying to pay is the one who made the booking
  if (booking.renter.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to pay for this booking', 401));
  }

  // Initialize Stripe
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: booking.totalPrice * 100, // Amount in cents
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
        bookingId: booking._id.toString(),
    }
  });

  res.status(200).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });
});

// @desc    Stripe webhook handler
// @route   POST /api/v1/payments/stripe-webhook
// @access  Public
exports.stripeWebhook = asyncHandler(async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const signature = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
  } catch (err) {
    console.log(`Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const bookingId = paymentIntent.metadata.bookingId;

    console.log(`PaymentIntent for booking ${bookingId} was successful!`);

    // Find the booking and update its status
    const booking = await Booking.findById(bookingId);
    if (booking) {
      booking.status = 'Confirmed';
      await booking.save();

      // Here you might also want to update the apartment's availability,
      // send a confirmation email, etc. For now, we just update the booking.
    } else {
        console.error(`Webhook received for non-existent booking ID: ${bookingId}`);
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
});
