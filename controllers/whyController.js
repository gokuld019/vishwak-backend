const WhyPoint = require("../models/WhyPoint");

// GET all WHY points for a project
exports.getWhyByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const points = await WhyPoint.findAll({
      where: { projectId },
      order: [["sortOrder", "ASC"]],
    });

    res.json(points);
  } catch (err) {
    console.error("Error fetching WHY points:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// REPLACE all WHY points for a project (bulk insert)
exports.replaceWhyForProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { points } = req.body; // array of WHY cards

    if (!projectId) {
      return res.status(400).json({ error: "projectId is required" });
    }

    if (!Array.isArray(points) || points.length === 0) {
      return res.status(400).json({ error: "points must be a non-empty array" });
    }

    // delete old WHY points
    await WhyPoint.destroy({ where: { projectId } });

    // insert new WHY cards
    const toInsert = points.map((p, index) => ({
      projectId,
      title: p.title,
      description: p.description,
      iconKey: p.iconKey || "MapPin",
      sortOrder: p.sortOrder || index + 1,
    }));

    const created = await WhyPoint.bulkCreate(toInsert);

    res.json({
      message: "WHY section updated",
      data: created,
    });
  } catch (err) {
    console.error("Error replacing WHY points:", err);
    res.status(500).json({ error: "Server error" });
  }
};
