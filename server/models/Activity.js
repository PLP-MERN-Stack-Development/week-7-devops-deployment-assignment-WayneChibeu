const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // Reference to the User model
  },
  type: {
    type: String,
    required: true,
    trim: true
    // Could add enum for predefined activity types later: enum: ['Running', 'Walking', 'Gym Workout', 'Yoga', ...]
  },
  duration: {
    type: Number,
    required: true,
    min: [0, 'Duration cannot be negative']
  },
  unit: {
    type: String,
    enum: ['minutes', 'hours'], // Enforce specific units
    default: 'minutes'
  },
  caloriesBurned: {
    type: Number,
    min: [0, 'Calories burned cannot be negative'],
    default: 0
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

const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;