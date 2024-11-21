
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET_KEY || "helloankit";

function authenticateAdmin(req, res, next) {
  try {
    // Check for Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: 'Access denied. No token provided.',
        whatNow: 'Please login to obtain a token.',
        where:"Go to ( POST ) http://localhost:5000/api/v1/admin/login to generate token"
      });
    }

    // Verify token format
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Invalid token format.',
        whatNow: 'Token must be provided in the format: Bearer <token>'
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Verify token
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        console.error('Token verification error:', err);

        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({
            message: 'Token has expired.',
            whatNow: 'Please login again to obtain a new token.'
          });
        }

        return res.status(403).json({
          message: 'Invalid token.',
          whatNow: 'Please provide a valid token.'
        });
      }

      // Add decoded user to request
      req.user = decoded;
      next();
    });
  } catch (err) {
    console.error('Authentication error:', err);
    return res.status(500).json({
      message: 'Internal server error during authentication.',
      whatNow: 'Please try again later.'
    });
  }
}

module.exports = { authenticateAdmin };