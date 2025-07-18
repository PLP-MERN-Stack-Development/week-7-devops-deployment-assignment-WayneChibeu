const mongoose = require('mongoose');

const progressPhotoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  caption: {
    type: String,
    trim: true,
    maxlength: 200
  },
  image: {
    type: String, // base64 string
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ProgressPhoto', progressPhotoSchema); 