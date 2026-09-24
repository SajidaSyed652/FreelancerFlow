import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    coverLetter: { type: String, required: true },
    bidAmount: { type: Number, required: true },
    deliveryDays: { type: Number, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

export const Proposal = mongoose.model('Proposal', proposalSchema);
