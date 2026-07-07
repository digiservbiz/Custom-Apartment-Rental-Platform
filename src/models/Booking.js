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
    required: [true, 'Check-in date is required'],
  },
  checkOutDate: {
    type: Date,
    required: [true, 'Check-out date is required'],
    validate: {
      validator: function (value) {
        return value > this.checkInDate;
      },
      message: 'Check-out date must be after check-in date',
    },
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0.01, 'Total price must be greater than 0'],
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
