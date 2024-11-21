const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { admin } = require("../db");
const { z } = require("zod");

const router = express.Router();

// Make sure there's no space around the equal sign in your .env file
// JWT_SECRET_KEY=helloankit
const SECRET_KEY = process.env.JWT_SECRET_KEY || "helloankit";

// Admin login route
router.post("/login", async (req, res) => {
  try {
    // Validate request data
    const validateData = z
      .object({
        email: z.string().email("Invalid email format"),
        password: z.string(),
      })
      .parse({
        email: req.body.email,
        password: req.body.password,
      });

    const { email, password } = validateData;

    // Check if the admin exists
    let single_admin = await admin.findOne({ email });

    if (!single_admin) {
      // Create a new admin with a hashed password
      const hashedPassword = await bcrypt.hash(password, 10);
      single_admin = new admin({
        email,
        password: hashedPassword,
      });
      await single_admin.save();

      return res.status(201).json({
        message: "Admin account created. Please log in with the same credentials.",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      password,
      single_admin.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate JWT token with expiration
    const token = jwt.sign(
      { 
        id: single_admin._id, 
        email: single_admin.email 
      },
      SECRET_KEY,
      { expiresIn: '24h' } // Token expires in 24 hours
    );

    // Return token with Bearer prefix
    return res.status(200).json({ 
      message: "Login successful.", 
      token: `Bearer ${token}` ,
      HowToUse:   "use this token as where  Key = authorization and in Value = token without inverted commas"
    });

  } catch (error) {
    console.error("Error during admin login:", error);
    return res.status(500).json({ 
      message: "An error occurred.", 
      error: error.message 
    });
  }
});

module.exports = router;