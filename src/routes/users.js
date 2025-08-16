const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserStatus,
} = require('../controllers/userController');

const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

// All these routes are admin only
router.use(protect);
router.use(authorize('admin'));

router.route('/').get(getUsers);

router
    .route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

router.route('/:id/updatestatus').put(updateUserStatus);

module.exports = router;
