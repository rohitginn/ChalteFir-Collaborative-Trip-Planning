import Activity from '../models/Activity.js';
import Trip from '../models/Trip.js';

// Helper to check user access to a trip
const checkAccess = async (tripId, userId, requireEditor = false) => {
    const trip = await Trip.findById(tripId);
    if (!trip) throw new Error('Trip not found');

    const member = trip.members.find(m => m.user.toString() === userId.toString());
    if (!member) throw new Error('Not authorized for this trip');

    if (requireEditor && member.role === 'Viewer') {
        throw new Error('Not authorized to modify this trip');
    }

    return trip;
};

// Create a new activity
export const createActivity = async (req, res) => {
    try {
        const { tripId, date, timing, place, budget, checklists } = req.body;

        await checkAccess(tripId, req.user._id, true);

        const activity = new Activity({
            tripId,
            date,
            timing,
            place,
            budget,
            checklists
        });

        const createdActivity = await activity.save();
        res.status(201).json(createdActivity);
    } catch (error) {
        res.status(403).json({ message: error.message });
    }
};

// Get activities for a specific trip (can filter by date)
export const getActivities = async (req, res) => {
    try {
        const { tripId } = req.params;
        const { date } = req.query;

        await checkAccess(tripId, req.user._id, false);

        let query = { tripId };

        // If a date is provided, match exactly that day (ignoring time)
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setUTCHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setUTCHours(23, 59, 59, 999);
            query.date = { $gte: startOfDay, $lte: endOfDay };
        }

        const activities = await Activity.find(query).sort({ order: 1, date: 1 }).populate('comments.user', 'name');
        res.json(activities);
    } catch (error) {
        res.status(403).json({ message: error.message });
    }
};

// Update an activity (reordering, editing details)
export const updateActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) return res.status(404).json({ message: 'Activity not found' });

        await checkAccess(activity.tripId, req.user._id, true);

        const updatedActivity = await Activity.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedActivity);
    } catch (error) {
        res.status(403).json({ message: error.message });
    }
};

// Delete an activity
export const deleteActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) return res.status(404).json({ message: 'Activity not found' });

        await checkAccess(activity.tripId, req.user._id, true);

        await activity.deleteOne();
        res.json({ message: 'Activity removed' });
    } catch (error) {
        res.status(403).json({ message: error.message });
    }
};

// Add a comment to an activity
export const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const activity = await Activity.findById(req.params.id);

        if (!activity) return res.status(404).json({ message: 'Activity not found' });

        // Viewers can comment too, so requireEditor = false
        await checkAccess(activity.tripId, req.user._id, false);

        const comment = {
            user: req.user._id,
            text,
        };

        activity.comments.push(comment);
        await activity.save();
        res.status(201).json(activity);
    } catch (error) {
        res.status(403).json({ message: error.message });
    }
};
