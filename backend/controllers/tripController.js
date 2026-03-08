import Trip from '../models/Trip.js';
import User from '../models/User.js';
import nodemailer from 'nodemailer';

const getTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const generateInviteEmail = (inviterName, tripTitle) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #171717; line-height: 1.6;">
    <h2 style="font-size: 24px; font-weight: 800; tracking: -0.025em; margin-bottom: 16px;">You're invited to ${tripTitle}!</h2>
    <p style="font-size: 16px; margin-bottom: 24px;">
      Hi there, <b>${inviterName}</b> has invited you to collaborate on their upcoming trip <b>"${tripTitle}"</b> on ChalteFir.
    </p>
    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
      <p style="margin-bottom: 20px; font-weight: 500;">Join the plan to start adding activities, splitting expenses, and chatting with the group.</p>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/register" style="display: inline-block; background-color: #171717; color: #ffffff; padding: 12px 32px; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 14px;">Accept Invitation</a>
    </div>
    <p style="font-size: 12px; color: #737373;">
      If you already have an account, simply sign in with this email address to see your new trip on the dashboard.
    </p>
    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
    <p style="font-size: 12px; color: #a3a3a3; text-align: center;">ChalteFir. The minimal collaborative workspace for travelers.</p>
  </div>
`;

// Create a new trip
export const createTrip = async (req, res) => {
  try {
    const { title, startDate, endDate, invitedEmails } = req.body;

    // Add owner
    const members = [{ user: req.user._id, role: 'Owner' }];
    const validInvitedEmails = [];

    // If emails are invited, find them and add to members array
    if (invitedEmails && invitedEmails.length > 0) {
      for (let email of invitedEmails) {
        email = email.toLowerCase();
        const user = await User.findOne({ email });
        if (user) {
          members.push({ user: user._id, role: 'Editor' });
        } else {
          validInvitedEmails.push(email);

          // Send email
          try {
            console.log(`Step 1: Preparing to invite ${email}`);
            const transporter = getTransporter();
            console.log(`Step 2: Verifying SMTP connection...`);
            await transporter.verify();
            console.log(`Step 3: Verification SUCCESS. Sending mail...`);

            await transporter.sendMail({
              from: `"ChalteFir" <${process.env.EMAIL_USER}>`,
              to: email,
              subject: `${req.user.name} invited you to a trip: ${title}`,
              html: generateInviteEmail(req.user.name, title)
            });
            console.log(`Step 4: Successfully sent email to ${email}`);
          } catch (mailErr) {
            console.error(`ERROR at ${email}: ${mailErr.message}`);
          }
        }
      }
    }

    const trip = new Trip({
      title,
      startDate,
      endDate,
      members,
      invitedEmails: validInvitedEmails
    });

    const createdTrip = await trip.save();
    res.status(201).json(createdTrip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all trips for the logged in user
export const getUserTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ 'members.user': req.user._id })
      .populate('members.user', 'name email');
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single trip by ID if user is a member
export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('members.user', 'name email');

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if user is part of trip
    const isMember = trip.members.some(member => member.user._id.toString() === req.user._id.toString());

    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized to view this trip' });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Members (Invite new, change roles, remove)
export const updateTripMembers = async (req, res) => {
  try {
    const { action, email, role, userId } = req.body;
    const trip = await Trip.findById(req.params.id);

    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    // Check if current user is owner
    const isOwner = trip.members.some(member => member.user._id.toString() === req.user._id.toString() && member.role === 'Owner');
    if (!isOwner) return res.status(403).json({ message: 'Not authorized. Only Owners can manage members.' });

    if (action === 'invite') {
      const user = await User.findOne({ email });
      if (user) {
        if (!trip.members.some(m => m.user.toString() === user._id.toString())) {
          trip.members.push({ user: user._id, role: role || 'Editor' });
        }
      } else {
        if (!trip.invitedEmails.includes(email)) {
          trip.invitedEmails.push(email);
          try {
            console.log(`Attempting to invite ${email} to existing trip...`);
            const transporter = getTransporter();
            await transporter.sendMail({
              from: `"SyncTrip" <${process.env.EMAIL_USER}>`,
              to: email,
              subject: `${req.user.name} invited you to a trip: ${trip.title}`,
              html: generateInviteEmail(req.user.name, trip.title)
            });
            console.log(`Successfully invited ${email}`);
          } catch (err) {
            console.error(`ERROR: Failed to invite ${email}. Reason: ${err.message}`);
          }
        }
      }
    } else if (action === 'updateRole') {
      const member = trip.members.find(m => m.user.toString() === userId);
      if (member) member.role = role;
    } else if (action === 'remove') {
      trip.members = trip.members.filter(m => m.user.toString() !== userId);
    } else if (action === 'removeInvite') {
      trip.invitedEmails = trip.invitedEmails.filter(e => e !== email);
    }

    await trip.save();

    const updatedTrip = await Trip.findById(req.params.id).populate('members.user', 'name email');
    res.json(updatedTrip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
