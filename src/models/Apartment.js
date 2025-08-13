const mongoose = require('mongoose');

const ApartmentSchema = new mongoose.Schema({
  location: {
    type: String,
    required: [true, 'Please add a location'],
  },
  photos: {
    type: [String],
    required: true,
  },
  pricePerNight: {
    type: Number,
    required: [true, 'Please add a price per night'],
  },
  maxGuests: {
    type: Number,
    required: [true, 'Please add the maximum number of guests'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  manager: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['Available', 'Rented', 'Pending Confirmation'],
    default: 'Available',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Apartment', ApartmentSchema);
