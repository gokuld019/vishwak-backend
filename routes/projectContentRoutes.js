const express = require('express');
const router = express.Router();
const {
  getProjectContent,
  upsertProjectContent,
} = require('../controllers/projectContentController');

router.get('/:projectId', getProjectContent);
router.post('/', upsertProjectContent);

module.exports = router;
