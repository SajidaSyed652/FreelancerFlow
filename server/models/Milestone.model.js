import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    amount: { type: Number, required: true },
    deadline: { type: Date, required: true },
    order: { type: Number, default: 1 },
    status: {
      type: String,
      enum: [
        'PENDING',
        'IN_PROGRESS',
        'SUBMITTED',
        'REVISION_REQUESTED',
        'APPROVED',
        'COMPLETED',
      ],
      default: 'PENDING',
    },
    submissionCount: { type: Number, default: 0 },
    feedback: { type: String, default: '' },
    approvedAt: { type: Date },
  },
  { timestamps: true }
);

export const Milestone = mongoose.model('Milestone', milestoneSchema);
