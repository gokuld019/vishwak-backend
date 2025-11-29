// controllers/projectController.js
const Project = require("../models/Project");

// ==========================
// GET ALL PROJECTS (Public)
// ==========================
exports.getProjects = async (req, res) => {
  try {
    const { category } = req.query;
    const where = {};

    if (category) where.category = category;

    const projects = await Project.findAll({
      where,
      order: [["id", "ASC"]],
    });

    res.json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==========================
// GET SINGLE PROJECT
// ==========================
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==========================
// CREATE PROJECT (Admin)
// ==========================
exports.createProject = async (req, res) => {
  try {
    const { name, location, category, totalUnits, bedrooms } = req.body;

    if (!name || !location || !category) {
      return res.status(400).json({
        message: "Name, location & category are required",
      });
    }

    const image = req.file ? `/uploads/projects/${req.file.filename}` : null;

    const project = await Project.create({
      name,
      location,
      category,
      totalUnits,
      bedrooms,
      image,
    });

    res.status(201).json({
      message: "Project created successfully",
      data: project,
    });
  } catch (err) {
    console.error("Create Project Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==========================
// UPDATE PROJECT
// ==========================
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, category, totalUnits, bedrooms } = req.body;

    const project = await Project.findByPk(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const image = req.file
      ? `/uploads/projects/${req.file.filename}`
      : project.image;

    await project.update({
      name: name ?? project.name,
      location: location ?? project.location,
      category: category ?? project.category,
      totalUnits: totalUnits ?? project.totalUnits,
      bedrooms: bedrooms ?? project.bedrooms,
      image,
    });

    res.json({
      message: "Project updated successfully",
      data: project,
    });
  } catch (err) {
    console.error("Update Project Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==========================
// DELETE PROJECT
// ==========================
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    await project.destroy();

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Delete Project Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
