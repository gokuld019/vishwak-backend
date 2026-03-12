const Why = require("../models/WhyPoint");

// =============================
// GET WHY POINTS
// =============================
exports.getWhyPoints = async (req, res) => {
  try {
    const { projectId } = req.params;

    const points = await Why.findAll({
      where: { projectId },
      order: [["sortOrder", "ASC"]],
    });

    res.status(200).json(points);

  } catch (error) {
    console.error("Error fetching why points:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =============================
// SAVE WHY POINTS
// =============================
exports.saveWhyPoints = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { points } = req.body;

    if (!Array.isArray(points)) {
      return res.status(400).json({
        message: "Points must be an array",
      });
    }

    // 🔥 Delete old records
    await Why.destroy({
      where: { projectId },
    });

    // 🔥 Insert updated records
    const newPoints = points.map((point, index) => ({
      projectId,
      title: point.title,
      description: point.description,
      iconKey: point.iconKey,
      sortOrder: point.sortOrder || index + 1,
    }));

    await Why.bulkCreate(newPoints);

    res.status(200).json({
      message: "Why section saved successfully",
    });

  } catch (error) {
    console.error("Error saving why points:", error);
    res.status(500).json({ message: "Server error" });
  }
};