const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  phoneNumber: {
    type: String,
    required: false, // Not all users need a phone number
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  profilePicture: {
    type: String,
  },
  password: {
    type: String,
    required: [
      function () {
        // If signing up with a social provider, a password is not required.
        return !this.googleId && !this.facebookId;
      },
      'Password is required for email registration.',
    ],
    minlength: 6,
    select: false,
  },
  googleId: {
    type: String,
  },
  facebookId: {
    type: String,
  },
  role: {
    type: String,
    enum: ['renter', 'owner', 'agent', 'admin'],
    default: 'renter',
  },
  kycStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model('User', UserSchema);
