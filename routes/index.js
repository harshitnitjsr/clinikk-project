// Import the Express framework
const express = require("express");

// Import route handlers for different functionalities
const uploadRoutes = require("./uploadRoutes"); // Handles file uploads
const streamRoutes = require("./streamRoutes"); // Handles media streaming
const authRoutes = require("./authRoutes"); // Handles user authentication
const mediaRoutes = require("./mediaRoutes"); // Handles media-related operations

// Import the authentication middleware to protect routes
const authMiddleware = require("../middlewares/authMiddleware");

// Create an instance of an Express Router
const router = express.Router();

// Define routes and attach the appropriate route handlers

// Route for file uploads, protected by authentication middleware
router.use("/upload", authMiddleware, uploadRoutes);

// Route for media streaming, no authentication required
router.use("/stream", streamRoutes);

// Route for authentication (e.g., login, register), no authentication required
router.use("/auth", authRoutes);

// Route for media-related operations, no authentication required
router.use("/media", mediaRoutes);

// Export the router to be used in the main application
module.exports = router;
