const mongoose = require('mongoose');
const geocoder = require('../utils/geocoder');

const ApartmentSchema = new mongoose.Schema({
  address: {
    type: String,
    required: [true, 'Please add an address'],
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
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
  amenities: {
    type: [String],
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

// Geocode & create location field
ApartmentSchema.pre('save', async function (next) {
  // Only run if address is modified
  if (!this.isModified('address')) {
    next();
  }

  const loc = await geocoder.geocode(this.address);
  if (loc.length > 0) {
    this.location = {
      type: 'Point',
      coordinates: [loc[0].longitude, loc[0].latitude],
      formattedAddress: loc[0].formattedAddress,
      street: loc[0].streetName,
      city: loc[0].city,
      state: loc[0].stateCode,
      zipcode: loc[0].zipcode,
      country: loc[0].countryCode,
    };
  } else {
    // Do not save address if not found
    // In a real app, you'd want better error handling here
    this.location = undefined;
  }
  next();
});


module.exports = mongoose.model('Apartment', ApartmentSchema);
