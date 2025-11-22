const asyncHandler = require('express-async-handler');
const Report = require('../models/Report');
const driveClient = require('../config/drive'); 
const fs = require('fs'); 

// @desc    Get reports
// @route   GET /api/reports
const getReports = asyncHandler(async (req, res) => {
    // Finds reports associated with the logged-in user
    const reports = await Report.find({ user: req.user.id });
    res.status(200).json(reports);
});

// @desc    Set report (Handles data and optional file upload to Drive)
// @route   POST /api/reports
const createReport = asyncHandler(async (req, res) => {
    // 1. INPUT VALIDATION (Checking for required location fields)
    if (!req.body.title || !req.body.description || !req.body.latitude || !req.body.longitude) {
        res.status(400);
        throw new Error('Please include title, description, latitude, and longitude.');
    }

    let driveFileId = null;

    if (req.file) {
        // 2. GOOGLE DRIVE UPLOAD & CLEANUP
        const localFilePath = req.file.path; 
        const fileMimeType = req.file.mimetype;
        const fileName = req.file.originalname;
        
        try {
            const response = await driveClient.files.create({
                requestBody: { 
                    name: fileName, 
                    mimeType: fileMimeType,
                    // Uses the folder ID from the .env file
                    parents: [process.env.GOOGLE_REPORT_FOLDER_ID], 
                },
                media: { 
                    mimeType: fileMimeType, 
                    body: fs.createReadStream(localFilePath) 
                },
                fields: 'id',
            });

            driveFileId = response.data.id;
            fs.unlinkSync(localFilePath); // Clean up local file

        } catch (error) {
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }
            console.error('Drive Upload Failed:', error);
            res.status(500);
            throw new Error('Report data saved, but failed to upload file to Google Drive. Check API permissions.');
        }
    }

    // 3. DATABASE SAVE
    const report = await Report.create({
        user: req.user.id,
        title: req.body.title,
        description: req.body.description,
        latitude: req.body.latitude, 
        longitude: req.body.longitude,
        driveFileId: driveFileId, // Links to the Google Drive file
    });

    res.status(200).json(report);
});

// @desc    Update report
// @route   PUT /api/reports/:id
const updateReport = asyncHandler(async (req, res) => {
    const report = await Report.findById(req.params.id);

    if (!report) {
        res.status(404);
        throw new Error('Report not found');
    }

    // Check ownership
    if (report.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized to update this report');
    }

    const updatedReport = await Report.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // Returns the updated document
    });

    res.status(200).json(updatedReport);
});

// @desc    Delete report
// @route   DELETE /api/reports/:id
const deleteReport = asyncHandler(async (req, res) => {
    const report = await Report.findById(req.params.id);

    if (!report) {
        res.status(404);
        throw new Error('Report not found');
    }

    // Check ownership
    if (report.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized to delete this report');
    }

    await report.deleteOne();
    res.status(200).json({ id: req.params.id });
});


module.exports = { getReports, createReport, updateReport, deleteReport };
