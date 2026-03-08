import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    date: { type: Date, required: true },
    timing: { type: String },
    place: { type: String, required: true },
    order: { type: Number, default: 0 },
    budget: {
        amount: { type: Number, default: 0 },
        category: { type: String, default: 'other' }
    },
    checklists: [
        {
            task: { type: String },
            isCompleted: { type: Boolean, default: false }
        }
    ],
    attachments: [
        {
            url: { type: String },
            filename: { type: String }
        }
    ],
    comments: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            text: { type: String },
            createdAt: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
