const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database if not in test environment
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const { stripeWebhook } = require('./controllers/paymentController');

const app = express();

// Stripe webhook
// Note: This route must be defined before express.json() to ensure we get the raw request body.
app.post(
  '/api/v1/payments/stripe-webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

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

app.use('/api/v1/auth', auth);
app.use('/api/v1/apartments', apartments);
app.use('/api/v1/whatsapp', whatsapp);
app.use('/api/v1/bookings', bookings);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/users', users);
app.use('/api/v1/payments', payments);

const errorHandler = require('./middleware/error');
app.use(errorHandler);

// Define a simple route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

module.exports = app;
