const LocationPoint = require("../models/LocationPoint");

// BULK INSERT for both connectivity + facilities
exports.bulkSaveLocation = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { connectivity, facilities } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: "projectId required" });
    }

    if (!Array.isArray(connectivity) || !Array.isArray(facilities)) {
      return res.status(400).json({
        error: "connectivity and facilities must be arrays",
      });
    }

    // delete old location highlights
    await LocationPoint.destroy({ where: { projectId } });

    const toInsert = [];

    // --- SMART CONNECTIVITY ---
    connectivity.forEach((item, idx) => {
      toInsert.push({
        projectId,
        type: "connectivity",
        name: item.name,
        distance: item.distance || "",
        time: item.time || "",
        sortOrder: item.sortOrder || idx + 1,
      });
    });

    // --- FACILITIES ---
    facilities.forEach((item, idx) => {
      toInsert.push({
        projectId,
        type: "facility",
        name: item.name,
        distance: "",
        time: "",
        sortOrder: item.sortOrder || idx + 1,
      });
    });

    const inserted = await LocationPoint.bulkCreate(toInsert);

    res.json({
      message: "Location highlights updated successfully",
      data: inserted,
    });
  } catch (err) {
    console.error("Error replacing location points:", err);
    res.status(500).json({ error: "Server error" });
  }
};


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



// REPLACE ALL LOCATION DATA
exports.replaceLocationData = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { connectivity, facilities } = req.body;

    if (!projectId)
      return res.status(400).json({ error: "projectId required" });

    if (!Array.isArray(connectivity) || !Array.isArray(facilities))
      return res.status(400).json({ error: "connectivity & facilities must be arrays" });

    // Remove old entries
    await LocationPoint.destroy({ where: { projectId } });

    const dataToInsert = [
      ...connectivity.map((item, i) => ({
        projectId,
        type: "connectivity",
        name: item.name,
        distance: item.distance || "",
        time: item.time || "",
        sortOrder: i + 1,
      })),

      ...facilities.map((item, i) => ({
        projectId,
        type: "facility",
        name: item.name,
        distance: "",
        time: "",
        sortOrder: i + 1,
      })),
    ];

    const inserted = await LocationPoint.bulkCreate(dataToInsert);

    res.json({
      message: "Location highlights updated",
      data: inserted,
    });

  } catch (err) {
    console.error("Error replacing location points:", err);
    res.status(500).json({ error: "Server error" });
  }
};
