const express = require("express");
const router = express.Router();

const { saveSmartInvestment, getSmartInvestment } = require("../controllers/smartInvestmentController");

// POST / PUT
router.post("/", saveSmartInvestment);

// GET by projectId
router.get("/:projectId", getSmartInvestment);

module.exports = router;
