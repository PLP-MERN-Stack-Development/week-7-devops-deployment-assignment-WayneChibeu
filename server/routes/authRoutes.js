const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
// eslint-disable-next-line no-unused-vars
const { validateRegistration, validateLogin, handleValidationErrors: _handleValidationErrors } = require('../middleware/validation');
const { profileValidationRules, validateProfile } = require('../middleware/profileValidation');
const multer = require('multer');
const upload = multer({ limits: { fileSize: 2 * 1024 * 1024 } }); // 2MB limit
const { updateProfile, getProfile } = require('../controllers/profileController');

router.post('/register', validateRegistration, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Profile management
router.get('/profile', protect, getProfile);
router.put(
  '/profile',
  protect,
  upload.single('profilePicture'),
  profileValidationRules,
  validateProfile,
  updateProfile
);

module.exports = router;