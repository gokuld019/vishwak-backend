const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");

const {
  getProjectDetails,
  createProjectDetails,
  updateProjectDetails,
  getRecentProjects,
  getOngoingProjects,
  getCompletedProjects,
  getProjectsByCategory,
} = require("../controllers/projectDetailsController");

router.get("/ongoing", getOngoingProjects);
router.get("/completed", getCompletedProjects);
router.get("/by-category", getProjectsByCategory);
router.get("/recent", getRecentProjects);

router.get("/:projectId", getProjectDetails);

router.post(
  "/",
  upload.fields([
    { name: "heroImageDesktop", maxCount: 1 },
    { name: "heroImageMobile", maxCount: 1 },
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
    { name: "sitePlanImage", maxCount: 1 },
    { name: "plotAreaStatementImage", maxCount: 1 },
  ]),
  createProjectDetails
);

router.put(
  "/:projectId",
  upload.fields([
    { name: "heroImageDesktop", maxCount: 1 },
    { name: "heroImageMobile", maxCount: 1 },
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
    { name: "sitePlanImage", maxCount: 1 },
    { name: "plotAreaStatementImage", maxCount: 1 },
  ]),
  updateProjectDetails
);

module.exports = router;