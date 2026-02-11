const express = require("express");
const router = express.Router();

const {
  getWhyByProject,
  replaceWhyForProject,
} = require("../controllers/whyController");

// GET why points for a project
router.get("/:projectId", getWhyByProject);

// BULK REPLACE why points for a project
router.post("/bulk/:projectId", replaceWhyForProject);

module.exports = router;
