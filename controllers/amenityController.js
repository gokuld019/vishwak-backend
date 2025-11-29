// controllers/amenityController.js
const Amenity = require('../models/Amenity');

// GET all amenities (public)
exports.getAmenities = async (req, res) => {
  try {
    const amenities = await Amenity.findAll({ order: [['id', 'ASC']] });
    res.json(amenities);
  } catch (err) {
    console.error('Error fetching amenities:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET single amenity (admin)
exports.getAmenityById = async (req, res) => {
  try {
    const amenity = await Amenity.findByPk(req.params.id);
    if (!amenity) return res.status(404).json({ message: "Amenity not found" });

    res.json(amenity);
  } catch (err) {
    console.error("Error fetching amenity:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// CREATE amenity (admin)
exports.createAmenity = async (req, res) => {
  try {
    console.log("📨 Incoming Amenity Upload:", req.body, req.file);

    const label = req.body.label;
    const icon = req.file ? `/uploads/amenities/${req.file.filename}` : null;

    if (!label) {
      return res.status(400).json({ message: "Amenity label is required" });
    }
    if (!icon) {
      return res.status(400).json({ message: "Amenity icon is required" });
    }

    const amenity = await Amenity.create({ label, icon });

    res.status(201).json({
      message: "Amenity created successfully",
      data: amenity,
    });
  } catch (err) {
    console.error("❌ Error creating amenity:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// UPDATE amenity (admin)
exports.updateAmenity = async (req, res) => {
  try {
    const { id } = req.params;
    const label = req.body.label;
    const icon = req.file ? `/uploads/amenities/${req.file.filename}` : null;

    const amenity = await Amenity.findByPk(id);
    if (!amenity) {
      return res.status(404).json({ message: "Amenity not found" });
    }

    await amenity.update({
      label: label ?? amenity.label,
      icon: icon ?? amenity.icon,
    });

    res.json({
      message: "Amenity updated successfully",
      data: amenity,
    });
  } catch (err) {
    console.error("❌ Error updating amenity:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE amenity (admin)
exports.deleteAmenity = async (req, res) => {
  try {
    const amenity = await Amenity.findByPk(req.params.id);
    if (!amenity) {
      return res.status(404).json({ message: "Amenity not found" });
    }

    await amenity.destroy();

    res.json({ message: "Amenity deleted successfully" });
  } catch (err) {
    console.error("Error deleting amenity:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
