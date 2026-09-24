import { Milestone } from '../models/Milestone.model.js';
import { Project } from '../models/Project.model.js';
import { Submission } from '../models/Submission.model.js';
import { User } from '../models/User.model.js';
import { Transaction } from '../models/Transaction.model.js';
import { Notification } from '../models/Notification.model.js';

export const createMilestones = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { milestones } = req.body; // array of { title, description, amount, deadline, order }

    if (!milestones || milestones.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide at least one milestone' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only project client can create milestones' });
    }

    const client = await User.findById(req.user._id);
    const totalAmount = milestones.reduce((sum, m) => sum + Number(m.amount), 0);

    if (client.wallet.balance < totalAmount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient wallet balance. Total milestone cost is ₹${totalAmount.toLocaleString('en-IN')}, but your wallet balance is ₹${client.wallet.balance.toLocaleString('en-IN')}. Please deposit simulated funds in your wallet first.`,
      });
    }

    // Lock funds in escrow
    client.wallet.balance -= totalAmount;
    client.wallet.escrow += totalAmount;
    await client.save();

    // Create escrow transaction
    await Transaction.create({
      from: client._id,
      type: 'ESCROW_LOCK',
      amount: totalAmount,
      projectId: project._id,
      description: `Escrow locked for ${milestones.length} milestones on project "${project.title}"`,
    });

    // Remove any previous pending/unstarted milestones if replacing
    await Milestone.deleteMany({ projectId: project._id, status: 'PENDING' });

    const createdMilestones = [];
    for (let i = 0; i < milestones.length; i++) {
      const m = milestones[i];
      const milestone = await Milestone.create({
        projectId: project._id,
        title: m.title,
        description: m.description || '',
        amount: Number(m.amount),
        deadline: m.deadline || new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000),
        order: m.order || i + 1,
        status: i === 0 ? 'IN_PROGRESS' : 'PENDING', // first milestone starts active
      });
      createdMilestones.push(milestone);
    }

    // Update project stats
    project.milestoneCount = createdMilestones.length;
    project.progress = Math.round((project.completedMilestones / project.milestoneCount) * 100) || 0;
    await project.save();

    // Notify freelancer if assigned
    if (project.freelancerId) {
      await Notification.create({
        recipient: project.freelancerId,
        sender: client._id,
        type: 'MILESTONE_CREATED',
        title: 'Milestones Defined & Funded 🔒',
        message: `${milestones.length} milestones created with ₹${totalAmount.toLocaleString('en-IN')} locked in escrow for "${project.title}"`,
        link: `/freelancer/projects/${project._id}`,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Milestones created and funds securely locked in escrow',
      milestones: createdMilestones,
      wallet: client.wallet,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectMilestones = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const milestones = await Milestone.find({ projectId }).sort({ order: 1 });
    res.json({ success: true, count: milestones.length, milestones });
  } catch (error) {
    next(error);
  }
};

export const startMilestone = async (req, res, next) => {
  try {
    const { id } = req.params;
    const milestone = await Milestone.findById(id);

    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }

    milestone.status = 'IN_PROGRESS';
    await milestone.save();

    res.json({ success: true, milestone });
  } catch (error) {
    next(error);
  }
};

export const submitMilestoneWork = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { description, files, demoLink } = req.body;

    const milestone = await Milestone.findById(id);
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }

    const project = await Project.findById(milestone.projectId);
    if (project.freelancerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only assigned freelancer can submit work' });
    }

    const nextSubmissionNumber = (milestone.submissionCount || 0) + 1;

    const submission = await Submission.create({
      milestoneId: milestone._id,
      projectId: project._id,
      freelancerId: req.user._id,
      submissionNumber: nextSubmissionNumber,
      description,
      files: files || [],
      demoLink: demoLink || '',
      status: 'PENDING',
    });

    milestone.status = 'SUBMITTED';
    milestone.submissionCount = nextSubmissionNumber;
    await milestone.save();

    // Notify client
    await Notification.create({
      recipient: project.clientId,
      sender: req.user._id,
      type: 'MILESTONE_SUBMITTED',
      title: `Milestone Work Submitted (Attempt #${nextSubmissionNumber})`,
      message: `${req.user.name} submitted deliverables for Milestone ${milestone.order}: "${milestone.title}"`,
      link: `/client/projects/${project._id}`,
    });

    res.status(201).json({ success: true, message: 'Work submitted successfully for review', submission, milestone });
  } catch (error) {
    next(error);
  }
};

