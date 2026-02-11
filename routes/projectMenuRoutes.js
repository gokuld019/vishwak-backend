const express = require("express");
const router = express.Router();
const { getMenuProjects } = require("../controllers/projectMenuController");

router.get("/", getMenuProjects);

module.exports = router;
