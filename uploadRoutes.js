const express = require("express");
const upload = require("../middleware/upload.js");
const { uploadImage } = require("../controllers/uploadController.js");

const router = express.Router();

// Single image upload
router.post("/", upload.single("image"), uploadImage);

module.exports = router;
