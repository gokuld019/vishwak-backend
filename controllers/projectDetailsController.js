const ProjectDetails = require("../models/ProjectDetails");
const { Op } = require("sequelize");

/* =====================================================
   GET PROJECT DETAILS
===================================================== */
exports.getProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;

    const details = await ProjectDetails.findOne({
      where: { projectId },
    });

    if (!details) {
      return res.json({});
    }

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
    if (!req.body.projectId || !req.body.name) {
      return res.status(400).json({
        error: "projectId and name are required",
      });
    }

    let payload = { ...req.body };

    payload.status = req.body.status || "ongoing";

    const imageFields = [
      "heroImageDesktop",
      "heroImageMobile",
      "image1",
      "image2",
      "image3",
      "image4",
      "thumbnail",
      "sitePlanImage",
      "plotAreaStatementImage",
    ];

    imageFields.forEach((field) => {
      if (req.files && req.files[field]) {
        payload[field] = `/uploads/projects/${req.files[field][0].filename}`;
      }
    });

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
      return res.status(404).json({ error: "Project not found" });
    }

    let updateData = { ...req.body };

    updateData.status = req.body.status || existing.status;

    const imageFields = [
      "heroImageDesktop",
      "heroImageMobile",
      "image1",
      "image2",
      "image3",
      "image4",
      "thumbnail",
      "sitePlanImage",
      "plotAreaStatementImage",
    ];

    imageFields.forEach((field) => {
      if (req.files && req.files[field]) {
        updateData[field] = `/uploads/projects/${req.files[field][0].filename}`;
      }
    });

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
    res.status(500).json({ success: false, message: "Server error" });
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
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =====================================================
   GET ONGOING PROJECTS
===================================================== */
exports.getOngoingProjects = async (req, res) => {
  try {
    const projects = await ProjectDetails.findAll({
      where: {
        status: {
          [Op.in]: ["ongoing", "sold_out"],
        },
      },
      order: [["name", "ASC"]],
    });

    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =====================================================
   GET PROJECTS BY CATEGORY
===================================================== */
exports.getProjectsByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    const projects = await ProjectDetails.findAll({
      where: { category },
      attributes: ["projectId", "name", "status"],
      order: [["name", "ASC"]],
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};