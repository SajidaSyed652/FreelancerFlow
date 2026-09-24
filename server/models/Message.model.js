import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: { type: String, required: true },
    attachments: [{ type: String }],
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Message = mongoose.model('Message', messageSchema);