export const approveMilestone = async (req, res, next) => {
  try {
    const { id } = req.params;
    const milestone = await Milestone.findById(id);

    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }

    if (milestone.status === 'APPROVED' || milestone.status === 'COMPLETED') {
      return res.status(400).json({ success: false, message: 'Milestone is already approved' });
    }

    const project = await Project.findById(milestone.projectId);
    if (project.clientId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only the client can approve this milestone' });
    }

    const client = await User.findById(project.clientId);
    const freelancer = await User.findById(project.freelancerId);

    if (!freelancer) {
      return res.status(400).json({ success: false, message: 'No freelancer assigned to project' });
    }

    // Escrow payment release
    client.wallet.escrow = Math.max(0, client.wallet.escrow - milestone.amount);
    freelancer.wallet.balance += milestone.amount;

    await client.save();
    await freelancer.save();

    // Transaction Record
    await Transaction.create({
      from: client._id,
      to: freelancer._id,
      type: 'MILESTONE_RELEASE',
      amount: milestone.amount,
      milestoneId: milestone._id,
      projectId: project._id,
      description: `Payment released for Milestone ${milestone.order}: "${milestone.title}"`,
    });

    // Update milestone
    milestone.status = 'APPROVED';
    milestone.approvedAt = new Date();
    await milestone.save();

    // Update latest submission
    await Submission.findOneAndUpdate(
      { milestoneId: milestone._id, status: 'PENDING' },
      { status: 'APPROVED', clientFeedback: req.body.feedback || 'Work approved!' }
    );

    // Auto start next milestone if pending
    const nextMilestone = await Milestone.findOne({
      projectId: project._id,
      order: milestone.order + 1,
      status: 'PENDING',
    });
    if (nextMilestone) {
      nextMilestone.status = 'IN_PROGRESS';
      await nextMilestone.save();
    }

    // Update project progress
    const allMilestones = await Milestone.find({ projectId: project._id });
    const approvedCount = allMilestones.filter((m) => m.status === 'APPROVED' || m.status === 'COMPLETED').length;
    project.completedMilestones = approvedCount;
    project.progress = Math.round((approvedCount / allMilestones.length) * 100);

    if (approvedCount === allMilestones.length) {
      project.status = 'COMPLETED';
    }
    await project.save();

    // Notify Freelancer
    await Notification.create({
      recipient: freelancer._id,
      sender: client._id,
      type: 'MILESTONE_APPROVED',
      title: `Milestone Approved! ₹${milestone.amount.toLocaleString('en-IN')} Released 💰`,
      message: `Your work for Milestone ${milestone.order} "${milestone.title}" was approved. Funds credited to your wallet.`,
      link: `/freelancer/projects/${project._id}`,
    });

    res.json({
      success: true,
      message: `Milestone approved and ₹${milestone.amount.toLocaleString('en-IN')} released to freelancer wallet!`,
      milestone,
      project,
    });
  } catch (error) {
    next(error);
  }
};

export const requestRevision = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;

    if (!feedback) {
      return res.status(400).json({ success: false, message: 'Please provide feedback explaining requested changes' });
    }

    const milestone = await Milestone.findById(id);
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }

    const project = await Project.findById(milestone.projectId);
    if (project.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only client can request revisions' });
    }

    milestone.status = 'REVISION_REQUESTED';
    milestone.feedback = feedback;
    await milestone.save();

    // Update latest submission
    await Submission.findOneAndUpdate(
      { milestoneId: milestone._id, status: 'PENDING' },
      { status: 'REVISION_REQUESTED', clientFeedback: feedback }
    );

    // Notify freelancer
    await Notification.create({
      recipient: project.freelancerId,
      sender: req.user._id,
      type: 'REVISION_REQUESTED',
      title: `Changes Requested on Milestone ${milestone.order} ✏️`,
      message: `Client requested changes on "${milestone.title}": "${feedback.substring(0, 100)}..."`,
      link: `/freelancer/projects/${project._id}`,
    });

    res.json({ success: true, message: 'Revision request sent to freelancer', milestone });
  } catch (error) {
    next(error);
  }
};

export const getMilestoneSubmissions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const submissions = await Submission.find({ milestoneId: id }).sort({ submissionNumber: 1 });
    res.json({ success: true, count: submissions.length, submissions });
  } catch (error) {
    next(error);
  }
};
