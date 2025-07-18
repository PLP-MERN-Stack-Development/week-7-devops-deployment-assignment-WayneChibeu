const express = require('express');
const router = express.Router();
const {
  addWeight,
  getWeights,
  getWeightById,
  updateWeight,
  deleteWeight,
  exportWeights
} = require('../controllers/weightController');
const { protect } = require('../middleware/authMiddleware');
const { validateWeight } = require('../middleware/validation');

// All weight routes are protected
router.get('/export', protect, exportWeights);

router.route('/')
  .post(protect, validateWeight, addWeight)
  .get(protect, getWeights);

router.route('/:id')
  .get(protect, getWeightById)
  .put(protect, validateWeight, updateWeight)
  .delete(protect, deleteWeight);

module.exports = router;