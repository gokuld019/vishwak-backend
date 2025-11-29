const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const {
  getLocationMapByProject,
  upsertLocationMap,
} = require('../controllers/locationMapController');

router.get('/:projectId', getLocationMapByProject);
router.post('/', upload.single('mapImage'), upsertLocationMap);

module.exports = router;
