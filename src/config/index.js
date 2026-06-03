const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

const optional = (name, fallback) => process.env[name] || fallback;

module.exports = {
  env: optional('NODE_ENV', 'development'),
  port: parseInt(optional('PORT', '5000'), 10),
  clientUrl: optional('CLIENT_URL', 'http://localhost:3000'),

  mongo: {
    uri: optional('MONGO_URI', ''),
  },

  jwt: {
    secret: optional('JWT_SECRET', ''),
    expire: optional('JWT_EXPIRE', '30d'),
    cookieExpire: parseInt(optional('JWT_COOKIE_EXPIRE', '30'), 10),
  },

  stripe: {
    secretKey: optional('STRIPE_SECRET_KEY', ''),
    webhookSecret: optional('STRIPE_WEBHOOK_SECRET', ''),
    publicKey: optional('STRIPE_PUBLIC_KEY', ''),
  },

  sendgrid: {
    apiKey: optional('SENDGRID_API_KEY', ''),
    fromEmail: optional('SENDGRID_FROM_EMAIL', 'noreply@example.com'),
  },

  twilio: {
    accountSid: optional('TWILIO_ACCOUNT_SID', ''),
    authToken: optional('TWILIO_AUTH_TOKEN', ''),
    whatsappFrom: optional('TWILIO_WHATSAPP_FROM_NUMBER', ''),
  },

  google: {
    clientId: optional('GOOGLE_CLIENT_ID', ''),
    clientSecret: optional('GOOGLE_CLIENT_SECRET', ''),
  },

  facebook: {
    appId: optional('FACEBOOK_APP_ID', ''),
    appSecret: optional('FACEBOOK_APP_SECRET', ''),
  },
};
