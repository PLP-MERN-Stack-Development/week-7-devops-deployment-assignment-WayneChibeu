const ProgressPhoto = require('../models/ProgressPhoto');

// @desc    Upload a new progress photo
// @route   POST /api/progress-photos
// @access  Private
const uploadProgressPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const { caption, date } = req.body;
    const image = req.file.buffer.toString('base64');
    const progressPhoto = new ProgressPhoto({
      userId: req.user._id,
      date: date || Date.now(),
      caption,
      image
    });
    await progressPhoto.save();
    res.status(201).json({ message: 'Progress photo uploaded', progressPhoto });
  } catch (error) {
    res.status(500).json({ message: 'Server error while uploading progress photo', error: error.message });
  }
};

// @desc    List all progress photos for the authenticated user
// @route   GET /api/progress-photos
// @access  Private
const listProgressPhotos = async (req, res) => {
  try {
    const photos = await ProgressPhoto.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching progress photos', error: error.message });
  }
};

// @desc    Get a single progress photo by ID
// @route   GET /api/progress-photos/:id
// @access  Private
const getProgressPhotoById = async (req, res) => {
  try {
    const photo = await ProgressPhoto.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: 'Progress photo not found' });
    }
    if (photo.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this photo' });
    }
    res.json(photo);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching progress photo', error: error.message });
  }
};

// @desc    Delete a progress photo by ID
// @route   DELETE /api/progress-photos/:id
// @access  Private
const deleteProgressPhoto = async (req, res) => {
  try {
    const photo = await ProgressPhoto.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: 'Progress photo not found' });
    }
    if (photo.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this photo' });
    }
    await photo.deleteOne();
    res.json({ message: 'Progress photo deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting progress photo', error: error.message });
  }
};

module.exports = {
  uploadProgressPhoto,
  listProgressPhotos,
  getProgressPhotoById,
  deleteProgressPhoto,
}; 