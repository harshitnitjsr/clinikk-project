const express = require("express");

const uploadRoutes = require("./uploadRoutes");
const streamRoutes = require("./streamRoutes");
const authRoutes = require("./authRoutes");
const mediaRoutes = require("./mediaRoutes");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use("/upload", authMiddleware, uploadRoutes);
router.use("/stream", streamRoutes);
router.use("/auth", authRoutes);
router.use("/media", mediaRoutes);

module.exports = router;
