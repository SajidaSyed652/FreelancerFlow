import mongoose from 'mongoose';

const disputeSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    milestoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Milestone',
    },
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    against: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: { type: String, required: true },
    evidence: [{ type: String }],
    status: {
      type: String,
      enum: ['OPEN', 'UNDER_REVIEW', 'RESOLVED'],
      default: 'OPEN',
    },
    adminDecision: { type: String, default: '' },
    refundToClient: { type: Boolean, default: false },
    releaseToFreelancer: { type: Boolean, default: false },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

export const Dispute = mongoose.model('Dispute', disputeSchema);
