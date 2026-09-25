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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-[#DED3E3] bg-[#FFFDF9] p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#6F6675] hover:text-[#302A35] hover:bg-[#EEE6F5]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF3EA] border border-[#E8D3BA] flex items-center justify-center mx-auto mb-2 shadow-sm">
            <Sparkles className="w-6 h-6 text-[#C29A68]" />
          </div>
          <h3 className="text-lg font-bold text-[#302A35]">Rate & Review</h3>
          <p className="text-xs text-[#6F6675]">Share feedback for {revieweeName}</p>
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
                      ? 'text-[#C29A68] fill-[#C29A68]'
                      : 'text-[#DED3E3]'
                  }`}
                />
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#302A35] mb-1">
              Feedback Comment
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What was it like collaborating on this milestone project?"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#DED3E3] text-xs text-[#302A35] placeholder-[#968D99] focus:outline-none focus:border-[#9B83BD]"
              required
            />
          </div>

          {error && <p className="text-xs text-[#B97878] font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#C29A68] hover:bg-[#B08958] text-white font-extrabold text-xs shadow-sm transition-all disabled:opacity-50"
          >
            {loading ? 'Submitting Review...' : 'Submit Rating & Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
};
