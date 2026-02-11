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
    const { projectId } = req.body;

    const cleanedRouteMap = cleanMapInput(req.body.routeMap);

    const media = await ProjectMedia.create({
      projectId,
      routeMap: cleanedRouteMap, 

      cinematic360: req.files?.cinematic360
        ? `/uploads/${req.files.cinematic360[0].filename}`
        : null,
    });

    res.json({ success: true, data: media });

  } catch (err) {
    console.error("Error creating media:", err);
    res.status(500).json({ error: "Server error" });
  }
};



// ================================
// PUT /api/project-media/:projectId
// ================================
exports.updateMedia = async (req, res) => {
  try {
    const { projectId } = req.params;

    const existing = await ProjectMedia.findOne({ where: { projectId } });
    if (!existing) {
      return res.status(404).json({ error: "Project media not found" });
    }

    const cleanedRouteMap = cleanMapInput(req.body.routeMap);

    await existing.update({
      cinematic360: req.files?.cinematic360
        ? `/uploads/${req.files.cinematic360[0].filename}`
        : existing.cinematic360,

      routeMap: cleanedRouteMap || existing.routeMap,
    });

    res.json({ success: true, data: existing });

  } catch (err) {
    console.error("Error updating media:", err);
    res.status(500).json({ error: "Server error" });
  }
};
