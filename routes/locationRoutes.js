const express = require("express");
const router = express.Router();

const {
  getLocationData,
  saveLocationData,
} = require("../controllers/locationController");

router.get("/:projectId", getLocationData);
router.post("/:projectId", saveLocationData);

module.exports = router;