const twilio = require('twilio');
const Apartment = require('../models/Apartment');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const { MessagingResponse } = twilio.twiml;

/**
 * @desc    Handle incoming WhatsApp messages from Twilio
 * @route   POST /api/v1/whatsapp/webhook
 * @access  Public
 */
exports.handleIncomingMessage = asyncHandler(async (req, res, next) => {
  const twiml = new MessagingResponse();
  const incomingMsg = req.body.Body || '';
  const fromNumber = req.body.From.replace('whatsapp:', '');

  // Regex to find "yes" or "no" followed by an ID. Case-insensitive.
  const match = incomingMsg.match(/^(yes|no)\s+([a-f\d]{24})$/i);

  if (!match) {
    // If the message format is invalid, we can optionally reply.
    // For now, we'll just log it and send an empty response.
    console.log(`Invalid message format from ${fromNumber}: "${incomingMsg}"`);
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    return res.end(twiml.toString());
  }

  const availability = match[1].toLowerCase();
  const apartmentId = match[2];

  // Find the apartment
  const apartment = await Apartment.findById(apartmentId).populate('manager');

  if (!apartment) {
    console.log(`Apartment with ID ${apartmentId} not found.`);
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    return res.end(twiml.toString());
  }

  // Security Check: Ensure the message is from the apartment manager
  if (!apartment.manager || apartment.manager.phoneNumber !== fromNumber) {
    console.log(`Unauthorized attempt to update apartment ${apartmentId} from number ${fromNumber}.`);
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    return res.end(twiml.toString());
  }

  // Update status only on 'yes'
  if (availability === 'yes') {
    apartment.status = 'Available';
    await apartment.save();
    console.log(`Apartment ${apartmentId} status updated to Available.`);
    twiml.message('Thank you! The apartment status has been updated to "Available".');
  } else {
    // On 'no', we don't change the status. We can just acknowledge the reply.
    console.log(`Received 'No' for apartment ${apartmentId}. Status not changed.`);
    twiml.message('Thank you for your response.');
  }

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});
