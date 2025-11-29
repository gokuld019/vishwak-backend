// routes/bannerRoutes.js
const router = require("express").Router();
const upload = require("../config/multer");

const {
  getBanners,
  getBannerById,
  uploadBanners,
  updateBanner,
  deleteBanner,
} = require("../controllers/bannerController");

// GET all banners
router.get("/", getBanners);

// GET single banner
router.get("/:id", getBannerById);

// UPLOAD / REPLACE 1–3 banners
router.post(
  "/upload",
  upload.array("banners", 3), // IMPORTANT: field name MUST match frontend
  uploadBanners
);

// UPDATE banner (text only)
router.put("/:id", updateBanner);

// DELETE banner
router.delete("/:id", deleteBanner);

module.exports = router;
