const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation failed', { 
      path: req.path, 
      method: req.method, 
      errors: errors.array() 
    });
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors: errors.array() 
    });
  }
  next();
};

// Validation rules for user registration
const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  handleValidationErrors
];

// Validation rules for user login
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Validation rules for weight entries
const validateWeight = [
  body('weight')
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Weight must be a positive number between 0 and 1000'),
  body('unit')
    .isIn(['kg', 'lbs'])
    .withMessage('Unit must be either kg or lbs'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO date'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
  handleValidationErrors
];

// Validation rules for activity entries
const validateActivity = [
  body('type')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Activity type must be between 1 and 100 characters'),
  body('duration')
    .isFloat({ min: 0, max: 1440 })
    .withMessage('Duration must be a positive number between 0 and 1440'),
  body('unit')
    .isIn(['minutes', 'hours'])
    .withMessage('Unit must be either minutes or hours'),
  body('caloriesBurned')
    .optional()
    .isFloat({ min: 0, max: 10000 })
    .withMessage('Calories burned must be a positive number between 0 and 10000'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO date'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateWeight,
  validateActivity,
  handleValidationErrors
}; 