const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: [true, 'Please add a title'] },
    description: { type: String, required: [true, 'Please add a description'] },
    status: { 
        type: String, 
        enum: ['New', 'In Progress', 'Resolved'], 
        default: 'New' 
    },
    // New Fields for Location and Drive Link
    latitude: { type: Number, required: [true, 'Please provide latitude'] },
    longitude: { type: Number, required: [true, 'Please provide longitude'] },
    driveFileId: { type: String } // Renamed from filePath
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
