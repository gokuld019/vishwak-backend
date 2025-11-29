const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const {
  getPanoramasByProject,
  createPanorama,
} = require('../controllers/panoramaController');

router.get('/:projectId', getPanoramasByProject);
router.post('/', upload.single('image'), createPanorama);

module.exports = router;
