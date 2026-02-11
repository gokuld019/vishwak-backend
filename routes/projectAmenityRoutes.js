const express = require("express");
const router = express.Router();
const upload = require("../middlewares/projectAmenityUpload");

const {
  addAllAmenities,
  getAmenitiesByProject,
  updateAmenity,
  deleteAmenity,
} = require("../controllers/projectamenityController");

// CREATE (text + image amenities)
router.post("/", upload.fields([{ name: "galleryImages" }]), addAllAmenities);

// READ (fetch by project id)
router.get("/:projectId", getAmenitiesByProject);

// UPDATE (single amenity)
router.put(
  "/update/:id",
  upload.single("image"),
  updateAmenity
);

// DELETE
router.delete("/:id", deleteAmenity);

module.exports = router;
