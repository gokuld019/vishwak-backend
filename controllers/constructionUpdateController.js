const ConstructionUpdate = require("../models/ConstructionUpdate");
const fs = require("fs");
const path = require("path");

// ADD MULTIPLE UPDATES + IMAGES
exports.addConstructionUpdates = async (req, res) => {
  try {
    const { projectId, updates } = req.body;

    if (!projectId || !updates) {
      return res.status(400).json({ message: "projectId & updates required" });
    }

    const updateList = JSON.parse(updates);
    let created = [];
    let files = req.files || [];

    for (let i = 0; i < updateList.length; i++) {
      const data = updateList[i];
      const imageFile = files[i]
        ? `/uploads/construction-updates/${files[i].filename}`
        : null;

      const newRecord = await ConstructionUpdate.create({
        projectId,
        update: data.update,
        date: data.date,
        progress: data.progress,
        image: imageFile,
      });

      created.push(newRecord);
    }

    res.json({ message: "Construction updates added", updates: created });
  } catch (err) {
    console.error("Construction update error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getConstructionUpdates = async (req, res) => {
  try {
    const { projectId } = req.params;

    const updates = await ConstructionUpdate.findAll({
      where: { projectId },
      order: [["date", "DESC"]],
    });

    res.json({ updates });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateConstructionUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { update, date, progress } = req.body;

    const record = await ConstructionUpdate.findByPk(id);
    if (!record) return res.status(404).json({ message: "Not found" });

    // If new image uploaded, remove old one
    if (req.file) {
      if (record.image) {
        const oldImagePath = path.join(__dirname, "..", record.image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }

      record.image = `/uploads/construction-updates/${req.file.filename}`;
    }

    record.update = update || record.update;
    record.date = date || record.date;
    record.progress = progress || record.progress;

    await record.save();

    res.json({ message: "Updated successfully", record });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteConstructionUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await ConstructionUpdate.findByPk(id);
    if (!record) return res.status(404).json({ message: "Not found" });

    // delete image
    if (record.image) {
      const imgPath = path.join(__dirname, "..", record.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await record.destroy();

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
