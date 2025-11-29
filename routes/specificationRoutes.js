const express = require('express');
const router = express.Router();
const {
  getSpecificationsByProject,
  createSpecification,
  updateSpecification,
  deleteSpecification,
} = require('../controllers/specificationController');

router.get('/:projectId', getSpecificationsByProject);
router.post('/', createSpecification);
router.put('/:id', updateSpecification);
router.delete('/:id', deleteSpecification);

module.exports = router;
