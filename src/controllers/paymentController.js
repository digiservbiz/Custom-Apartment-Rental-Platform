const Stripe = require('stripe');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Booking = require('../models/Booking');
const { sendBookingConfirmation } = require('../services/emailService');
const { sendBookingConfirmationMessage } = require('../services/whatsappService');

// @desc    Create a Stripe payment intent
// @route   POST /api/v1/payments/create-payment-intent
// @access  Private
exports.createPaymentIntent = asyncHandler(async (req, res, next) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    return next(new ErrorResponse('Booking ID is required', 400));
  }

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return next(new ErrorResponse(`No booking found with the id of ${bookingId}`, 404));
  }

  if (booking.renter.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to pay for this booking', 403));
  }

  if (booking.status === 'Confirmed') {
    return next(new ErrorResponse('This booking is already paid', 400));
  }

  if (booking.status === 'Cancelled') {
    return next(new ErrorResponse('Cannot pay for a cancelled booking', 400));
  }

  if (!booking.totalPrice || booking.totalPrice <= 0) {
    return next(new ErrorResponse('Invalid booking amount', 400));
  }

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

    // Find the booking, populate owner and renter details, and update its status
    const booking = await Booking.findById(bookingId)
      .populate('renter', 'name email phoneNumber')
      .populate({
        path: 'apartment',
        select: 'location manager',
        populate: {
          path: 'manager',
          select: 'name email phoneNumber',
        },
      });

    if (booking) {
      booking.status = 'Confirmed';
      await booking.save();

      // Send notifications
      console.log('Sending notifications...');
      sendBookingConfirmation(booking); // Fire-and-forget email
      sendBookingConfirmationMessage(booking); // Fire-and-forget WhatsApp

    } else {
        console.error(`Webhook received for non-existent booking ID: ${bookingId}`);
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
});
