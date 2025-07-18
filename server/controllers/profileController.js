const User = require('../models/User');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

// GET /api/auth/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -loginAttempts -lockUntil');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    logger.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

// PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { email, firstName, lastName, currentPassword, newPassword } = req.body;
    let updatedFields = {};

    // Update name
    if (firstName !== undefined) updatedFields.firstName = firstName;
    if (lastName !== undefined) updatedFields.lastName = lastName;

    // Update email (require current password)
    if (email && email !== user.email) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password required to change email' });
      }
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
      // Check for duplicate email
      const existing = await User.findOne({ email });
      if (existing && existing._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      updatedFields.email = email;
    }

    // Update password (require current password)
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password required to change password' });
      }
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
      const salt = await bcrypt.genSalt(12);
      updatedFields.password = await bcrypt.hash(newPassword, salt);
    }

    // Handle profile picture upload (optional)
    if (req.file) {
      // Store as base64 string (for demo; in production, use cloud storage)
      updatedFields.profilePicture = req.file.buffer.toString('base64');
    }

    Object.assign(user, updatedFields);
    await user.save();

    logger.info('User profile updated', { userId: user._id });
    res.json({ message: 'Profile updated successfully', user: user.toJSON() });
  } catch (error) {
    logger.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

module.exports = { getProfile, updateProfile }; 