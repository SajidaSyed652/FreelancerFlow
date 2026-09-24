import express from 'express';
import {
  createMilestones,
  getProjectMilestones,
  startMilestone,
  submitMilestoneWork,
  approveMilestone,
  requestRevision,
  getMilestoneSubmissions,
} from '../controllers/milestone.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = express.Router();

router.post('/:projectId', protect, authorize('client', 'admin'), createMilestones);
router.get('/:projectId', protect, getProjectMilestones);
router.put('/:id/start', protect, authorize('freelancer', 'admin'), startMilestone);
router.post('/:id/submit', protect, authorize('freelancer', 'admin'), submitMilestoneWork);
router.put('/:id/approve', protect, authorize('client', 'admin'), approveMilestone);
router.put('/:id/revision', protect, authorize('client', 'admin'), requestRevision);
router.get('/:id/submissions', protect, getMilestoneSubmissions);

export default router;
