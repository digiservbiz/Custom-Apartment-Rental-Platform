const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database if not in test environment
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const { stripeWebhook } = require('./controllers/paymentController');

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
const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL]
  : ['http://localhost:3000'];

app.use(cors({ origin: allowedOrigins, credentials: true }));

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

// Mount routers
const auth = require('./routes/auth');
const apartments = require('./routes/apartments');
const whatsapp = require('./routes/whatsapp');
const bookings = require('./routes/bookings');
const reviews = require('./routes/reviews');
const users = require('./routes/users');
const payments = require('./routes/payments');
const settings = require('./routes/settings');
const admin = require('./routes/admin');

app.use('/api/v1/auth', authLimiter, auth);
app.use('/api/v1/apartments', apartments);
app.use('/api/v1/whatsapp', whatsapp);
app.use('/api/v1/bookings', bookings);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/users', users);
app.use('/api/v1/payments', payments);
app.use('/api/v1/settings', settings);
app.use('/api/v1/admin', admin);

const errorHandler = require('./middleware/error');
app.use(errorHandler);

// Define a simple route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

module.exports = app;
