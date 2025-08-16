const Apartment = require('../models/Apartment');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

/**
 * @desc    Handle incoming WhatsApp messages
 * @route   POST /api/v1/whatsapp/webhook
 * @access  Public (webhook from WhatsApp)
 */
exports.handleIncomingMessage = asyncHandler(async (req, res, next) => {
    const { from, message } = req.body; // Assuming the webhook sends from and message

    // Parse the message
    const parts = message.trim().split(' ');
    if (parts.length !== 2) {
      return next(new ErrorResponse('Invalid message format', 400));
    }

    const availability = parts[0].toLowerCase();
    const apartmentId = parts[1];

    if (availability !== 'yes' && availability !== 'no') {
      return next(new ErrorResponse('Invalid availability status', 400));
    }

    const apartment = await Apartment.findById(apartmentId);

    if (!apartment) {
      return next(new ErrorResponse('Apartment not found', 404));
    }

    if (availability === 'yes') {
      apartment.status = 'Available';
    } else {
      apartment.status = 'Rented'; // Or maybe 'Unavailable'
    }

    await apartment.save();

    res.status(200).json({ success: true, data: 'Apartment status updated' });
});
