const ProjectGallery = require("../models/ProjectGallery");

// UPLOAD MULTIPLE
exports.addGalleryImages = async (req, res) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({ message: "projectId is required" });
    }

    const files = req.files || [];

    if (files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    let created = [];

    for (const file of files) {
      const img = await ProjectGallery.create({
        projectId,
        image: `/uploads/gallery/${file.filename}`,
      });

      created.push(img);
    }

    res.json({
      message: "Gallery images uploaded",
      gallery: created,
    });
  } catch (err) {
    console.error("Gallery upload error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET IMAGES BY PROJECT
exports.getGallery = async (req, res) => {
  try {
    const { projectId } = req.params;

    const images = await ProjectGallery.findAll({
      where: { projectId },
      order: [["id", "ASC"]],
    });

    res.json({ gallery: images });
  } catch (err) {
    console.error("Fetch gallery error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE AN IMAGE
exports.deleteGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;

    const img = await ProjectGallery.findByPk(id);
    if (!img) return res.status(404).json({ message: "Image not found" });

    await img.destroy();

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
