import { User } from '../models/User.model.js';
import { Transaction } from '../models/Transaction.model.js';

export const getWallet = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('wallet name email role');
    const transactions = await Transaction.find({
      $or: [{ from: req.user._id }, { to: req.user._id }],
    })
      .populate('from', 'name role')
      .populate('to', 'name role')
      .populate('projectId', 'title')
      .populate('milestoneId', 'title order')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      wallet: user.wallet,
      transactions,
    });
  } catch (error) {
    next(error);
  }
};

export const depositFunds = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Please enter a valid amount' });
    }

    const user = await User.findById(req.user._id);
    user.wallet.balance += Number(amount);
    await user.save();

    const transaction = await Transaction.create({
      to: user._id,
      type: 'DEPOSIT',
      amount: Number(amount),
      description: `Simulated wallet deposit of ₹${Number(amount).toLocaleString('en-IN')}`,
    });

    res.json({
      success: true,
      message: `₹${Number(amount).toLocaleString('en-IN')} deposited successfully to simulated wallet!`,
      wallet: user.wallet,
      transaction,
    });
  } catch (error) {
    next(error);
  }
};
