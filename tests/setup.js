// Set dummy env vars for tests to prevent errors during initialization
process.env.JWT_SECRET = 'test_secret';
process.env.JWT_EXPIRE = '10m';
process.env.JWT_COOKIE_EXPIRE = '30';

// External Services
process.env.SENDGRID_API_KEY = 'SG.dummy_key';
process.env.TWILIO_ACCOUNT_SID = 'AC' + 'a'.repeat(32);
process.env.TWILIO_AUTH_TOKEN = 'dummy_token';
process.env.TWILIO_WHATSAPP_FROM_NUMBER = 'whatsapp:+15555555555';

// Social Logins
process.env.GOOGLE_CLIENT_ID = 'dummy_google_id';
process.env.GOOGLE_CLIENT_SECRET = 'dummy_google_secret';
process.env.FACEBOOK_APP_ID = 'dummy_fb_id';
process.env.FACEBOOK_APP_SECRET = 'dummy_fb_secret';
process.env.CLIENT_URL = 'http://localhost:3000';


const dbHandler = require('./db-handler');

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await dbHandler.connect());

/**
 * Clear all test data after every test.
 */
beforeEach(async () => await dbHandler.clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => await dbHandler.closeDatabase());
