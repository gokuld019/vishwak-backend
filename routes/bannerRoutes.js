const router = require("express").Router();

const bannerController = require("../controllers/bannerController");

const upload = require("../middlewares/uploadBanner");


// GET
router.get("/", bannerController.getBanners);


// CREATE
router.post(
  "/",
  upload.single("image"),
  bannerController.createBanner
);


// DELETE
router.delete(
  "/:id",
  bannerController.deleteBanner
);

module.exports = router;