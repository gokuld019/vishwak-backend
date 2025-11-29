const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const uploadAmenity = require('../config/multerAmenity');

const {
  getAmenities,
  getAmenityById,
  createAmenity,
  updateAmenity,
  deleteAmenity,
} = require('../controllers/amenityController');

// PUBLIC
router.get('/', getAmenities);

// ADMIN AUTH REQUIRED
router.get('/:id', auth(), getAmenityById);

router.post(
  '/',
  auth(),
  uploadAmenity.single('icon'),
  createAmenity
);

router.put(
  '/:id',
  auth(),
  uploadAmenity.single('icon'),
  updateAmenity
);

router.delete('/:id', auth(), deleteAmenity);

module.exports = router;
