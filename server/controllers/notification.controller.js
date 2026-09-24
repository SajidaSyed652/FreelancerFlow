import { Notification } from '../models/Notification.model.js';

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });

    res.json({ success: true, count: notifications.length, unreadCount, notifications });
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id === 'all') {
      await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
    } else {
      await Notification.findByIdAndUpdate(id, { isRead: true });
    }
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
};
