import React, { useState } from 'react';
import { PlusCircle, ArrowRight, Layers, Lock, Sparkles, ChevronLeft } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';

export const PostProjectPage = ({ onNavigate }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [budget, setBudget] = useState(30000);
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [skills, setSkills] = useState('React.js, Node.js, Tailwind CSS, MongoDB');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    'Web Development',
    'AI & SaaS',
    'Fintech',
    'Mobile Apps',
    'UI/UX Design',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const skillsArray = skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const data = await api.post('/projects', {
        title,
        category,
        budget: Number(budget),
        deadline,
        skills: skillsArray,
        description,
      });

      if (data.success) {
        onNavigate('project-detail', data.project._id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <button
        onClick={() => onNavigate('client-dashboard')}
        className="inline-flex items-center gap-1 text-xs font-bold text-[#6F6675] hover:text-[#302A35] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Client Workspace</span>
      </button>

      <div className="p-8 rounded-3xl border border-[#DED3E3] bg-[#FFFDF9] shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EEE6F5] border border-[#DED3E3] flex items-center justify-center text-[#765B9E]">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#302A35]">Post a Milestone-Based Project</h2>
            <p className="text-xs text-[#6F6675]">
              Receive proposals from verified freelancers and structure progress into milestones
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#302A35] mb-1">
              Project Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build an E-Commerce Platform with Cart & Checkout"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#DED3E3] text-xs text-[#302A35] placeholder-[#968D99] focus:outline-none focus:border-[#9B83BD] focus:ring-2 focus:ring-[#9B83BD]/20"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#302A35] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#DED3E3] text-xs text-[#302A35] focus:outline-none focus:border-[#9B83BD]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#302A35] mb-1">
                Estimated Total Budget (INR) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F6675] font-bold text-xs">
                  ₹
                </span>
                <input
                  type="number"
                  min="2000"
                  step="1000"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#DED3E3] text-xs text-[#789B83] font-bold focus:outline-none focus:border-[#9B83BD]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#302A35] mb-1">
                Target Deadline *
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#DED3E3] text-xs text-[#302A35] focus:outline-none focus:border-[#9B83BD]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#302A35] mb-1">
              Required Skills (comma-separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="React.js, Node.js, Tailwind CSS, Stripe"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#DED3E3] text-xs text-[#302A35] placeholder-[#968D99] focus:outline-none focus:border-[#9B83BD]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#302A35] mb-1">
              Detailed Scope & Requirements *
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline what needs to be built across each phase (UI wireframes, frontend interactions, backend APIs, and final deployment)..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#DED3E3] text-xs text-[#302A35] placeholder-[#968D99] focus:outline-none focus:border-[#9B83BD] leading-relaxed"
              required
            />
          </div>

          {error && (
            <p className="text-xs text-[#B97878] font-semibold bg-[#F9EFEF] p-2.5 rounded-xl border border-[#E4C0C0]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#9B83BD] hover:bg-[#8F78B5] text-white font-extrabold text-xs shadow-[0_4px_16px_rgba(155,131,189,0.3)] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? 'Publishing Project...' : `Post Project (${formatCurrency(budget)})`}
          </button>
        </form>
      </div>
    </div>
  );
};
