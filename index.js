const express = require("express");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();
const apiRoutes = require("./routes/index");
const connectDB = require("./config/mongoDb");

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Enable CORS with specific origins and configurations
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Local development frontend
      "https://clinikk-project-production.up.railway.app", // Production backend
      "https://clinikk-frontend-demo.vercel.app", // Production frontend
    ],
    methods: ["GET", "POST"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

// Connect to MongoDB database
connectDB();

// Swagger API documentation setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "File Upload & Streaming API",
      version: "1.0.0",
      description: "API for uploading files to AWS S3 and streaming them",
    },
    servers: [{ url: "https://clinikk-project-production.up.railway.app" }], // Server URL for API
  },
  apis: ["./docs/swagger.yaml"], // Path to API documentation
};

// Generate Swagger documentation
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI for API documentation
app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Define API routes
app.use("/api/v1", apiRoutes);

// Define the port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;

// Start the server only if this file is executed directly (not required in tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the app instance for testing and modular use
module.exports = app;
