const Specification = require("../models/Specification");

// CREATE MULTIPLE SPECIFICATIONS
exports.addSpecifications = async (req, res) => {
  try {
    const { projectId, specs } = req.body;

    if (!projectId || !specs) {
      return res.status(400).json({ message: "projectId & specs required" });
    }

    const created = [];

    for (const spec of specs) {
      const item = await Specification.create({
        projectId,
        category: spec.category,
        detail: spec.detail,
      });

      created.push(item);
    }

    return res.json({
      message: "Specifications saved successfully",
      specifications: created,
    });
  } catch (err) {
    console.error("Error saving specs:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET ALL SPECIFICATIONS FOR A PROJECT
exports.getSpecifications = async (req, res) => {
  try {
    const { projectId } = req.params;

    const list = await Specification.findAll({
      where: { projectId },
      order: [["id", "ASC"]],
    });

    return res.json({ specifications: list });
  } catch (err) {
    console.error("Error fetching specs:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE SPECIFICATION
exports.updateSpecification = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, detail } = req.body;

    const spec = await Specification.findByPk(id);
    if (!spec) return res.status(404).json({ message: "Not found" });

    spec.category = category || spec.category;
    spec.detail = detail || spec.detail;

    await spec.save();

    res.json({ message: "Updated successfully", spec });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE SPECIFICATION
exports.deleteSpecification = async (req, res) => {
  try {
    const { id } = req.params;

    const spec = await Specification.findByPk(id);
    if (!spec) return res.status(404).json({ message: "Not found" });

    await spec.destroy();

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
