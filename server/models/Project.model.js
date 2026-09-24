import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, default: 'Web Development' },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    budget: { type: Number, required: true },
    deadline: { type: Date, required: true },
    skills: [{ type: String }],
    attachments: [{ type: String }],
    status: {
      type: String,
      enum: ['OPEN', 'ACTIVE', 'IN_REVIEW', 'COMPLETED', 'CANCELLED', 'DISPUTED'],
      default: 'OPEN',
    },
    progress: { type: Number, default: 0 },
    milestoneCount: { type: Number, default: 0 },
    completedMilestones: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Project = mongoose.model('Project', projectSchema);
