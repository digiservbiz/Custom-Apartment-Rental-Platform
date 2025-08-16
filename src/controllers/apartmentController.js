const Apartment = require('../models/Apartment');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

/**
 * @desc    Get all apartments
 * @route   GET /api/v1/apartments
 * @access  Public
 */
exports.getApartments = asyncHandler(async (req, res, next) => {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'keyword'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = Apartment.find(JSON.parse(queryStr));

    // Keyword search
    if (req.query.keyword) {
        query = query.find({ location: { $regex: req.query.keyword, $options: 'i' } });
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Apartment.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    const apartments = await query.populate('manager', 'name email');

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }

    res.status(200).json({ success: true, count: apartments.length, pagination, data: apartments });
});

/**
 * @desc    Get single apartment
 * @route   GET /api/v1/apartments/:id
 * @access  Public
 */
exports.getApartment = asyncHandler(async (req, res, next) => {
    const apartment = await Apartment.findById(req.params.id).populate('manager', 'name email');
    if (!apartment) {
      return next(new ErrorResponse(`Apartment not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: apartment });
});

/**
 * @desc    Create new apartment
 * @route   POST /api/v1/apartments
 * @access  Private (Owners, Agents)
 */
exports.createApartment = asyncHandler(async (req, res, next) => {
    // Add user to req.body
    req.body.manager = req.user.id;

    const apartment = await Apartment.create(req.body);
    res.status(201).json({ success: true, data: apartment });
});

/**
 * @desc    Update apartment
 * @route   PUT /api/v1/apartments/:id
 * @access  Private (Owners, Agents)
 */
exports.updateApartment = asyncHandler(async (req, res, next) => {
    let apartment = await Apartment.findById(req.params.id);

    if (!apartment) {
        return next(new ErrorResponse(`Apartment not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is the apartment manager
    if (apartment.manager.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this apartment`, 401));
    }

    apartment = await Apartment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: apartment });
});

/**
 * @desc    Delete apartment
 * @route   DELETE /api/v1/apartments/:id
 * @access  Private (Owners, Agents)
 */
exports.deleteApartment = asyncHandler(async (req, res, next) => {
    const apartment = await Apartment.findById(req.params.id);

    if (!apartment) {
        return next(new ErrorResponse(`Apartment not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is the apartment manager
    if (apartment.manager.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this apartment`, 401));
    }

    await apartment.deleteOne();

    res.status(200).json({ success: true, data: {} });
});

/**
 * @desc    Check apartment availability
 * @route   POST /api/v1/apartments/:id/check-availability
 * @access  Private (Renters)
 */
exports.checkAvailability = asyncHandler(async (req, res, next) => {
    const apartment = await Apartment.findById(req.params.id).populate('manager');

    if (!apartment) {
        return next(new ErrorResponse(`Apartment not found with id of ${req.params.id}`, 404));
    }

    if (!apartment.manager.phoneNumber) {
        return next(new ErrorResponse('Manager has no phone number', 400));
    }

    const message = `A renter is interested in your apartment ${apartment.location} (ID: ${apartment._id}). Is it available? Please reply with 'Yes ${apartment._id}' or 'No ${apartment._id}'.`;

    // In a real app, you would use a proper WhatsApp service
    const { sendMessage } = require('../services/whatsappService');
    await sendMessage(apartment.manager.phoneNumber, message);

    apartment.status = 'Pending Confirmation';
    await apartment.save();

    res.status(200).json({ success: true, data: 'Availability check initiated. Please wait for confirmation.' });
});

/**
 * @desc    Get my apartments
 * @route   GET /api/v1/apartments/myapartments
 * @access  Private (Owners, Agents)
 */
exports.getMyApartments = asyncHandler(async (req, res, next) => {
    const apartments = await Apartment.find({ manager: req.user.id });
    res.status(200).json({ success: true, count: apartments.length, data: apartments });
});
