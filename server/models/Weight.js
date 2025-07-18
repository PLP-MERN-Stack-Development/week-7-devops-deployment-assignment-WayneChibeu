const mongoose = require('mongoose');

const weightSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // Reference to the User model
  },
  weight: {
    type: Number,
    required: true,
    min: [0, 'Weight cannot be negative']
  },
  unit: {
    type: String,
    enum: ['kg', 'lbs'], // Enforce specific units
    default: 'kg'
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

const Weight = mongoose.model('Weight', weightSchema);
module.exports = Weight;