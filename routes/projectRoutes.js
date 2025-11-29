// routes/projectRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const uploadProject = require("../config/multerProject");

const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

// Public routes
router.get("/", getProjects);
router.get("/:id", getProjectById);

// Admin routes
router.post("/", auth, uploadProject.single("image"), createProject);
router.put("/:id", auth, uploadProject.single("image"), updateProject);
router.delete("/:id", auth, deleteProject);

module.exports = router;
