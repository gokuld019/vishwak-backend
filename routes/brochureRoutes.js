const express = require("express");
const router = express.Router();
const upload = require("../middlewares/brochureUpload");

const {
  uploadProjectBrochure,
  getProjectBrochure,
} = require("../controllers/brochureController");

// POST → Upload Brochure + Thumbnail
router.post(
  "/upload",
  upload.fields([
    { name: "brochure", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  uploadProjectBrochure
);

// GET → Get Brochure by Project ID
router.get("/:projectId", getProjectBrochure);

module.exports = router;
