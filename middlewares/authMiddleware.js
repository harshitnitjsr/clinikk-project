// Import the jsonwebtoken library to handle JWT (JSON Web Tokens)
const jwt = require("jsonwebtoken");

// Define an asynchronous middleware function for authentication
const authMiddleware = async (req, res, next) => {
  // Extract the token from the "Authorization" header in the request
  const token = req.header("Authorization") || req.headers.token;

  // If no token is provided, return a 401 Unauthorized response
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    // Verify the token using the secret key stored in environment variables
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the verified user information to the request object
    req.user = verified;

    // Call the next middleware or route handler
    next();
  } catch (err) {
    // If token verification fails, return a 400 Bad Request response
    res.status(400).json({ message: "Invalid token" });
  }
};

// Export the middleware function to be used in other parts of the application
module.exports = authMiddleware;
