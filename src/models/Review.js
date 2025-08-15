const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
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
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please add a rating between 1 and 5'],
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment'],
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Review', ReviewSchema);
