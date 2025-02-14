const express = require("express");
const upload = require("../middlewares/uploadMiddleware");
const Media = require("../models/Media.model");
const router = express.Router();

router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "File upload failed" });
  }
  const newMedia = new Media({
    filename: req.file.originalname,
    url: req.file.location,
    uploadedBy: req.user._id,
  });
  await newMedia.save();

  res.json({ message: "File uploaded successfully", url: req.file.location });
});

module.exports = router;
