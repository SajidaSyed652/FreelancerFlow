import { Dispute } from '../models/Dispute.model.js';
import { Project } from '../models/Project.model.js';
import { Milestone } from '../models/Milestone.model.js';
import { User } from '../models/User.model.js';
import { Transaction } from '../models/Transaction.model.js';
import { Notification } from '../models/Notification.model.js';

export const raiseDispute = async (req, res, next) => {
  try {
    const { projectId, milestoneId, reason, evidence } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const against =
      project.clientId.toString() === req.user._id.toString()
        ? project.freelancerId
        : project.clientId;

    if (!against) {
      return res.status(400).json({ success: false, message: 'No counterparty found for dispute' });
    }

    const dispute = await Dispute.create({
      projectId,
      milestoneId,
      raisedBy: req.user._id,
      against,
      reason,
      evidence: evidence || [],
      status: 'OPEN',
    });

    project.status = 'DISPUTED';
    await project.save();

    // Alert admins and counterparty
    await Notification.create({
      recipient: against,
      sender: req.user._id,
      type: 'DISPUTE_RAISED',
      title: 'Dispute Raised on Project ⚠️',
      message: `${req.user.name} raised a dispute on "${project.title}": "${reason.substring(0, 80)}..."`,
      link: `/projects/${project._id}`,
    });

    res.status(201).json({ success: true, message: 'Dispute submitted. Admin team will review within 24 hours.', dispute });
  } catch (error) {
    next(error);
  }
};

export const getDisputes = async (req, res, next) => {
  try {
    const query =
      req.user.role === 'admin'
        ? {}
        : { $or: [{ raisedBy: req.user._id }, { against: req.user._id }] };

    const disputes = await Dispute.find(query)
      .populate('projectId', 'title budget status')
      .populate('milestoneId', 'title amount order')
      .populate('raisedBy', 'name role email')
      .populate('against', 'name role email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: disputes.length, disputes });
  } catch (error) {
    next(error);
  }
};

export const resolveDispute = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { adminDecision, refundToClient, releaseToFreelancer } = req.body;

    const dispute = await Dispute.findById(id).populate('projectId').populate('milestoneId');
    if (!dispute) {
      return res.status(404).json({ success: false, message: 'Dispute not found' });
    }

    const project = await Project.findById(dispute.projectId._id);
    const client = await User.findById(project.clientId);
    const freelancer = await User.findById(project.freelancerId);
    const milestoneAmount = dispute.milestoneId ? dispute.milestoneId.amount : project.budget;

    if (refundToClient) {
      client.wallet.escrow = Math.max(0, client.wallet.escrow - milestoneAmount);
      client.wallet.balance += milestoneAmount;
      await client.save();

      await Transaction.create({
        to: client._id,
        type: 'REFUND',
        amount: milestoneAmount,
        projectId: project._id,
        description: `Admin refund for disputed milestone on "${project.title}"`,
      });
    } else if (releaseToFreelancer) {
      client.wallet.escrow = Math.max(0, client.wallet.escrow - milestoneAmount);
      freelancer.wallet.balance += milestoneAmount;
      await client.save();
      await freelancer.save();

      await Transaction.create({
        from: client._id,
        to: freelancer._id,
        type: 'MILESTONE_RELEASE',
        amount: milestoneAmount,
        projectId: project._id,
        description: `Admin-approved release for disputed milestone on "${project.title}"`,
      });
    }

    dispute.status = 'RESOLVED';
    dispute.adminDecision = adminDecision;
    dispute.refundToClient = !!refundToClient;
    dispute.releaseToFreelancer = !!releaseToFreelancer;
    dispute.resolvedAt = new Date();
    await dispute.save();

    project.status = 'ACTIVE';
    await project.save();

    res.json({ success: true, message: 'Dispute resolved successfully', dispute });
  } catch (error) {
    next(error);
  }
};
