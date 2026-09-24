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
        className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Client Workspace</span>
      </button>

      <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 p-0.5 shadow-glow-purple">
            <div className="w-full h-full bg-[#0d0d24] rounded-[14px] flex items-center justify-center">
              <PlusCircle className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Post a Milestone-Based Project</h2>
            <p className="text-xs text-slate-400">
              Receive proposals from verified freelancers and structure progress into milestones
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Project Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build an E-Commerce Platform with Cart & Checkout"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f29] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Estimated Total Budget (INR) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                  ₹
                </span>
                <input
                  type="number"
                  min="2000"
                  step="1000"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-emerald-400 font-bold focus:outline-none focus:border-purple-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Deadline *
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-purple-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Required Skills (comma-separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="React.js, Node.js, Tailwind CSS, Stripe"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Detailed Scope & Requirements *
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline what needs to be built across each phase (UI wireframes, frontend interactions, backend APIs, and final deployment)..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 leading-relaxed"
              required
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400 font-semibold bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-glow-purple flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? 'Publishing Project...' : `Post Project (${formatCurrency(budget)})`}
          </button>
        </form>
      </div>
    </div>
  );
};
