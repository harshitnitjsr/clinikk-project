const express = require("express")
const Media = require("../models/Media.model")
const authMiddleware = require("../middlewares/authMiddleware")

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const media = await Media.find().populate("uploadedBy", "username email")
    res.json(media)
  } catch (err) {
    res.status(500).json({ message: "Error fetching media", error: err })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const media = await Media.findById(req.params.id).populate(
      "uploadedBy",
      "username email"
    )
    if (!media) return res.status(404).json({ message: "Media not found" })
    res.json(media)
  } catch (err) {
    res.status(500).json({ message: "Error fetching media", error: err })
  }
})

module.exports = router;
