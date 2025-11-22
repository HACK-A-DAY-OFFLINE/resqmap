// src/utils/validators.js

/**
 * Checks if a string is null, empty, or only contains whitespace.
 * @param {string} str - The string to check.
 * @returns {boolean} True if the string is empty or invalid, false otherwise.
 */
const isEmpty = (str) => {
    return !str || str.trim().length === 0;
};

/**
 * Basic email format validation.
 * @param {string} email - The email string to check.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
const isValidEmail = (email) => {
    // Regex for basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Checks if a given MongoDB ObjectId is valid.
 * @param {string} id - The string to validate as an ObjectId.
 * @returns {boolean} True if the ID is valid, false otherwise.
 */
const isValidObjectId = (id) => {
    // Mongoose ObjectId has a specific length (24 characters) and format
    return (id.match(/^[0-9a-fA-F]{24}$/) !== null);
};

module.exports = {
    isEmpty,
    isValidEmail,
    isValidObjectId,
};
