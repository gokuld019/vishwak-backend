const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");

/* =====================================================
   IMPORT CONTROLLER FUNCTIONS
===================================================== */
const {
  getProjectDetails,
  createProjectDetails,
  updateProjectDetails,
  getRecentProjects,
  getProjectMenu,
  getOngoingProjects,
  getCompletedProjects,
  getProjectsByCategory,   // ✅ IMPORTANT (ADDED)
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
   PROJECTS BY CATEGORY (FOR ENQUIRY DROPDOWN)
===================================================== */
router.get("/by-category", getProjectsByCategory);

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
