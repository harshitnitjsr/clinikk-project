const express = require("express");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();
const uploadRoutes = require("./routes/uploadRoutes");
const streamRoutes = require("./routes/streamRoutes");
const userRoutes = require("./routes/authRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const connectDB = require("./config/mongoDb");
const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://clinikk-project-production.up.railway.app",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());
connectDB();
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "File Upload & Streaming API",
      version: "1.0.0",
      description: "API for uploading files to AWS S3 and streaming them",
    },
    servers: [{ url: "https://clinikk-project-production.up.railway.app" }],
  },
  apis: ["./docs/swagger.yaml"],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/upload", uploadRoutes);
app.use("/stream", streamRoutes);
app.use("/auth", userRoutes);
app.use("/media", mediaRoutes);
const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}
module.exports = app;
