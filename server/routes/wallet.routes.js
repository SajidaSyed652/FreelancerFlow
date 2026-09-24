import express from 'express';
import { getWallet, depositFunds } from '../controllers/wallet.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getWallet);
router.post('/deposit', protect, depositFunds);

export default router;
