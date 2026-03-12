// controllers/projectMediaController.js
const ProjectMedia = require("../models/ProjectMedia");


// ----------------------------------------
// Helper: Clean the incoming routeMap input
// ----------------------------------------
function cleanMapInput(routeMap) {
  if (!routeMap) return null;

  // If iframe is sent, extract only src URL
  if (routeMap.includes("<iframe")) {
    const match = routeMap.match(/src="([^"]+)"/);
    return match ? match[1] : null;
  }

  // If plain URL, store as is
  return routeMap;
}



// ================================
// GET /api/project-media/:projectId
// ================================
exports.getMediaByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const media = await ProjectMedia.findOne({ where: { projectId } });

    if (!media) {
      return res.json({ success: true, data: {} });
    }

    res.json({
      success: true,
      data: {
        cinematic360: media.cinematic360
          ? `http://localhost:5000${media.cinematic360}`
          : null,

        // Now frontend receives only clean URL
        routeMap: media.routeMap || null,
      },
    });

  } catch (err) {
    console.error("Error fetching media:", err);
    res.status(500).json({ error: "Server error" });
  }
};



// ================================
// POST /api/project-media
// ================================
exports.createMedia = async (req, res) => {
  try {
    const { projectId, routeMap } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: "projectId required" });
    }

    let data = {
      projectId,
      routeMap
    };

    if (req.files?.cinematic360) {
      data.cinematic360 =
        "/uploads/projects/" + req.files.cinematic360[0].filename;
    }

    const existing = await ProjectMedia.findOne({
      where: { projectId }
    });

    if (existing) {
      await existing.update(data);
      return res.json({ message: "Media updated successfully" });
    }

    await ProjectMedia.create(data);

    res.json({ message: "Media created successfully" });

  } catch (error) {
    console.error("Media save error:", error);
    res.status(500).json({ error: "Server error" });
  }
};



// ================================
// PUT /api/project-media/:projectId
// ================================
exports.updateMedia = async (req, res) => {
  try {
    const { projectId } = req.params;

    const existing = await ProjectMedia.findOne({
      where: { projectId }
    });

    if (!existing) {
      return res.status(404).json({ error: "Media not found" });
    }

    let updateData = { routeMap: req.body.routeMap };

    if (req.files?.cinematic360) {
      updateData.cinematic360 =
        "/uploads/projects/" + req.files.cinematic360[0].filename;
    }

    await existing.update(updateData);

    res.json({ message: "Media updated successfully" });

  } catch (error) {
    console.error("Media update error:", error);
    res.status(500).json({ error: "Server error" });
  }
};