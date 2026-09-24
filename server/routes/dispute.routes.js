import express from 'express';
import {
  raiseDispute,
  getDisputes,
  resolveDispute,
} from '../controllers/dispute.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = express.Router();

router.post('/', protect, raiseDispute);
router.get('/', protect, getDisputes);
router.put('/:id/resolve', protect, authorize('admin'), resolveDispute);

export default router;
