const express = require("express");
const router = express.Router();

const upload = require("../middlewares/floorPlanUpload");  // <-- add this

const {
  createFloorPlan,
  getFloorPlans,
  deleteFloorPlan,
  submitFloorPlanEnquiry
} = require("../controllers/floorPlanController");

// ADD FLOOR PLAN (POST)
router.post("/", upload.single("image"), createFloorPlan);   // <-- REQUIRED

// GET ALL FLOOR PLANS FOR A PROJECT
router.get("/:projectId", getFloorPlans);

// DELETE
router.delete("/:id", deleteFloorPlan);

// POST ENQUIRY
router.post("/enquiry", submitFloorPlanEnquiry);

module.exports = router;
