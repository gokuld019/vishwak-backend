const express = require('express');
const router = express.Router();
const {
  getUpdatesByProject,
  createUpdate,
  updateUpdate,
  deleteUpdate,
} = require('../controllers/constructionUpdateController');

router.get('/:projectId', getUpdatesByProject);
router.post('/', createUpdate);
router.put('/:id', updateUpdate);
router.delete('/:id', deleteUpdate);

module.exports = router;
