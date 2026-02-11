// routes/paymentPlanRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/Priceupload"); // same as price list (upload.none())

const {
  addPaymentPlan,
  getPaymentPlan,
  updatePaymentItem,
  deletePaymentItem,
} = require("../controllers/paymentPlanController");

// POST – add multiple rows
router.post("/", upload.none(), addPaymentPlan);

// GET – all rows for a project
router.get("/:projectId", getPaymentPlan);

// PUT – update single row
router.put("/:id", upload.none(), updatePaymentItem);

// DELETE – delete single row
router.delete("/:id", deletePaymentItem);

module.exports = router;
