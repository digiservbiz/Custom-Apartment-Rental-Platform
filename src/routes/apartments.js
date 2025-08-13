const express = require('express');
const {
  getApartments,
  getApartment,
  createApartment,
  updateApartment,
  deleteApartment,
} = require('../controllers/apartmentController');

const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getApartments)
  .post(protect, authorize('owner', 'agent', 'admin'), createApartment);

router
  .route('/:id')
  .get(getApartment)
  .put(protect, authorize('owner', 'agent', 'admin'), updateApartment)
  .delete(protect, authorize('owner', 'agent', 'admin'), deleteApartment);

module.exports = router;
