const express = require("express");
const router = express.Router();
const {
  saveProjectStats,
  getProjectStats
} = require("../controllers/projectStatsController");

// CREATE/UPDATE
router.post("/", saveProjectStats);

// GET BY PROJECT ID
router.get("/:projectId", getProjectStats);

module.exports = router;
