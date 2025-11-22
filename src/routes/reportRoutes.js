// src/routes/reportRoutes.js

const express = require('express');
const router = express.Router();
const { getReports, createReport, updateReport, deleteReport } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload'); // <--- IMPORT MULTER

// Use upload.single('file') middleware before the createReport controller
router.route('/').get(protect, getReports).post(protect, upload.single('file'), createReport); 
router.route('/:id').put(protect, updateReport).delete(protect, deleteReport);

module.exports = router;
