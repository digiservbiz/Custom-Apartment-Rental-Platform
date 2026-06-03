const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

// This function will be exported and called from our main server file
module.exports = function (passport) {
  // Google Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/v1/auth/google/callback', // The URI Google will redirect to after user consent
      },
      async (accessToken, refreshToken, profile, done) => {
        // This is the verification callback function that runs after Google auth
        const newUser = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        };

        try {
          // Check if user already exists in our DB with this Google ID
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            // If user exists, pass them to the next middleware
            return done(null, user);
          } else {
            // If not, check if a user exists with the same email
            user = await User.findOne({ email: profile.emails[0].value });
            if (user) {
              // A user with this email already exists (likely signed up with email/password).
              // For simplicity, we'll return an error. A more advanced implementation
              // could link the accounts here.
              return done(new Error('An account with this email already exists. Please log in with your password to link your account.'), false);
            }
            // If no user exists, create a new one
            user = await User.create(newUser);
            return done(null, user);
          }
        } catch (err) {
          console.error(err);
          return done(err, false);
        }
      }
    )
  );

  // Facebook Strategy (similar logic to Google)
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: '/api/v1/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'emails'], // Fields to request from Facebook
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          facebookId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        };

        try {
          let user = await User.findOne({ facebookId: profile.id });

          if (user) {
            return done(null, user);
          } else {
            user = await User.findOne({ email: profile.emails[0].value });
            if (user) {
                return done(new Error('An account with this email already exists. Please log in with your password to link your account.'), false);
            }
            user = await User.create(newUser);
            return done(null, user);
          }
        } catch (err) {
          console.error(err);
          return done(err, false);
        }
      }
    )
  );

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
