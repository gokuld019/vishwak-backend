const express = require("express");
const router = express.Router();

const {
  getLocationData,
  replaceLocationData,
} = require("../controllers/locationController");

// GET location data for a project
router.get("/:projectId", getLocationData);

// POST replace all location data for project
router.post("/bulk/:projectId", replaceLocationData);

module.exports = router;
