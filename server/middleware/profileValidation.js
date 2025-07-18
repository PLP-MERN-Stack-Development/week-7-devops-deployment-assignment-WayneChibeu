const { body, validationResult } = require('express-validator');

// Validation rules for profile data
const profileValidationRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  // Add more fields as needed
];

// Middleware to check validation result
const validateProfile = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  profileValidationRules,
  validateProfile,
}; 