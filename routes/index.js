const express = require("express")

const uploadRoutes = require("./uploadRoutes")
const streamRoutes = require("./streamRoutes")
const authRoutes = require("./authRoutes")
const mediaRoutes = require("./mediaRoutes")

const router = express.Router()

// API v1 routes
router.use("/upload", uploadRoutes)
router.use("/stream", streamRoutes)
router.use("/auth", authRoutes)
router.use("/media", mediaRoutes)

module.exports = router;
