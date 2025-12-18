import express from 'express';
import {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
  getCategoryAnalytics,
  getDailyAnalytics,
  getProductivityScore
} from '../controllers/activityController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, createActivity)
  .get(protect, getActivities);

router.get('/analytics/category', protect, getCategoryAnalytics);
router.get('/analytics/daily', protect, getDailyAnalytics);
router.get('/analytics/productivity', protect, getProductivityScore);

router.route('/:id')
  .get(protect, getActivityById)
  .put(protect, updateActivity)
  .delete(protect, deleteActivity);

export default router;
