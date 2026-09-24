import express from 'express';
import {
  submitProposal,
  getProjectProposals,
  getFreelancerProposals,
  acceptProposal,
  rejectProposal,
} from '../controllers/proposal.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = express.Router();

router.post('/:projectId', protect, authorize('freelancer', 'admin'), submitProposal);
router.get('/project/:projectId', protect, getProjectProposals);
router.get('/freelancer/my', protect, authorize('freelancer', 'admin'), getFreelancerProposals);
router.put('/:id/accept', protect, authorize('client', 'admin'), acceptProposal);
router.put('/:id/reject', protect, authorize('client', 'admin'), rejectProposal);

export default router;
