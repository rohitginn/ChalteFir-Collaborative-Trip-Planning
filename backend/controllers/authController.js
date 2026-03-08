import User from '../models/User.js';
import Trip from '../models/Trip.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

export const registerUser = async (req, res) => {
    const { name, email: rawEmail, password } = req.body;
    const email = rawEmail.toLowerCase();

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        if (user) {
            // Auto-join trips where this email was invited
            try {
                await Trip.updateMany(
                    { invitedEmails: email },
                    {
                        $pull: { invitedEmails: email },
                        $addToSet: { members: { user: user._id, role: 'Editor' } }
                    }
                );
            } catch (err) {
                console.error('Error auto-joining trips:', err);
            }

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const authUser = async (req, res) => {
    const { email: rawEmail, password } = req.body;
    const email = rawEmail.toLowerCase();

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
