const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload"); // reuse global upload

const {
  getMediaByProject,
  createMedia,
  updateMedia,
} = require("../controllers/projectMediaController");

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