const FloorPlan = require("../models/FloorPlan");
const FloorPlanEnquiry = require("../models/FloorPlanEnquiry");

// POST - Add floor plan (with image)
exports.createFloorPlan = async (req, res) => {
  try {
    const { projectId, type, area } = req.body;

    if (!projectId || !type || !area) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const imagePath = req.file ? `uploads/floorplans/${req.file.filename}` : "";

    const created = await FloorPlan.create({
      projectId,
      type,
      area,
      image: imagePath,
    });

    res.json({ message: "Floor plan added", data: created });
  } catch (err) {
    console.error("Error adding floor plan:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET - List all floor plans for project
exports.getFloorPlans = async (req, res) => {
  try {
    const { projectId } = req.params;

    const plans = await FloorPlan.findAll({
      where: { projectId },
    });

    return res.json(plans);
  } catch (err) {
    console.log("Error fetching floor plans:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// DELETE floor plan
exports.deleteFloorPlan = async (req, res) => {
  try {
    const { id } = req.params;

    await FloorPlan.destroy({ where: { id } });

    res.json({ message: "Floor plan deleted" });
  } catch (err) {
    console.error("Error deleting:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// POST - Submit Floor Plan Enquiry
exports.submitFloorPlanEnquiry = async (req, res) => {
  try {
    const { projectId, floorPlanId, fullName, email, phone, interestedIn } = req.body;

    const created = await FloorPlanEnquiry.create({
      projectId,
      floorPlanId,
      fullName,
      email,
      phone,
      interestedIn,
    });

    res.json({ message: "Enquiry submitted", data: created });
  } catch (err) {
    console.error("Error submitting enquiry:", err);
    res.status(500).json({ error: "Server error" });
  }
};
