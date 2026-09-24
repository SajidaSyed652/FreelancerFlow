import { User } from '../models/User.model.js';
import { Project } from '../models/Project.model.js';
import { Dispute } from '../models/Dispute.model.js';
import { Transaction } from '../models/Transaction.model.js';
import { Milestone } from '../models/Milestone.model.js';

export const getPlatformStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const clientsCount = await User.countDocuments({ role: 'client' });
    const freelancersCount = await User.countDocuments({ role: 'freelancer' });

    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: 'ACTIVE' });
    const completedProjects = await Project.countDocuments({ status: 'COMPLETED' });
    const openProjects = await Project.countDocuments({ status: 'OPEN' });

    const totalMilestones = await Milestone.countDocuments();
    const completedMilestones = await Milestone.countDocuments({
      status: { $in: ['APPROVED', 'COMPLETED'] },
    });

    const openDisputes = await Dispute.countDocuments({ status: 'OPEN' });

    const transactions = await Transaction.find();
    const totalVolume = transactions.reduce((acc, curr) => acc + curr.amount, 0);

    res.json({
      success: true,
      stats: {
        totalUsers,
        clientsCount,
        freelancersCount,
        totalProjects,
        activeProjects,
        completedProjects,
        openProjects,
        totalMilestones,
        completedMilestones,
        openDisputes,
        totalVolume,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

export const toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: `User account ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isVerified = !user.isVerified;
    await user.save();

    res.json({
      success: true,
      message: `User verification updated to ${user.isVerified}`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find()
      .populate('clientId', 'name email role')
      .populate('freelancerId', 'name email role')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: projects.length, projects });
  } catch (error) {
    next(error);
  }
};
