import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    milestoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Milestone',
      required: true,
    },
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
    submissionNumber: { type: Number, default: 1 },
    description: { type: String, required: true },
    files: [
      {
        name: { type: String },
        url: { type: String },
        type: { type: String },
      },
    ],
    demoLink: { type: String, default: '' },
    status: {
      type: String,
      enum: ['PENDING', 'REVISION_REQUESTED', 'APPROVED'],
      default: 'PENDING',
    },
    clientFeedback: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Submission = mongoose.model('Submission', submissionSchema);
