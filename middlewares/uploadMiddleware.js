// Import the required libraries
const multer = require("multer"); // Multer is a middleware for handling multipart/form-data, primarily used for file uploads.
const multerS3 = require("multer-s3"); // Multer-S3 is a storage engine for Multer to upload files directly to AWS S3.
const s3 = require("../config/awsConfig"); // Import the configured AWS S3 client from the awsConfig file.

// Configure Multer to use Multer-S3 as the storage engine
const upload = multer({
  storage: multerS3({
    s3: s3, // Pass the configured AWS S3 client
    bucket: process.env.AWS_S3_BUCKET_NAME, // Specify the S3 bucket name where files will be uploaded (fetched from environment variables)

    // Define a metadata function to add custom metadata to the uploaded file
    metadata: (req, file, cb) => {
      // Callback function to set metadata. Here, we add the field name as metadata.
      cb(null, { fieldName: file.fieldname });
    },

    // Define a key function to determine the file's path and name in the S3 bucket
    key: (req, file, cb) => {
      // Callback function to set the file's key (path + filename).
      // Here, we use a timestamp and the original file name to ensure uniqueness.
      cb(null, `media/${Date.now()}_${file.originalname}`);
    },
  }),
});

// Export the configured Multer middleware to be used in other parts of the application
module.exports = upload;
