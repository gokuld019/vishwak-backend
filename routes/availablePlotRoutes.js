const express = require("express");
const router = express.Router();

const {
  getAvailablePlots,
} = require("../controllers/availablePlotController");

router.get("/:projectId", getAvailablePlots);

module.exports = router;