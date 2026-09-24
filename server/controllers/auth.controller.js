import { User } from '../models/User.model.js';
import { generateToken } from '../utils/generateToken.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, skills, title, bio } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'freelancer',
      skills: skills || [],
      title: title || (role === 'client' ? 'Project Owner' : 'Freelancer'),
      bio: bio || '',
      wallet: {
        balance: role === 'client' ? 50000 : 5000,
        escrow: 0,
      },
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        title: user.title,
        bio: user.bio,
        skills: user.skills,
        portfolio: user.portfolio,
        wallet: user.wallet,
        ratings: user.ratings,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'Your account is suspended. Contact support.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        title: user.title,
        bio: user.bio,
        skills: user.skills,
        portfolio: user.portfolio,
        wallet: user.wallet,
        ratings: user.ratings,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, title, skills, hourlyRate, portfolio, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          ...(name && { name }),
          ...(bio !== undefined && { bio }),
          ...(title && { title }),
          ...(skills && { skills }),
          ...(hourlyRate && { hourlyRate }),
          ...(portfolio && { portfolio }),
          ...(avatar && { avatar }),
        },
      },
      { new: true, runValidators: true }
    );

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const getFreelancers = async (req, res, next) => {
  try {
    const { search, skill } = req.query;
    let query = { role: 'freelancer', isBlocked: false };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
      ];
    }

    if (skill) {
      query.skills = { $in: [new RegExp(skill, 'i')] };
    }

    const freelancers = await User.find(query).select('-password').sort({ 'ratings.avg': -1 });
    res.json({ success: true, count: freelancers.length, freelancers });
  } catch (error) {
    next(error);
  }
};

export const getFreelancerById = async (req, res, next) => {
  try {
    const freelancer = await User.findOne({ _id: req.params.id, role: 'freelancer' }).select('-password');
    if (!freelancer) {
      return res.status(404).json({ success: false, message: 'Freelancer not found' });
    }
    res.json({ success: true, freelancer });
  } catch (error) {
    next(error);
  }
};
