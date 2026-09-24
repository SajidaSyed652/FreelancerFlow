import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  getClientProjects,
  getFreelancerProjects,
  updateProject,
  deleteProject,
} from '../controllers/project.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = express.Router();

router.get('/', getProjects);
router.post('/', protect, authorize('client', 'admin'), createProject);
router.get('/client/my', protect, authorize('client', 'admin'), getClientProjects);
router.get('/freelancer/active', protect, authorize('freelancer', 'admin'), getFreelancerProjects);
router.get('/:id', getProjectById);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

export default router;
