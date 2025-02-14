// Import necessary modules
const express = require("express");
const upload = require("../middlewares/uploadMiddleware"); // Middleware for handling file uploads
const Media = require("../models/Media.model"); // Mongoose model for Media

// Create an Express router
const router = express.Router();

// Define a POST route for uploading a file
router.post("/", upload.single("file"), async (req, res) => {
  // Check if the file was successfully uploaded
  if (!req.file) {
    // If no file is found, return a 400 Bad Request response with an error message
    return res.status(400).json({ error: "File upload failed" });
  }

  // Create a new Media document with the file details
  const newMedia = new Media({
    filename: req.file.originalname, // Original name of the uploaded file
    url: req.file.location, // URL where the file is stored (e.g., in cloud storage)
    uploadedBy: req.user._id, // ID of the user who uploaded the file (assuming user is authenticated)
  });

  // Save the new Media document to the database
  await newMedia.save();

  // Return a success response with the file URL
  res.json({ message: "File uploaded successfully", url: req.file.location });
});

// Export the router to be used in other parts of the application
module.exports = router;
