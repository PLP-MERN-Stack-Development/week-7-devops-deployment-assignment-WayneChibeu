const express = require('express');
const router = express.Router();
const {
  addActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
  exportActivities
} = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');
const { validateActivity } = require('../middleware/validation');

// All activity routes are protected
router.get('/export', protect, exportActivities);

router.route('/')
  .post(protect, validateActivity, addActivity)
  .get(protect, getActivities);

router.route('/:id')
  .get(protect, getActivityById)
  .put(protect, validateActivity, updateActivity)
  .delete(protect, deleteActivity);

module.exports = router;