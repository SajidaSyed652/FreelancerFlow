import express from 'express';
import { addReview, getUserReviews } from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, addReview);
router.get('/user/:userId', getUserReviews);

export default router;
