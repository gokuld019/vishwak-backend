const express = require('express');
const router = express.Router();
const {
  getFacilitiesByProject,
  createFacility,
} = require('../controllers/facilityController');

router.get('/:projectId', getFacilitiesByProject);
router.post('/', createFacility);

module.exports = router;
