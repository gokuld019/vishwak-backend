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

    res.json(details || {});
  } catch (err) {
    console.error("Error fetching project details:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* =====================================================
   CREATE OR UPDATE PROJECT DETAILS (WITH IMAGES)
===================================================== */
exports.createProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: "projectId required" });
    }

    let data = { ...req.body };

    // 🔥 Handle uploaded images
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
        data[field] = `/uploads/projects/${req.files[field][0].filename}`;
      }
    });

    const existing = await ProjectDetails.findOne({
      where: { projectId },
    });

    if (existing) {
      await existing.update(data);
      return res.json({
        message: "Project updated successfully",
        data: existing,
      });
    }

    const created = await ProjectDetails.create(data);

    res.status(201).json({
      message: "Project created successfully",
      data: created,
    });

  } catch (error) {
    console.error("Error saving project:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/* =====================================================
   UPDATE PROJECT DETAILS (PUT)
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
      message: "Project updated successfully",
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
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =====================================================
   GET COMPLETED PROJECTS
===================================================== */
exports.getCompletedProjects = async (req, res) => {
  try {
    const projects = await ProjectDetails.findAll({
      where: {
        status: {
          [Op.ne]: "ongoing",
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
      where: {
        category,
        status: "ongoing",
      },
      attributes: ["projectId", "name", "status"],
      order: [["name", "ASC"]],
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};