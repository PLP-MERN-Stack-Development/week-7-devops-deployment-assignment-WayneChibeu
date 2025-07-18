const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path if needed

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const secret = process.env.JWT_SECRET || 'fallback-secret-for-testing';
      const decoded = jwt.verify(token, secret);

      // Attach user to the request (without password)
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// For role-based authorization (optional for now, but good to have a placeholder)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) { // Assuming user has a 'role' field
      return res.status(403).json({ message: `User role ${req.user.role} is not authorized to access this route` });
    }
    next();
  };
};

module.exports = { protect, authorize };