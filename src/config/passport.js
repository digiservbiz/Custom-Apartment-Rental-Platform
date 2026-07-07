const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('./index');
const User = require('../models/User');

// Finds or creates a user for a social login profile. Rejects the login if the
// email is already registered with a password, to avoid silently linking accounts.
const findOrCreateSocialUser = async (providerField, profile, done) => {
  const email = profile.emails[0].value;

  try {
    let user = await User.findOne({ [providerField]: profile.id });
    if (user) {
      return done(null, user);
    }

    user = await User.findOne({ email });
    if (user) {
      return done(
        new Error('An account with this email already exists. Please log in with your password to link your account.'),
        false
      );
    }

    user = await User.create({
      [providerField]: profile.id,
      name: profile.displayName,
      email,
      // The provider already verified this email address
      isEmailVerified: true,
    });
    return done(null, user);
  } catch (err) {
    console.error(err);
    return done(err, false);
  }
};

// This function will be exported and called from our main server file
module.exports = function (passport) {
  // Strategies are only registered when credentials are configured, so the
  // app can boot without OAuth keys (social login is simply unavailable).
  if (config.google.clientId && config.google.clientSecret) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: config.google.clientId,
          clientSecret: config.google.clientSecret,
          callbackURL: '/api/v1/auth/google/callback', // The URI Google will redirect to after user consent
        },
        (accessToken, refreshToken, profile, done) =>
          findOrCreateSocialUser('googleId', profile, done)
      )
    );
  } else {
    console.warn('Google OAuth credentials not configured. Google login is disabled.');
  }

  if (config.facebook.appId && config.facebook.appSecret) {
    passport.use(
      new FacebookStrategy(
        {
          clientID: config.facebook.appId,
          clientSecret: config.facebook.appSecret,
          callbackURL: '/api/v1/auth/facebook/callback',
          profileFields: ['id', 'displayName', 'emails'], // Fields to request from Facebook
        },
        (accessToken, refreshToken, profile, done) =>
          findOrCreateSocialUser('facebookId', profile, done)
      )
    );
  } else {
    console.warn('Facebook OAuth credentials not configured. Facebook login is disabled.');
  }

  // These functions are needed for session-based authentication, but since we are
  // using JWTs, Passport sessions are not strictly necessary. However, they are
  // good practice to include.
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
