import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Briefcase,
  Layers,
  Sparkles,
  Send,
  Calendar,
  ChevronRight,
  X,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate, getDeadlineStatus } from '../utils/formatters';
import { StatusBadge } from '../components/common/StatusBadge';

export const BrowseProjectsPage = ({ onNavigate }) => {
  const { user, isFreelancer } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxBudget, setMaxBudget] = useState(100000);

  // Proposal modal
  const [selectedProject, setSelectedProject] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState(25000);
  const [deliveryDays, setDeliveryDays] = useState(14);
  const [submitting, setSubmitting] = useState(false);
  const [proposalSuccess, setProposalSuccess] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    'All',
    'Web Development',
    'AI & SaaS',
    'Fintech',
    'Mobile Apps',
    'UI/UX Design',
  ];

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory, maxBudget]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      let url = `/projects?status=OPEN&maxBudget=${maxBudget}`;
      if (selectedCategory !== 'All') url += `&category=${selectedCategory}`;
      if (search.trim()) url += `&search=${search.trim()}`;

      const data = await api.get(url);
      if (data.success) {
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const handleOpenProposal = (project, e) => {
    e.stopPropagation();
    setSelectedProject(project);
    setBidAmount(project.budget);
    setProposalSuccess(false);
    setError(null);
  };

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    if (!selectedProject || !coverLetter.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      const data = await api.post(`/proposals/${selectedProject._id}`, {
        coverLetter,
        bidAmount: Number(bidAmount),
        deliveryDays: Number(deliveryDays),
      });

      if (data.success) {
        setProposalSuccess(true);
        setTimeout(() => {
          setSelectedProject(null);
          setCoverLetter('');
          setProposalSuccess(false);
        }, 1500);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Title & Filters */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Explore Open Projects
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse active client listings, propose milestone breakdowns, and secure escrow contracts
          </p>
        </div>

        {/* Search & Category Chips */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keywords, skills (React, Node, UI)..."
              className="w-full pl-10 pr-24 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-xl bg-purple-600 text-[11px] font-bold text-white hover:bg-purple-500 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  selectedCategory === cat
                    ? 'bg-purple-600/30 border-purple-500/50 text-purple-200 shadow-glow-purple'
                    : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="text-center py-20 text-xs text-slate-400">Loading open jobs...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-white/15 bg-white/[0.02]">
          <Briefcase className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-60" />
          <h4 className="text-base font-bold text-white">No Open Projects Found</h4>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search keywords or category filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => {
            const deadlineInfo = getDeadlineStatus(project.deadline);
            return (
              <div
                key={project._id}
                onClick={() => onNavigate('project-detail', project._id)}
                className="p-6 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:border-purple-500/40 hover:bg-white/[0.06] cursor-pointer transition-all duration-300 flex flex-col justify-between group shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {project.category}
                    </span>
                    <span className="text-base font-extrabold text-emerald-400">
                      {formatCurrency(project.budget)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-300/80 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Skills tags */}
                  {project.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.skills.slice(0, 4).map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-[10px] text-slate-300 font-mono"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-white/[0.06] space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <img
                        src={project.clientId?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'}
                        alt={project.clientId?.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="truncate">{project.clientId?.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {deadlineInfo.text}
                    </span>
                  </div>

                  {/* Submit Proposal CTA */}
                  {isFreelancer ? (
                    <button
                      type="button"
                      onClick={(e) => handleOpenProposal(project, e)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-glow-purple flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Milestone Proposal</span>
                    </button>
                  ) : (
                    <div className="text-right">
                      <span className="font-bold text-purple-400 text-xs flex items-center justify-end gap-1 group-hover:translate-x-0.5 transition-transform">
                        View Project <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PROPOSAL SUBMISSION MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-[#0f0f29]/95 backdrop-blur-2xl p-6 shadow-2xl">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Submit Milestone Bid</h3>
                <p className="text-xs text-slate-400 truncate max-w-xs">{selectedProject.title}</p>
              </div>
            </div>

            {proposalSuccess ? (
              <div className="py-8 text-center animate-in zoom-in-95">
                <ShieldCheck className="w-16 h-16 text-emerald-400 mx-auto mb-3 animate-bounce" />
                <h4 className="text-xl font-bold text-white">Proposal Submitted!</h4>
                <p className="text-xs text-slate-300 mt-1">
                  The client will review your milestone breakdown and reach out.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitProposal} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Your Total Bid (INR)
                    </label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-emerald-400 font-bold focus:outline-none focus:border-purple-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Estimated Delivery (Days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={deliveryDays}
                      onChange={(e) => setDeliveryDays(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cover Letter & Proposed Milestone Breakdown *
                  </label>
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Hi! I propose structuring this project into 4 clear milestones: 1) Wireframes & UI, 2) Frontend Components, 3) API & Database, 4) Testing & Live Deployment..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 leading-relaxed"
                    required
                  />
                </div>

                {error && <p className="text-xs text-rose-400 font-semibold">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-glow-purple flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Sending Proposal...' : 'Send Proposal with Proposed Milestones'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
