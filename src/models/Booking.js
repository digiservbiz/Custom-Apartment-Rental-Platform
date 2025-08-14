const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  apartment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Apartment',
    required: true,
  },
  renter: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Booking', BookingSchema);
