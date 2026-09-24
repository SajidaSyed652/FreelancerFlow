import express from 'express';
import {
  getNotifications,
  markNotificationRead,
} from '../controllers/notification.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getNotifications);
router.put('/:id/read', protect, markNotificationRead);

export default router;
