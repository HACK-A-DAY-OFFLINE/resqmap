const express = require("express");
const { createReport, getReports } = require("../controllers/reportController.js");
const { protect } = require("../middleware/auth.js");

const router = express.Router();

router.post("/create", protect, createReport);
router.get("/", getReports);

module.exports = router;
