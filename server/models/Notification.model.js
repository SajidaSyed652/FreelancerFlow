import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: [
        'PROPOSAL_SUBMITTED',
        'PROPOSAL_ACCEPTED',
        'MILESTONE_CREATED',
        'MILESTONE_STARTED',
        'MILESTONE_SUBMITTED',
        'MILESTONE_APPROVED',
        'REVISION_REQUESTED',
        'PAYMENT_RECEIVED',
        'NEW_MESSAGE',
        'DISPUTE_RAISED',
        'DISPUTE_RESOLVED',
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String, default: '' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = mongoose.model('Notification', notificationSchema);
