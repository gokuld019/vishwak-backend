const ProjectAmenity = require("../models/ProjectAmenity");

// POST /api/project-amenities
exports.addAllAmenities = async (req, res) => {
  try {
    const { projectId, textAmenities } = req.body;

    if (!projectId) {
      return res.status(400).json({ message: "projectId is required" });
    }

    let created = [];

    // -----------------------------
    // 1️⃣ Save TEXT AMENITIES
    // -----------------------------
    if (textAmenities) {
      const textList = textAmenities.split(",").map((t) => t.trim());

      for (const name of textList) {
        const item = await ProjectAmenity.create({
          projectId,
          type: "text",
          name,
          image: null,
        });
        created.push(item);
      }
    }

    // -----------------------------
    // 2️⃣ Save IMAGE AMENITIES
    // -----------------------------
    if (req.files && req.files.galleryImages) {
      for (const file of req.files.galleryImages) {
        const item = await ProjectAmenity.create({
          projectId,
          type: "image",
          name: null,
          image: `/uploads/ProjectAmenity/${file.filename}`,
        });
        created.push(item);
      }
    }

    return res.json({
      message: "Amenities saved successfully",
      amenities: created,
    });
  } catch (err) {
    console.error("Error uploading amenities:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/project-amenities/:projectId
exports.getAmenitiesByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({ message: "projectId is required" });
    }

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


// PUT /api/project-amenities/:id
exports.updateAmenity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const amenity = await ProjectAmenity.findByPk(id);
    if (!amenity) {
      return res.status(404).json({ message: "Amenity not found" });
    }

    // Update text amenity
    if (name) amenity.name = name;

    // Update image amenity if new file uploaded
    if (req.file) {
      amenity.image = `/uploads/ProjectAmenity/${req.file.filename}`;
    }

    await amenity.save();

    return res.json({ message: "Amenity updated", amenity });
  } catch (err) {
    console.error("Error updating amenity:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/project-amenities/:id
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
