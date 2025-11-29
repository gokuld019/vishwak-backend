const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const {
  getGalleryByProject,
  createGalleryImage,
  deleteGalleryImage,
} = require('../controllers/projectGalleryController');

router.get('/:projectId', getGalleryByProject);
router.post('/', upload.single('image'), createGalleryImage);
router.delete('/:id', deleteGalleryImage);

module.exports = router;
