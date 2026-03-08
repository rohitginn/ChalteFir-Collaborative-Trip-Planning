import express from 'express';
import { createTrip, getUserTrips, getTripById, updateTripMembers } from '../controllers/tripController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(protect, getUserTrips).post(protect, createTrip);
router.route('/:id').get(protect, getTripById);
router.route('/:id/members').put(protect, updateTripMembers);

export default router;
