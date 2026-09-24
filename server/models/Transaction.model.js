import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: ['DEPOSIT', 'ESCROW_LOCK', 'MILESTONE_RELEASE', 'REFUND', 'WITHDRAWAL'],
      required: true,
    },
    amount: { type: Number, required: true },
    milestoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Milestone',
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model('Transaction', transactionSchema);
