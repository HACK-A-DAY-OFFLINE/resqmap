const asyncHandler = require('express-async-handler');
const driveClient = require('../config/drive'); 
const fs = require('fs'); 

// @desc    Upload File to Google Drive
// @route   POST /api/uploads
const uploadFile = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('No file uploaded');
    }
    
    const localFilePath = req.file.path; 
    const fileMimeType = req.file.mimetype;
    const fileName = req.file.originalname;

    let driveFileId;
    
    try {
        // --- 1. UPLOAD FILE TO GOOGLE DRIVE ---
        const response = await driveClient.files.create({
            requestBody: {
                name: fileName,
                mimeType: fileMimeType,
            },
            media: {
                mimeType: fileMimeType,
                body: fs.createReadStream(localFilePath),
            },
            fields: 'id',
        });

        driveFileId = response.data.id;

        // --- 2. CLEAN UP LOCAL FILE ---
        fs.unlinkSync(localFilePath); 
        
        res.status(200).json({
            message: 'File successfully uploaded and stored on Google Drive',
            fileId: driveFileId, // Now returns the Drive ID
        });

    } catch (error) {
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        console.error('Drive Upload Error:', error);
        res.status(500);
        throw new Error('Failed to upload file to Google Drive');
    }
});

module.exports = { uploadFile };
