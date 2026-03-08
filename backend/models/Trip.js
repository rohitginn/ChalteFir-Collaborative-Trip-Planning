import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
    title: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    members: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            role: { type: String, enum: ['Owner', 'Editor', 'Viewer'], default: 'Viewer' }
        }
    ],
    invitedEmails: [{ type: String }]
}, { timestamps: true });

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;
