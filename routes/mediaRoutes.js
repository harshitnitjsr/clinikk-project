const express = require("express");
const Media = require("../models/Media.model");

// Create an Express router instance
const router = express.Router();
router.get("/", async (req, res) => {
  try {
    // Fetch all media items and populate the 'uploadedBy' field with 'username' and 'email'
    const media = await Media.find().populate("uploadedBy", "username email");
    // Send the media items as a JSON response
    res.json(media);
  } catch (err) {
    // Handle errors and send a 500 status with an error message
    res.status(500).json({ message: "Error fetching media", error: err });
  }
});

router.get("/:id", async (req, res) => {
  try {
    // Find the media item by ID and populate the 'uploadedBy' field with 'username' and 'email'
    const media = await Media.findById(req.params.id).populate(
      "uploadedBy",
      "username email"
    );
    // If media item is not found, return a 404 status with a message
    if (!media) return res.status(404).json({ message: "Media not found" });
    // Send the media item as a JSON response
    res.json(media);
  } catch (err) {
    // Handle errors and send a 500 status with an error message
    res.status(500).json({ message: "Error fetching media", error: err });
  }
});

// Export the router to be used in the main application
module.exports = router;
