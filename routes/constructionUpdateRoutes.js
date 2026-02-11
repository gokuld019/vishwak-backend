const express = require("express");
const router = express.Router();

const uploadConstruction = require("../middlewares/uploadConstruction");

const {
  addConstructionUpdates,
  getConstructionUpdates,
  updateConstructionUpdate,
  deleteConstructionUpdate,
} = require("../controllers/constructionUpdateController");

// POST — Multiple updates with multiple images
router.post("/", uploadConstruction.array("images", 10), addConstructionUpdates);

// GET — Fetch project updates
router.get("/:projectId", getConstructionUpdates);

// PUT — Update single record (allow image)
router.put("/:id", uploadConstruction.single("image"), updateConstructionUpdate);

// DELETE — Remove a record
router.delete("/:id", deleteConstructionUpdate);

module.exports = router;
