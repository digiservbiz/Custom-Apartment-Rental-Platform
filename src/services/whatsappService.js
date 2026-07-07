const twilio = require('twilio');
const config = require('../config');

const fromNumber = config.twilio.whatsappFrom;

// Lazily create the Twilio client so a missing/invalid TWILIO_ACCOUNT_SID
// degrades WhatsApp notifications instead of crashing the app at startup.
let client = null;
const getClient = () => {
  if (client) return client;
  const { accountSid, authToken } = config.twilio;
  if (!accountSid || !authToken) {
    console.warn('Twilio credentials not configured. WhatsApp notifications are disabled.');
    return null;
  }
  client = twilio(accountSid, authToken);
  return client;
};

/**
 * Sends a booking confirmation message via WhatsApp to the renter and the owner.
 * @param {object} booking - The booking object, populated with renter and apartment.manager details.
 */
const sendBookingConfirmationMessage = async (booking) => {
  if (!booking || !booking.renter || !booking.apartment || !booking.apartment.manager) {
    console.error('Invalid booking object passed to sendBookingConfirmationMessage.');
    return;
  }

  const { renter, apartment, checkInDate } = booking;
  const owner = apartment.manager;
  const formatDate = (date) => new Date(date).toLocaleDateString();

  const messagesToSend = [];

  // Prepare message for the Renter
  if (renter.phoneNumber) {
    messagesToSend.push({
      body: `Hi ${renter.name}, your booking for ${apartment.location} starting on ${formatDate(checkInDate)} is confirmed.`,
      from: fromNumber,
      to: `whatsapp:${renter.phoneNumber}`,
    });
  } else {
    console.log(`Renter ${renter.name} does not have a phone number. Skipping WhatsApp notification.`);
  }

  // Prepare message for the Owner/Manager
  if (owner.phoneNumber) {
    messagesToSend.push({
      body: `New booking for ${apartment.location} from renter ${renter.name}, starting ${formatDate(checkInDate)}.`,
      from: fromNumber,
      to: `whatsapp:${owner.phoneNumber}`,
    });
  } else {
    console.log(`Owner ${owner.name} does not have a phone number. Skipping WhatsApp notification.`);
  }

  if (messagesToSend.length === 0) {
    console.log('No phone numbers provided for WhatsApp notifications.');
    return;
  }

  const twilioClient = getClient();
  if (!twilioClient) return;

  try {
    await Promise.all(messagesToSend.map(message => twilioClient.messages.create(message)));
    console.log('Booking confirmation WhatsApp messages sent successfully.');
  } catch (error) {
    console.error('Error sending booking confirmation WhatsApp messages:', error);
  }
};

const sendAvailabilityCheck = async (phoneNumber, message) => {
  const twilioClient = getClient();
  if (!twilioClient) return;

  try {
    await twilioClient.messages.create({
      body: message,
      from: fromNumber,
      to: `whatsapp:${phoneNumber}`,
    });
    console.log(`Availability check sent successfully to ${phoneNumber}.`);
  } catch (error) {
    console.error('Error sending availability check message:', error);
  }
};

module.exports = {
  sendBookingConfirmationMessage,
  sendAvailabilityCheck,
};
