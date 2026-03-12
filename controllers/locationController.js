const LocationPoint = require("../models/LocationPoint");

// ===============================
// GET LOCATION DATA
// ===============================
exports.getLocationData = async (req, res) => {
  try {
    const { projectId } = req.params;

    const data = await LocationPoint.findAll({
      where: { projectId },
      order: [["sortOrder", "ASC"]],
    });

    res.json(data);

  } catch (err) {
    console.error("Error fetching location:", err);
    res.status(500).json({ error: "Server error" });
  }
};


// ===============================
// SAVE / REPLACE LOCATION DATA
// ===============================
exports.saveLocationData = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { connectivity = [], facilities = [] } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: "projectId required" });
    }

    // 🔥 Delete old data
    await LocationPoint.destroy({
      where: { projectId }
    });

    const rows = [];

    // Connectivity
    connectivity.forEach((item, index) => {
      rows.push({
        projectId,
        type: "connectivity",
        name: item.name,
        distance: item.distance || "",
        time: item.time || "",
        sortOrder: item.sortOrder || index + 1,
      });
    });

    // Facilities
    facilities.forEach((item, index) => {
      rows.push({
        projectId,
        type: "facility",
        name: item.name,
        distance: "",
        time: "",
        sortOrder: item.sortOrder || index + 1,
      });
    });

    await LocationPoint.bulkCreate(rows);

    res.json({
      message: "Location highlights updated successfully",
    });

  } catch (err) {
    console.error("Error saving location:", err);
    res.status(500).json({ error: "Server error" });
  }
};