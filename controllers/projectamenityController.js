const ProjectAmenity = require("../models/ProjectAmenity");

// POST /api/project-amenities
exports.addAmenity = async (req, res) => {
  try {
    const { projectId, name, description } = req.body;

    if (!projectId || !name) {
      return res.status(400).json({ 
        message: "projectId and name are required" 
      });
    }

    const amenity = await ProjectAmenity.create({
      projectId,
      name,
      description,
      type: "text",
    });

    return res.json({
      message: "Amenity added successfully",
      amenity,
    });

  } catch (err) {
    console.error("Error adding amenity:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET by project
exports.getAmenitiesByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const amenities = await ProjectAmenity.findAll({
      where: { projectId },
      order: [["id", "ASC"]],
    });

    return res.json({ amenities });

  } catch (err) {
    console.error("Error fetching amenities:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// UPDATE
exports.updateAmenity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const amenity = await ProjectAmenity.findByPk(id);

    if (!amenity) {
      return res.status(404).json({ message: "Amenity not found" });
    }

    if (name) amenity.name = name;
    if (description) amenity.description = description;

    await amenity.save();

    return res.json({
      message: "Amenity updated",
      amenity,
    });

  } catch (err) {
    console.error("Error updating amenity:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE
exports.deleteAmenity = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await ProjectAmenity.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Amenity not found" });
    }

    return res.json({ message: "Amenity deleted successfully" });

  } catch (err) {
    console.error("Error deleting amenity:", err);
    return res.status(500).json({ message: "Server error" });
  }
};