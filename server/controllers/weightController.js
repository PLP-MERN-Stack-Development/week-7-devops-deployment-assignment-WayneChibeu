const Weight = require('../models/Weight'); // Import the Weight model
const { Parser } = require('json2csv');

// @desc    Add a new weight entry
// @route   POST /api/weights
// @access  Private
const addWeight = async (req, res) => {
  try {
    const { weight, unit, date, notes } = req.body;
    if (weight === undefined || weight === null) {
      return res.status(400).json({ message: 'Weight is required' });
    }
    const newWeight = new Weight({
      userId: req.user._id,
      weight,
      unit,
      date,
      notes,
    });
    const savedWeight = await newWeight.save();
    res.status(201).json(savedWeight);
  } catch (error) {
    res.status(500).json({ message: 'Server error while adding weight', error: error.message });
  }
};

// @desc    Get all weight entries for the authenticated user, with pagination and filtering
// @route   GET /api/weights
// @access  Private
const getWeights = async (req, res) => {
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
    if (req.query.unit) {
      filter.unit = req.query.unit;
    }
    if (req.query.search) {
      filter.notes = { $regex: req.query.search, $options: 'i' };
    }

    const total = await Weight.countDocuments(filter);
    const weights = await Weight.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      weights,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching weights', error: error.message });
  }
};

// @desc    Get a single weight entry by ID
// @route   GET /api/weights/:id
// @access  Private
const getWeightById = async (req, res) => {
  try {
    const weight = await Weight.findById(req.params.id);
    if (!weight) {
      return res.status(404).json({ message: 'Weight entry not found' });
    }
    if (weight.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this entry' });
    }
    res.json(weight);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching weight entry', error: error.message });
  }
};

// @desc    Update a weight entry
// @route   PUT /api/weights/:id
// @access  Private
const updateWeight = async (req, res) => {
  try {
    const weightEntry = await Weight.findById(req.params.id);
    if (!weightEntry) {
      return res.status(404).json({ message: 'Weight entry not found' });
    }
    if (weightEntry.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this entry' });
    }
    const { weight, unit, date, notes } = req.body;
    if (weight !== undefined) weightEntry.weight = weight;
    if (unit !== undefined) weightEntry.unit = unit;
    if (date !== undefined) weightEntry.date = date;
    if (notes !== undefined) weightEntry.notes = notes;
    const updatedWeight = await weightEntry.save();
    res.json(updatedWeight);
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating weight entry', error: error.message });
  }
};

// @desc    Delete a weight entry
// @route   DELETE /api/weights/:id
// @access  Private
const deleteWeight = async (req, res) => {
  try {
    const weightEntry = await Weight.findById(req.params.id);
    if (!weightEntry) {
      return res.status(404).json({ message: 'Weight entry not found' });
    }
    if (weightEntry.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this entry' });
    }
    await weightEntry.deleteOne();
    res.json({ message: 'Weight entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting weight entry', error: error.message });
  }
};

// @desc    Export weight entries as CSV
// @route   GET /api/weights/export?format=csv
// @access  Private
const exportWeights = async (req, res) => {
  try {
    const userId = req.user._id;
    // Build filter (reuse from getWeights)
    const filter = { userId };
    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      if (req.query.startDate) filter.date.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.date.$lte = new Date(req.query.endDate);
    }
    if (req.query.unit) {
      filter.unit = req.query.unit;
    }
    if (req.query.search) {
      filter.notes = { $regex: req.query.search, $options: 'i' };
    }
    const weights = await Weight.find(filter).sort({ date: -1 });
    const fields = ['date', 'weight', 'unit', 'notes'];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(weights);
    res.header('Content-Type', 'text/csv');
    res.attachment('weights.csv');
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Server error while exporting weights', error: error.message });
  }
};

module.exports = {
  addWeight,
  getWeights,
  getWeightById,
  updateWeight,
  deleteWeight,
  exportWeights,
};