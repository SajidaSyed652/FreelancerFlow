import { Proposal } from '../models/Proposal.model.js';
import { Project } from '../models/Project.model.js';
import { Notification } from '../models/Notification.model.js';

export const submitProposal = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { coverLetter, bidAmount, deliveryDays } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.status !== 'OPEN') {
      return res.status(400).json({ success: false, message: 'Project is no longer accepting proposals' });
    }

    if (project.clientId.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot submit a proposal to your own project' });
    }

    const existingProposal = await Proposal.findOne({
      projectId,
      freelancerId: req.user._id,
    });

    if (existingProposal) {
      return res.status(400).json({ success: false, message: 'You have already submitted a proposal for this project' });
    }

    const proposal = await Proposal.create({
      projectId,
      freelancerId: req.user._id,
      coverLetter,
      bidAmount,
      deliveryDays,
    });

    // Create notification for client
    await Notification.create({
      recipient: project.clientId,
      sender: req.user._id,
      type: 'PROPOSAL_SUBMITTED',
      title: 'New Proposal Received',
      message: `${req.user.name} submitted a bid of ₹${bidAmount.toLocaleString('en-IN')} for "${project.title}"`,
      link: `/client/projects/${project._id}`,
    });

    res.status(201).json({ success: true, proposal });
  } catch (error) {
    next(error);
  }
};

export const getProjectProposals = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.clientId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view these proposals' });
    }

    const proposals = await Proposal.find({ projectId })
      .populate('freelancerId', 'name avatar title skills bio ratings hourlyRate')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: proposals.length, proposals });
  } catch (error) {
    next(error);
  }
};

export const getFreelancerProposals = async (req, res, next) => {
  try {
    const proposals = await Proposal.find({ freelancerId: req.user._id })
      .populate({
        path: 'projectId',
        select: 'title budget deadline status clientId',
        populate: { path: 'clientId', select: 'name avatar ratings' },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: proposals.length, proposals });
  } catch (error) {
    next(error);
  }
};

export const acceptProposal = async (req, res, next) => {
  try {
    const { id } = req.params;

    const proposal = await Proposal.findById(id).populate('projectId');
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    const project = await Project.findById(proposal.projectId._id);
    if (project.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to accept this proposal' });
    }

    if (project.status !== 'OPEN') {
      return res.status(400).json({ success: false, message: 'Project is already active or closed' });
    }

    // Accept this proposal
    proposal.status = 'ACCEPTED';
    await proposal.save();

    // Reject other pending proposals
    await Proposal.updateMany(
      { projectId: project._id, _id: { $ne: proposal._id }, status: 'PENDING' },
      { status: 'REJECTED' }
    );

    // Update project
    project.freelancerId = proposal.freelancerId;
    project.status = 'ACTIVE';
    await project.save();

    // Notify freelancer
    await Notification.create({
      recipient: proposal.freelancerId,
      sender: req.user._id,
      type: 'PROPOSAL_ACCEPTED',
      title: 'Proposal Accepted! 🎉',
      message: `Congratulations! Your proposal for "${project.title}" was accepted. Check the project to view milestones.`,
      link: `/freelancer/projects/${project._id}`,
    });

    res.json({ success: true, message: 'Freelancer selected and project is now ACTIVE!', project });
  } catch (error) {
    next(error);
  }
};

export const rejectProposal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const proposal = await Proposal.findById(id).populate('projectId');

    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    if (proposal.projectId.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    proposal.status = 'REJECTED';
    await proposal.save();

    res.json({ success: true, message: 'Proposal rejected' });
  } catch (error) {
    next(error);
  }
};
