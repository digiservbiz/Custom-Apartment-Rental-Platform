const Stripe = require('stripe');
const config = require('../config');

// Single shared Stripe client, created on first use.
let stripe = null;
const getStripe = () => {
  if (!stripe) {
    stripe = new Stripe(config.stripe.secretKey);
  }
  return stripe;
};

module.exports = {
  getStripe,
};
