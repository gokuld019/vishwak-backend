const express = require("express");
const router = express.Router();

const {
  getWhyPoints,
  saveWhyPoints,
} = require("../controllers/whyController");

// GET why points by project
router.get("/:projectId", getWhyPoints);

// SAVE (create/update) why points
router.post("/:projectId", saveWhyPoints);

module.exports = router;