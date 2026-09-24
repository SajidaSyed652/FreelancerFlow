import express from 'express';
import { getMessages, sendMessage, markRead } from '../controllers/message.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:projectId', protect, getMessages);
router.post('/:projectId', protect, sendMessage);
router.put('/read/:projectId', protect, markRead);

export default router;
