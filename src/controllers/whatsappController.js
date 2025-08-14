const Apartment = require('../models/Apartment');

// @desc    Handle incoming WhatsApp messages
// @route   POST /api/v1/whatsapp/webhook
// @access  Public (webhook from WhatsApp)
exports.handleIncomingMessage = async (req, res, next) => {
  try {
    const { from, message } = req.body; // Assuming the webhook sends from and message

    // Parse the message
    const parts = message.trim().split(' ');
    if (parts.length !== 2) {
      return res.status(400).json({ success: false, message: 'Invalid message format' });
    }

    const availability = parts[0].toLowerCase();
    const apartmentId = parts[1];

    if (availability !== 'yes' && availability !== 'no') {
      return res.status(400).json({ success: false, message: 'Invalid availability status' });
    }

    const apartment = await Apartment.findById(apartmentId);

    if (!apartment) {
      return res.status(404).json({ success: false, message: 'Apartment not found' });
    }

    if (availability === 'yes') {
      apartment.status = 'Available';
    } else {
      apartment.status = 'Rented'; // Or maybe 'Unavailable'
    }

    await apartment.save();

    res.status(200).json({ success: true, data: 'Apartment status updated' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
