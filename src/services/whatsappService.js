const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_FROM_NUMBER;

const client = twilio(accountSid, authToken);

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

  try {
    await Promise.all(messagesToSend.map(message => client.messages.create(message)));
    console.log('Booking confirmation WhatsApp messages sent successfully.');
  } catch (error) {
    console.error('Error sending booking confirmation WhatsApp messages:', error);
  }
};

const sendAvailabilityCheck = async (phoneNumber, message) => {
  try {
    await client.messages.create({
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
