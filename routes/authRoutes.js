// Import necessary modules
const express = require("express");
const bcrypt = require("bcryptjs"); // For hashing passwords
const jwt = require("jsonwebtoken"); // For creating JSON Web Tokens
const User = require("../models/User.model"); // Import the User model

// Create an instance of an Express router
const router = express.Router();

// Set a custom random fallback for bcrypt to ensure secure random number generation
bcrypt.setRandomFallback((len) => {
  const buf = new Uint8Array(len);
  return buf.map(() => Math.floor(Math.random() * 256));
});

// Route for user registration
router.post("/register", async (req, res) => {
  try {
    // Extract username, email, and password from the request body
    const { username, email, password } = req.body;

    // Check if all required fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Generate a salt for hashing the password
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance with the hashed password
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Respond with a success message
    res.json({ message: "User registered successfully" });
  } catch (err) {
    // Log the error and respond with a 500 status code and error message
    console.error("Registration Error:", err);
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
});

// Route for user login
router.post("/login", async (req, res) => {
  try {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Find the user by email in the database
    const user = await User.findOne({ email });

    // If no user is found, respond with a 400 status code and error message
    if (!user) return res.status(400).json({ message: "User not found" });

    // Compare the provided password with the hashed password in the database
    const validPassword = await bcrypt.compare(password, user.password);

    // If the password is invalid, respond with a 400 status code and error message
    if (!validPassword)
      return res.status(400).json({ message: "Invalid password" });

    // Create a JSON Web Token (JWT) for the user
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    // Respond with the generated token
    res.json({ token });
  } catch (err) {
    // Log the error and respond with a 500 status code and error message
    res.status(500).json({ message: "Error logging in", error: err });
  }
});

// Export the router to be used in other parts of the application
module.exports = router;
