const sgMail = require('@sendgrid/mail');

// Set the API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Sends a booking confirmation email to both the renter and the owner.
 * @param {object} booking - The booking object, populated with renter and apartment.manager details.
 */
const sendBookingConfirmation = async (booking) => {
  if (!booking || !booking.renter || !booking.apartment || !booking.apartment.manager) {
    console.error('Invalid booking object passed to sendBookingConfirmation.');
    return;
  }

  const { renter, apartment, checkInDate, checkOutDate, totalPrice } = booking;
  const owner = apartment.manager;

  const formatDate = (date) => new Date(date).toLocaleDateString();

  // Email to the Renter
  const renterMsg = {
    to: renter.email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: `Your Booking is Confirmed for ${apartment.location}!`,
    html: `
      <h1>Booking Confirmation</h1>
      <p>Hi ${renter.name},</p>
      <p>Your booking for the apartment at <strong>${apartment.location}</strong> is confirmed.</p>
      <h3>Details:</h3>
      <ul>
        <li>Check-in: ${formatDate(checkInDate)}</li>
        <li>Check-out: ${formatDate(checkOutDate)}</li>
        <li>Total Price: $${totalPrice}</li>
      </ul>
      <p>Thank you for booking with us!</p>
    `,
  };

  // Email to the Owner/Manager
  const ownerMsg = {
    to: owner.email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: `New Booking for your apartment at ${apartment.location}`,
    html: `
      <h1>New Booking Notification</h1>
      <p>Hi ${owner.name},</p>
      <p>You have a new booking for your apartment at <strong>${apartment.location}</strong>.</p>
      <h3>Details:</h3>
      <ul>
        <li>Renter: ${renter.name} (${renter.email})</li>
        <li>Check-in: ${formatDate(checkInDate)}</li>
        <li>Check-out: ${formatDate(checkOutDate)}</li>
        <li>Total Price: $${totalPrice}</li>
      </ul>
    `,
  };

  try {
    await sgMail.send([renterMsg, ownerMsg]);
    console.log('Booking confirmation emails sent successfully.');
  } catch (error) {
    console.error('Error sending booking confirmation emails:', error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
};

module.exports = {
  sendBookingConfirmation,
};
