import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

import authRoutes from './routes/authRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/trip-planner')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// touch
