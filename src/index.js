const express = require('express');
const cors = require('cors');
const passport = require('passport');
const rateLimit = require('express-rate-limit');
const config = require('./config');

const { stripeWebhook } = require('./controllers/paymentController');
const errorHandler = require('./middleware/error');

const app = express();

// Stripe webhook must be before body parser to get raw body
app.post(
  '/api/v1/payments/stripe-webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

// Body parser with size limit
app.use(express.json({ limit: '10kb' }));

// Enable CORS
app.use(cors({ origin: [config.clientUrl], credentials: true }));

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success: false, error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Passport Config
require('./config/passport')(passport);

// Passport Middleware
app.use(passport.initialize());

// Health check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Mount routers
app.use('/api/v1/auth', authLimiter, require('./routes/auth'));
app.use('/api/v1/apartments', require('./routes/apartments'));
app.use('/api/v1/whatsapp', require('./routes/whatsapp'));
app.use('/api/v1/bookings', require('./routes/bookings'));
app.use('/api/v1/reviews', require('./routes/reviews'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/payments', require('./routes/payments'));
app.use('/api/v1/settings', require('./routes/settings'));
app.use('/api/v1/admin', require('./routes/admin'));
app.use('/api/v1/uploads', require('./routes/uploads'));

// Error handler must be mounted after all routes
app.use(errorHandler);

module.exports = app;
