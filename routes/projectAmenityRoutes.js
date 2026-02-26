const express = require("express");
const router = express.Router();

const {
  addAmenity,
  getAmenitiesByProject,
  updateAmenity,
  deleteAmenity,
} = require("../controllers/projectamenityController");

// CREATE
router.post("/", addAmenity);

// READ
router.get("/:projectId", getAmenitiesByProject);

// UPDATE
router.put("/:id", updateAmenity);

// DELETE
router.delete("/:id", deleteAmenity);

module.exports = router;