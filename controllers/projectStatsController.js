const ProjectStats = require("../models/ProjectStats");

// CREATE / UPDATE
exports.saveProjectStats = async (req, res) => {
  try {
    const { projectId, totalUnits, sqftRange, saleableArea, floors, badgeText } = req.body;

    if (!projectId) {
      return res.status(400).json({ message: "projectId is required" });
    }

    let record = await ProjectStats.findOne({ where: { projectId } });

    if (record) {
      await record.update({ totalUnits, sqftRange, saleableArea, floors, badgeText });
    } else {
      record = await ProjectStats.create({
        projectId,
        totalUnits,
        sqftRange,
        saleableArea,
        floors,
        badgeText,
      });
    }

    res.json({ message: "Project Stats saved successfully", data: record });
  } catch (error) {
    console.error("Stats Save Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET
exports.getProjectStats = async (req, res) => {
  try {
    const { projectId } = req.params;

    const stats = await ProjectStats.findOne({ where: { projectId } });

    if (!stats) return res.json({});

    res.json({ stats });
  } catch (error) {
    console.error("Fetch Stats Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
