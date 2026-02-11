const express = require("express");
const router = express.Router();
const {
  addSpecifications,
  getSpecifications,
  updateSpecification,
  deleteSpecification,
} = require("../controllers/specificationController");

// ADD MULTIPLE SPECS
router.post("/", addSpecifications);

// GET ALL SPECS FOR A PROJECT
router.get("/:projectId", getSpecifications);

// UPDATE SINGLE
router.put("/:id", updateSpecification);

// DELETE SINGLE
router.delete("/:id", deleteSpecification);

module.exports = router;
