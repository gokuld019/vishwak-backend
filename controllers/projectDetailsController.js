const ProjectDetails = require("../models/ProjectDetails");

/* =====================================================
   GET PROJECT DETAILS
===================================================== */
exports.getProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;

    const details = await ProjectDetails.findOne({
      where: { projectId },
    });

    if (!details) return res.json({});

    res.json(details);
  } catch (err) {
    console.error("Error fetching project details:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* =====================================================
   CREATE PROJECT DETAILS
===================================================== */
exports.createProjectDetails = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ FILES:", req.files);

    if (!req.body.projectId || !req.body.name) {
      return res.status(400).json({
        error: "projectId and name are required",
      });
    }

    let payload = { ...req.body };

    // ⭐ Ensure status
    payload.status = req.body.status || "ongoing";

    // ⭐ HERO BANNERS
    if (req.files?.heroImageDesktop) {
      payload.heroImageDesktop = `/uploads/projects/${req.files.heroImageDesktop[0].filename}`;
    }

    if (req.files?.heroImageMobile) {
      payload.heroImageMobile = `/uploads/projects/${req.files.heroImageMobile[0].filename}`;
    }

    // ⭐ OTHER IMAGES
    if (req.files?.image1) {
      payload.image1 = `/uploads/projects/${req.files.image1[0].filename}`;
    }

    if (req.files?.image2) {
      payload.image2 = `/uploads/projects/${req.files.image2[0].filename}`;
    }

    if (req.files?.image3) {
      payload.image3 = `/uploads/projects/${req.files.image3[0].filename}`;
    }

    if (req.files?.image4) {
      payload.image4 = `/uploads/projects/${req.files.image4[0].filename}`;
    }

    if (req.files?.thumbnail) {
      payload.thumbnail = `/uploads/projects/${req.files.thumbnail[0].filename}`;
    }

    const details = await ProjectDetails.create(payload);

    res.json(details);
  } catch (err) {
    console.error("Error creating project details:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* =====================================================
   UPDATE PROJECT DETAILS
===================================================== */
exports.updateProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;

    const existing = await ProjectDetails.findOne({
      where: { projectId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Project Details not found" });
    }

    let updateData = { ...req.body };

    // ⭐ Preserve status
    updateData.status = req.body.status || existing.status;

    // ⭐ HERO BANNERS
    if (req.files?.heroImageDesktop) {
      updateData.heroImageDesktop = `/uploads/projects/${req.files.heroImageDesktop[0].filename}`;
    }

    if (req.files?.heroImageMobile) {
      updateData.heroImageMobile = `/uploads/projects/${req.files.heroImageMobile[0].filename}`;
    }

    // ⭐ OTHER IMAGES
    if (req.files?.image1) {
      updateData.image1 = `/uploads/projects/${req.files.image1[0].filename}`;
    }

    if (req.files?.image2) {
      updateData.image2 = `/uploads/projects/${req.files.image2[0].filename}`;
    }

    if (req.files?.image3) {
      updateData.image3 = `/uploads/projects/${req.files.image3[0].filename}`;
    }

    if (req.files?.image4) {
      updateData.image4 = `/uploads/projects/${req.files.image4[0].filename}`;
    }

    if (req.files?.thumbnail) {
      updateData.thumbnail = `/uploads/projects/${req.files.thumbnail[0].filename}`;
    }

    await existing.update(updateData);

    res.json({
      message: "Updated successfully",
      data: existing,
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* =====================================================
   GET RECENT PROJECTS
===================================================== */
exports.getRecentProjects = async (req, res) => {
  try {
    const recent = await ProjectDetails.findAll({
      order: [["updatedAt", "DESC"]],
      limit: 3,
    });

    res.json({ success: true, data: recent });
  } catch (err) {
    console.error("Error fetching recent projects:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =====================================================
   GET PROJECT MENU (ONGOING + COMPLETED)
===================================================== */
exports.getProjectMenu = async (req, res) => {
  try {
    const projects = await ProjectDetails.findAll({
      attributes: ["projectId", "name", "category", "status"],
      order: [["name", "ASC"]],
    });

    const normalize = (v) => v?.toLowerCase().trim() || "";

    const plots = projects.filter(
      (p) => p.status === "ongoing" && normalize(p.category).includes("plot")
    );

    const villas = projects.filter(
      (p) => p.status === "ongoing" && normalize(p.category).includes("villa")
    );

    const completedPlots = projects.filter(
      (p) => p.status === "completed" && normalize(p.category).includes("plot")
    );

    const completedVillas = projects.filter(
      (p) => p.status === "completed" && normalize(p.category).includes("villa")
    );

    res.json({
      plots,
      villas,
      completedPlots,
      completedVillas,
    });
  } catch (err) {
    console.error("Menu fetch error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

/* =====================================================
   GET COMPLETED PROJECTS
===================================================== */
exports.getCompletedProjects = async (req, res) => {
  try {
    const projects = await ProjectDetails.findAll({
      where: { status: "completed" },
      order: [["name", "ASC"]],
    });

    res.json({ success: true, data: projects });
  } catch (err) {
    console.error("COMPLETED fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =====================================================
   GET ONGOING PROJECTS
===================================================== */
exports.getOngoingProjects = async (req, res) => {
  try {
    const projects = await ProjectDetails.findAll({
      where: { status: "ongoing" },
      order: [["name", "ASC"]],
    });

    res.json({ success: true, data: projects });
  } catch (err) {
    console.error("ONGOING fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.getProjectsByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    const projects = await ProjectDetails.findAll({
      where: {
        category: category,
      },
      attributes: ["projectId", "name"],
      order: [["name", "ASC"]],
    });

    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
