import { Review } from '../models/Review.model.js';
import { User } from '../models/User.model.js';

export const addReview = async (req, res, next) => {
  try {
    const { projectId, revieweeId, rating, comment } = req.body;

    const review = await Review.create({
      projectId,
      reviewerId: req.user._id,
      revieweeId,
      rating,
      comment,
    });

    // Update user average rating
    const reviews = await Review.find({ revieweeId });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await User.findByIdAndUpdate(revieweeId, {
      'ratings.avg': Math.round(avg * 10) / 10,
      'ratings.count': reviews.length,
    });

    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

export const getUserReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ revieweeId: req.params.userId })
      .populate('reviewerId', 'name avatar role')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};
