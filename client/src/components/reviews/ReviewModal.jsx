import React, { useState } from 'react';
import { X, Star, Sparkles } from 'lucide-react';
import api from '../../api/axios';

export const ReviewModal = ({ project, revieweeId, revieweeName, isOpen, onClose, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await api.post('/reviews', {
        projectId: project._id,
        revieweeId,
        rating,
        comment,
      });

      if (data.success) {
        if (onReviewSubmitted) onReviewSubmitted(data.review);
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-[#0f0f29]/95 backdrop-blur-2xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto mb-2 shadow-glow-purple">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Rate & Review</h3>
          <p className="text-xs text-slate-400">Share feedback for {revieweeName}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star rating selector */}
          <div className="flex items-center justify-center gap-2 py-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 hover:scale-125 transition-transform"
              >
                <Star
                  className={`w-7 h-7 transition-colors ${
                    (hoverRating || rating) >= star
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-600'
                  }`}
                />
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Feedback Comment
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What was it like collaborating on this milestone project?"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
              required
            />
          </div>

          {error && <p className="text-xs text-rose-400 font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-xs shadow-glow-purple transition-all disabled:opacity-50"
          >
            {loading ? 'Submitting Review...' : 'Submit Rating & Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
};
