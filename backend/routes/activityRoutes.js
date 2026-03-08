import express from 'express';
import { createActivity, getActivities, updateActivity, deleteActivity, addComment } from '../controllers/activityController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Note: getActivities uses req.params.tripId
router.route('/').post(protect, createActivity);
router.route('/trip/:tripId').get(protect, getActivities);
router.route('/:id')
    .put(protect, updateActivity)
    .delete(protect, deleteActivity);
router.route('/:id/comment').post(protect, addComment);

export default router;
