const express = require('express');
const passport = require('passport');
const {
  register,
  login,
  getMe,
  googleCallback,
  facebookCallback,
} = require('../controllers/authController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// --- Social Login Routes ---

// @desc    Authenticate with Google
// @route   GET /api/v1/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google auth callback
// @route   GET /api/v1/auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleCallback
);

// @desc    Authenticate with Facebook
// @route   GET /api/v1/auth/facebook
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// @desc    Facebook auth callback
// @route   GET /api/v1/auth/facebook/callback
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: '/login' }),
  facebookCallback
);

module.exports = router;
