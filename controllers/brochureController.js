const Brochure = require("../models/Brochure");

// ==========================
// UPLOAD / UPDATE BROCHURE
// ==========================
exports.uploadProjectBrochure = async (req, res) => {
  try {
    const { projectId, title } = req.body;

    if (!projectId) {
      return res.status(400).json({ message: "projectId is required" });
    }

    const brochureFile = req.files?.brochure?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    if (!brochureFile) {
      return res.status(400).json({ message: "Brochure PDF is required" });
    }

    const brochureName = brochureFile.filename;
    const thumbnailName = thumbnailFile ? thumbnailFile.filename : null;

    let brochure = await Brochure.findOne({ where: { projectId } });

    // ----- UPDATE -----
    if (brochure) {
      brochure.title = title || brochure.title;
      brochure.file = brochureName;
      if (thumbnailName) brochure.thumbnail = thumbnailName;

      await brochure.save();

      return res.json({
        message: "Brochure updated successfully",
        brochure: {
          id: brochure.id,
          projectId: brochure.projectId,
          title: brochure.title,
          fileUrl: `/uploads/brochures/${brochure.file}`,
          thumbnailUrl: brochure.thumbnail
            ? `/uploads/brochures/${brochure.thumbnail}`
            : null,
        },
      });
    }

    // ----- CREATE -----
    const newBrochure = await Brochure.create({
      projectId,
      title,
      file: brochureName,
      thumbnail: thumbnailName,
    });

    return res.json({
      message: "Brochure uploaded successfully",
      brochure: {
        id: newBrochure.id,
        projectId: newBrochure.projectId,
        title: newBrochure.title,
        fileUrl: `/uploads/brochures/${newBrochure.file}`,
        thumbnailUrl: newBrochure.thumbnail
          ? `/uploads/brochures/${newBrochure.thumbnail}`
          : null,
      },
    });
  } catch (error) {
    console.error("Brochure Upload Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// GET BROCHURE
// ==========================
exports.getProjectBrochure = async (req, res) => {
  try {
    const { projectId } = req.params;
    const brochure = await Brochure.findOne({ where: { projectId } });

    if (!brochure) return res.json({});

    return res.json({
      id: brochure.id,
      projectId: brochure.projectId,
      title: brochure.title,
      fileUrl: `/uploads/brochures/${brochure.file}`,
      thumbnailUrl: brochure.thumbnail
        ? `/uploads/brochures/${brochure.thumbnail}`
        : null,
    });
  } catch (error) {
    console.error("Fetch Brochure Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
