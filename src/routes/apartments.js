const express = require('express');
const {
  getApartments,
  getApartment,
  createApartment,
  updateApartment,
  deleteApartment,
  checkAvailability,
  getMyApartments,
} = require('../controllers/apartmentController');

const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

// Re-route into other resource routers
const reviewRouter = require('./reviews');

router.use('/:apartmentId/reviews', reviewRouter);

router
  .route('/')
  .get(getApartments)
  .post(protect, authorize('owner', 'agent', 'admin'), createApartment);

router.route('/myapartments').get(protect, authorize('owner', 'agent', 'admin'), getMyApartments);

router
  .route('/:id')
  .get(getApartment)
  .put(protect, authorize('owner', 'agent', 'admin'), updateApartment)
  .delete(protect, authorize('owner', 'agent', 'admin'), deleteApartment);

router
    .route('/:id/check-availability')
    .post(protect, authorize('renter', 'admin'), checkAvailability);

module.exports = router;
