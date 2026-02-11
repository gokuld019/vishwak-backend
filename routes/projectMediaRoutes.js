  // routes/projectMediaRoutes.js
  const express = require("express");
  const router = express.Router();
  const multer = require("multer");

  const {
    getMediaByProject,
    createMedia,
    updateMedia,
  } = require("../controllers/projectMediaController");


  // -------------------------
  // Multer Storage
  // -------------------------
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) =>
      cb(null, Date.now() + "-" + file.originalname),
  });

  const upload = multer({ storage });


  // -------------------------
  // ROUTES
  // -------------------------

  // GET media by project
  router.get("/:projectId", getMediaByProject);

  // CREATE media
  router.post(
    "/",
    upload.fields([{ name: "cinematic360", maxCount: 1 }]),
    createMedia
  );

  // UPDATE media
  router.put(
    "/:projectId",
    upload.fields([{ name: "cinematic360", maxCount: 1 }]),
    updateMedia
  );

  module.exports = router;
