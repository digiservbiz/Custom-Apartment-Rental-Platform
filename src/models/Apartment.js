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
    min: [1, 'Price per night must be at least $1'],
  },
  maxGuests: {
    type: Number,
    required: [true, 'Please add the maximum number of guests'],
    min: [1, 'Maximum guests must be at least 1'],
    validate: {
      validator: Number.isInteger,
      message: 'Maximum guests must be a whole number',
    },
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
  latitude: {
    type: Number,
    min: [-90, 'Latitude must be between -90 and 90'],
    max: [90, 'Latitude must be between -90 and 90'],
  },
  longitude: {
    type: Number,
    min: [-180, 'Longitude must be between -180 and 180'],
    max: [180, 'Longitude must be between -180 and 180'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Apartment', ApartmentSchema);
