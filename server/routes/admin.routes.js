import express from 'express';
import {
  getPlatformStats,
  getAllUsers,
  toggleBlockUser,
  verifyUser,
  getAllProjects,
} from '../controllers/admin.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/stats', getPlatformStats);
router.get('/users', getAllUsers);
router.put('/users/:id/block', toggleBlockUser);
router.put('/users/:id/verify', verifyUser);
router.get('/projects', getAllProjects);

export default router;
