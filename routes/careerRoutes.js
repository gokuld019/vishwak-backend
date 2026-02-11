// routes/careerRoutes.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const careerController = require("../controllers/careerController");

const router = express.Router();

// =========================
// MULTER CONFIG (resume uploads)
// =========================

const resumesDir = path.join(__dirname, "..", "uploads", "resumes");

if (!fs.existsSync(resumesDir)) {
  fs.mkdirSync(resumesDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, resumesDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = file.originalname.replace(ext, "").replace(/\s+/g, "-");
    const unique = Date.now();
    cb(null, `${unique}-${name}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only PDF, DOC, DOCX files are allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// =========================
// JOB ROUTES
// =========================

// Public - list jobs
router.get("/jobs", careerController.getAllJobs);

// Public - get single job
router.get("/jobs/:id", careerController.getJobById);

// Admin - create job
router.post("/jobs", careerController.createJob);

// Admin - update job
router.put("/jobs/:id", careerController.updateJob);

// Admin - delete job
router.delete("/jobs/:id", careerController.deleteJob);

// =========================
// APPLICATION ROUTES
// =========================

// Public - apply for a job (with resume upload)
router.post(
  "/jobs/:id/apply",
  upload.single("resume"),
  careerController.applyForJob
);

// Admin - list all applications (optional)
router.get("/applications", careerController.getAllApplications);

module.exports = router;
