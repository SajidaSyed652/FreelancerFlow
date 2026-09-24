import { Project } from '../models/Project.model.js';
import { Milestone } from '../models/Milestone.model.js';
import { Proposal } from '../models/Proposal.model.js';

export const createProject = async (req, res, next) => {
  try {
    const { title, description, category, budget, deadline, skills, attachments } = req.body;

    const project = await Project.create({
      title,
      description,
      category: category || 'Web Development',
      budget,
      deadline,
      skills: skills || [],
      attachments: attachments || [],
      clientId: req.user._id,
      status: 'OPEN',
    });

    res.status(201).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const { category, search, minBudget, maxBudget, status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    } else {
      query.status = { $in: ['OPEN', 'ACTIVE', 'COMPLETED'] };
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = Number(minBudget);
      if (maxBudget) query.budget.$lte = Number(maxBudget);
    }

    const projects = await Project.find(query)
      .populate('clientId', 'name avatar ratings title isVerified')
      .populate('freelancerId', 'name avatar ratings title')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: projects.length, projects });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('clientId', 'name avatar email bio title ratings isVerified')
      .populate('freelancerId', 'name avatar email bio title skills ratings portfolio');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const milestones = await Milestone.find({ projectId: project._id }).sort({ order: 1 });
    const proposalCount = await Proposal.countDocuments({ projectId: project._id });

    res.json({ success: true, project, milestones, proposalCount });
  } catch (error) {
    next(error);
  }
};

export const getClientProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ clientId: req.user._id })
      .populate('freelancerId', 'name avatar title ratings')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: projects.length, projects });
  } catch (error) {
    next(error);
  }
};

export const getFreelancerProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ freelancerId: req.user._id })
      .populate('clientId', 'name avatar title ratings')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: projects.length, projects });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.clientId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this project' });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.clientId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this project' });
    }

    if (project.status === 'ACTIVE') {
      return res.status(400).json({ success: false, message: 'Cannot delete an active project with ongoing milestones' });
    }

    await Project.findByIdAndDelete(req.params.id);
    await Milestone.deleteMany({ projectId: req.params.id });
    await Proposal.deleteMany({ projectId: req.params.id });

    res.json({ success: true, message: 'Project removed successfully' });
  } catch (error) {
    next(error);
  }
};
