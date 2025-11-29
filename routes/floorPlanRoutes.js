const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const {
  getFloorPlansByProject,
  createFloorPlan,
  updateFloorPlan,
  deleteFloorPlan,
} = require('../controllers/floorPlanController');

// Public – frontend
router.get('/:projectId', getFloorPlansByProject);

// Admin – CMS
router.post('/', upload.single('image'), createFloorPlan);
router.put('/:id', upload.single('image'), updateFloorPlan);
router.delete('/:id', deleteFloorPlan);

module.exports = router;
