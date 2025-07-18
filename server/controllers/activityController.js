const Activity = require('../models/Activity'); // Import the Activity model
const { Parser } = require('json2csv');

// @desc    Add a new activity entry
// @route   POST /api/activities
// @access  Private
const addActivity = async (req, res) => {
  try {
    const { type, duration, unit, caloriesBurned, date, notes } = req.body;
    if (!type || duration === undefined || duration === null) {
      return res.status(400).json({ message: 'Type and duration are required' });
    }
    const newActivity = new Activity({
      userId: req.user._id,
      type,
      duration,
      unit,
      caloriesBurned,
      date,
      notes,
    });
    const savedActivity = await newActivity.save();
    res.status(201).json(savedActivity);
  } catch (error) {
    res.status(500).json({ message: 'Server error while adding activity', error: error.message });
  }
};

// @desc    Get all activity entries for the authenticated user, with pagination and filtering
// @route   GET /api/activities
// @access  Private
const getActivities = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { userId };
    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      if (req.query.startDate) filter.date.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.date.$lte = new Date(req.query.endDate);
    }
    if (req.query.type) {
      filter.type = req.query.type;
    }
    if (req.query.unit) {
      filter.unit = req.query.unit;
    }
    if (req.query.search) {
      filter.notes = { $regex: req.query.search, $options: 'i' };
    }

    const total = await Activity.countDocuments(filter);
    const activities = await Activity.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      activities,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching activities', error: error.message });
  }
};

// @desc    Get a single activity entry by ID
// @route   GET /api/activities/:id
// @access  Private
const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity entry not found' });
    }
    if (activity.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this entry' });
    }
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching activity entry', error: error.message });
  }
};

// @desc    Update an activity entry
// @route   PUT /api/activities/:id
// @access  Private
const updateActivity = async (req, res) => {
  try {
    const activityEntry = await Activity.findById(req.params.id);
    if (!activityEntry) {
      return res.status(404).json({ message: 'Activity entry not found' });
    }
    if (activityEntry.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this entry' });
    }
    const { type, duration, unit, caloriesBurned, date, notes } = req.body;
    if (type !== undefined) activityEntry.type = type;
    if (duration !== undefined) activityEntry.duration = duration;
    if (unit !== undefined) activityEntry.unit = unit;
    if (caloriesBurned !== undefined) activityEntry.caloriesBurned = caloriesBurned;
    if (date !== undefined) activityEntry.date = date;
    if (notes !== undefined) activityEntry.notes = notes;
    const updatedActivity = await activityEntry.save();
    res.json(updatedActivity);
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating activity entry', error: error.message });
  }
};

// @desc    Delete an activity entry
// @route   DELETE /api/activities/:id
// @access  Private
const deleteActivity = async (req, res) => {
  try {
    const activityEntry = await Activity.findById(req.params.id);
    if (!activityEntry) {
      return res.status(404).json({ message: 'Activity entry not found' });
    }
    if (activityEntry.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this entry' });
    }
    await activityEntry.deleteOne();
    res.json({ message: 'Activity entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting activity entry', error: error.message });
  }
};

// @desc    Export activity entries as CSV
// @route   GET /api/activities/export?format=csv
// @access  Private
const exportActivities = async (req, res) => {
  try {
    const userId = req.user._id;
    // Build filter (reuse from getActivities)
    const filter = { userId };
    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      if (req.query.startDate) filter.date.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.date.$lte = new Date(req.query.endDate);
    }
    if (req.query.type) {
      filter.type = req.query.type;
    }
    if (req.query.unit) {
      filter.unit = req.query.unit;
    }
    if (req.query.search) {
      filter.notes = { $regex: req.query.search, $options: 'i' };
    }
    const activities = await Activity.find(filter).sort({ date: -1 });
    const fields = ['date', 'type', 'duration', 'unit', 'caloriesBurned', 'notes'];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(activities);
    res.header('Content-Type', 'text/csv');
    res.attachment('activities.csv');
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Server error while exporting activities', error: error.message });
  }
};

module.exports = {
  addActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
  exportActivities,
};