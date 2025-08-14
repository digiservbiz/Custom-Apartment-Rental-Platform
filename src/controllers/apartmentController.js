const Apartment = require('../models/Apartment');
const User = require('../models/User');

// @desc    Get all apartments
// @route   GET /api/v1/apartments
// @access  Public
exports.getApartments = async (req, res, next) => {
  try {
    const apartments = await Apartment.find().populate('manager', 'name email');
    res.status(200).json({ success: true, count: apartments.length, data: apartments });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Check apartment availability
// @route   POST /api/v1/apartments/:id/check-availability
// @access  Private (Renters)
exports.checkAvailability = async (req, res, next) => {
  try {
    const apartment = await Apartment.findById(req.params.id).populate('manager');

    if (!apartment) {
      return res.status(404).json({ success: false, message: 'Apartment not found' });
    }

    if (!apartment.manager.phoneNumber) {
        return res.status(400).json({ success: false, message: 'Manager has no phone number' });
    }

    const message = `A renter is interested in your apartment ${apartment.location} (ID: ${apartment._id}). Is it available? Please reply with 'Yes ${apartment._id}' or 'No ${apartment._id}'.`;

    // In a real app, you would use a proper WhatsApp service
    const { sendMessage } = require('../services/whatsappService');
    await sendMessage(apartment.manager.phoneNumber, message);

    apartment.status = 'Pending Confirmation';
    await apartment.save();

    res.status(200).json({ success: true, data: 'Availability check initiated. Please wait for confirmation.' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get single apartment
// @route   GET /api/v1/apartments/:id
// @access  Public
exports.getApartment = async (req, res, next) => {
  try {
    const apartment = await Apartment.findById(req.params.id).populate('manager', 'name email');
    if (!apartment) {
      return res.status(404).json({ success: false, message: 'Apartment not found' });
    }
    res.status(200).json({ success: true, data: apartment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Create new apartment
// @route   POST /api/v1/apartments
// @access  Private (Owners, Agents)
exports.createApartment = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.manager = req.user.id;

    const apartment = await Apartment.create(req.body);
    res.status(201).json({ success: true, data: apartment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update apartment
// @route   PUT /api/v1/apartments/:id
// @access  Private (Owners, Agents)
exports.updateApartment = async (req, res, next) => {
  try {
    let apartment = await Apartment.findById(req.params.id);

    if (!apartment) {
      return res.status(404).json({ success: false, message: 'Apartment not found' });
    }

    // Make sure user is the apartment manager
    if (apartment.manager.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(401).json({ success: false, message: 'Not authorized to update this apartment' });
    }

    apartment = await Apartment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: apartment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete apartment
// @route   DELETE /api/v1/apartments/:id
// @access  Private (Owners, Agents)
exports.deleteApartment = async (req, res, next) => {
  try {
    const apartment = await Apartment.findById(req.params.id);

    if (!apartment) {
      return res.status(404).json({ success: false, message: 'Apartment not found' });
    }

    // Make sure user is the apartment manager
    if (apartment.manager.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(401).json({ success: false, message: 'Not authorized to delete this apartment' });
    }

    await apartment.deleteOne(); // Use deleteOne() instead of remove()

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
