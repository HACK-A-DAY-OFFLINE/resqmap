// src/config/drive.js

const { google } = require('googleapis');
const dotenv = require('dotenv');

dotenv.config();

// Assuming you are using Service Account credentials or basic OAuth credentials
const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    // The redirect URI is only strictly necessary for user login flow, 
    // but often still included for service context.
    process.env.GOOGLE_REDIRECT_URI || 'urn:ietf:wg:oauth:2.0:oob' 
);

// NOTE: You must obtain and set a refresh token for non-interactive service use.
// For a full app, you would run an initial sign-in flow to get this.
// For testing, you can use a stored refresh token.
auth.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const driveClient = google.drive({
    version: 'v3',
    auth: auth,
});

module.exports = driveClient;
