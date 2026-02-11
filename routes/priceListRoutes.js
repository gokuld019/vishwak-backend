const express = require("express");
const router = express.Router();
const upload = require("../middlewares/Priceupload"); // <-- MUST EXIST

const {
  addPriceList,
  getPriceList,
  updatePrice,  // <-- MUST BE CORRECT
  deletePrice   // <-- MUST BE CORRECT
} = require("../controllers/priceListController");

// POST – Add multiple rows
router.post("/", upload.none(), addPriceList);

// GET – All rows for project
router.get("/:projectId", getPriceList);

// PUT – Update single row
router.put("/:id", upload.none(), updatePrice);

// DELETE – Remove row
router.delete("/:id", deletePrice);

module.exports = router;
