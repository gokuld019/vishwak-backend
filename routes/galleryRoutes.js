const express = require("express");
const router = express.Router();
const upload = require("../middlewares/galleryUpload");

const {
  addGalleryImages,
  getGallery,
  deleteGalleryImage,
} = require("../controllers/galleryController");

// POST multiple images
router.post("/", upload.array("images", 20), addGalleryImages);

// GET by projectId
router.get("/:projectId", getGallery);

// DELETE single image
router.delete("/:id", deleteGalleryImage);

module.exports = router;
