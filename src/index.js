const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
const auth = require('./routes/auth');
const apartments = require('./routes/apartments');
const whatsapp = require('./routes/whatsapp');
const bookings = require('./routes/bookings');
const reviews = require('./routes/reviews');
const users = require('./routes/users');

app.use('/api/v1/auth', auth);
app.use('/api/v1/apartments', apartments);
app.use('/api/v1/whatsapp', whatsapp);
app.use('/api/v1/bookings', bookings);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/users', users);

// Define a simple route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
