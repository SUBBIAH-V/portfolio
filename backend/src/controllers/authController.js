import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/authMiddleware.js';
import { User } from '../models/allModels.js';
import { initialSeedData } from '../utils/seedData.js';

export const loginAdmin = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email/username and password' });
    }

    // Try MongoDB user first if available
    try {
      const user = await User.findOne({
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
      });
      if (user) {
        const isMatch = await user.matchPassword(password);
        if (isMatch) {
          const token = generateToken({ id: user._id, role: user.role, username: user.username });
          return res.json({
            success: true,
            token,
            user: { id: user._id, username: user.username, email: user.email, role: user.role }
          });
        }
      }
    } catch (dbErr) {
      // Fallback below
    }

    // Fallback match with seed credentials
    const seedAdmin = initialSeedData.adminUser;
    if ((emailOrUsername === seedAdmin.email || emailOrUsername === seedAdmin.username) && password === seedAdmin.password) {
      const token = generateToken({ id: 'seed-admin-id', role: 'admin', username: seedAdmin.username });
      return res.json({
        success: true,
        token,
        user: { id: 'seed-admin-id', username: seedAdmin.username, email: seedAdmin.email, role: 'admin' }
      });
    }

    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
};
