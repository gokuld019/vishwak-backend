const express = require('express');
const router = express.Router();
const {
  getAmenitiesByProject,
  createAmenity,
  updateAmenity,
  deleteAmenity,
} = require('../controllers/projectAmenityController');

// Public
router.get('/:projectId', getAmenitiesByProject);

// Admin
router.post('/', createAmenity);
router.put('/:id', updateAmenity);
router.delete('/:id', deleteAmenity);

module.exports = router;
