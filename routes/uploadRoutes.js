const express = require("express")
const upload = require("../middlewares/uploadMiddleware")
const Media = require("../models/Media.model")
const authMiddleware = require("../middlewares/authMiddleware")

const router = express.Router()

router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "File upload failed" })
  }
  console.log("object")
  const newMedia = new Media({
    filename: req.file.originalname,
    url: req.file.location,
    uploadedBy: "67ae498370ce59cea73135ab",
  })
  await newMedia.save()
  console.log(req.file.originalname)
  res.json({ message: "File uploaded successfully", url: req.file.location })
})

module.exports = router;
