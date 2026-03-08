import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Configuration 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'synctrip',
        resource_type: 'auto', // allows all file types including pdf
    },
});

const upload = multer({ storage: storage });

router.post('/', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Cloudinary returns the full upload info in req.file
        res.json({
            url: req.file.path,
            filename: req.file.filename || req.file.originalname,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during file upload', error: error.message });
    }
});

export default router;
