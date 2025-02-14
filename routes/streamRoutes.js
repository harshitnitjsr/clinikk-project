const express = require("express");
const { HeadObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/awsConfig"); // Import the configured S3 client

const router = express.Router(); // Create an Express router
const bucketName = process.env.AWS_S3_BUCKET_NAME; // Get the S3 bucket name from environment variables

// Define a GET route to handle requests for streaming files by their key
router.get("/:key", async (req, res) => {
  try {
    const { key } = req.params; // Extract the file key from the URL parameters
    const params = { Bucket: bucketName, Key: `media/${key}` }; // Define S3 parameters (bucket and file key)

    // Retrieve metadata about the file using the HeadObjectCommand
    const head = await s3.send(new HeadObjectCommand(params));
    const fileSize = head.ContentLength; // Get the total size of the file

    const range = req.headers.range; // Check if the request includes a Range header (for partial content)

    if (range) {
      // If a Range header is present, handle partial content requests
      const [start, end] = range
        .replace(/bytes=/, "") // Remove the "bytes=" prefix
        .split("-") // Split the range into start and end
        .map(Number); // Convert the values to numbers

      const chunkStart = start || 0; // Default to the start of the file if no start is specified
      const chunkEnd = end || fileSize - 1; // Default to the end of the file if no end is specified
      const chunkSize = chunkEnd - chunkStart + 1; // Calculate the size of the chunk to be sent

      // Set the response headers for partial content
      res.writeHead(206, {
        "Content-Range": `bytes ${chunkStart}-${chunkEnd}/${fileSize}`, // Specify the range being sent
        "Accept-Ranges": "bytes", // Indicate that the server supports range requests
        "Content-Length": chunkSize, // Specify the length of the chunk
        "Content-Type": head.ContentType, // Set the content type of the file
      });

      // Fetch the specified chunk of the file from S3
      const stream = (
        await s3.send(
          new GetObjectCommand({
            ...params,
            Range: `bytes=${chunkStart}-${chunkEnd}`, // Specify the range to fetch
          })
        )
      ).Body; // Get the readable stream for the chunk

      stream.pipe(res); // Stream the chunk directly to the response
    } else {
      // If no Range header is present, send the entire file
      res.writeHead(200, {
        "Content-Length": fileSize, // Specify the total file size
        "Content-Type": head.ContentType, // Set the content type of the file
      });

      // Fetch the entire file from S3
      const stream = (await s3.send(new GetObjectCommand(params))).Body; // Get the readable stream for the file
      stream.pipe(res); // Stream the file directly to the response
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error streaming file:", error);
    res
      .status(500)
      .json({ error: "Error streaming file", details: error.message }); // Send an error response
  }
});

module.exports = router; // Export the router for use in the application
