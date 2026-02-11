const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");

const {
  getProjectDetails,
  createProjectDetails,
  updateProjectDetails,
  getRecentProjects,
  getProjectMenu,
  getOngoingProjects,
  getCompletedProjects,
} = require("../controllers/projectDetailsController");

/* =====================================================
   PROJECT MENU (ONGOING + COMPLETED)
===================================================== */
router.get("/menu", getProjectMenu);

/* =====================================================
   ONGOING & COMPLETED LISTS
   (MUST BE BEFORE /:projectId)
===================================================== */
router.get("/ongoing", getOngoingProjects);
router.get("/completed", getCompletedProjects);

/* =====================================================
   RECENT PROJECTS
===================================================== */
router.get("/recent", getRecentProjects);

/* =====================================================
   GET PROJECT DETAILS
===================================================== */
router.get("/:projectId", getProjectDetails);

/* =====================================================
   CREATE PROJECT DETAILS
===================================================== */
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
  ]),
  createProjectDetails
);

/* =====================================================
   UPDATE PROJECT DETAILS
===================================================== */
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
  ]),
  updateProjectDetails
);

module.exports = router;
