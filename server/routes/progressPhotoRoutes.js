const express = require('express');
const router = express.Router();
const { uploadProgressPhoto, listProgressPhotos, getProgressPhotoById, deleteProgressPhoto } = require('../controllers/progressPhotoController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// Upload a new progress photo
router.post('/', protect, upload.single('image'), uploadProgressPhoto);

// List all progress photos for the user
router.get('/', protect, listProgressPhotos);

// Get a single progress photo by ID
router.get('/:id', protect, getProgressPhotoById);

// Delete a progress photo by ID
router.delete('/:id', protect, deleteProgressPhoto);

module.exports = router; 