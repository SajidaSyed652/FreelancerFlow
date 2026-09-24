import { Message } from '../models/Message.model.js';
import { Project } from '../models/Project.model.js';

export const getMessages = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const messages = await Message.find({ projectId })
      .populate('senderId', 'name avatar role')
      .populate('receiverId', 'name avatar role')
      .sort({ createdAt: 1 });

    res.json({ success: true, count: messages.length, messages });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { text, attachments } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const receiverId =
      project.clientId.toString() === req.user._id.toString()
        ? project.freelancerId
        : project.clientId;

    if (!receiverId) {
      return res.status(400).json({ success: false, message: 'No freelancer assigned to message' });
    }

    const message = await Message.create({
      projectId,
      senderId: req.user._id,
      receiverId,
      text,
      attachments: attachments || [],
    });

    const populated = await Message.findById(message._id)
      .populate('senderId', 'name avatar role')
      .populate('receiverId', 'name avatar role');

    res.status(201).json({ success: true, message: populated });
  } catch (error) {
    next(error);
  }
};

export const markRead = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    await Message.updateMany(
      { projectId, receiverId: req.user._id, isRead: false },
      { isRead: true }
    );
    res.json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    next(error);
  }
};
