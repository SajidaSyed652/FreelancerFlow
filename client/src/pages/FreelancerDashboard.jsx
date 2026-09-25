import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Layers,
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Search,
  ArrowRight,
  ChevronRight,
  Send,
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { StatusBadge } from '../components/common/StatusBadge';

export const FreelancerDashboard = ({ onNavigate }) => {
  const { user } = useAuth();
  const [activeProjects, setActiveProjects] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [projRes, propRes] = await Promise.all([
        api.get('/projects/freelancer/active'),
        api.get('/proposals/freelancer/my'),
      ]);

      if (projRes.success) setActiveProjects(projRes.projects || []);
      if (propRes.success) setProposals(propRes.proposals || []);
    } catch (err) {
      console.error('Failed to load freelancer dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const pendingProposals = proposals.filter((p) => p.status === 'PENDING');
  const acceptedProposals = proposals.filter((p) => p.status === 'ACCEPTED');

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Freelancer Header */}
      <div className="p-6 rounded-3xl border border-[#DED3E3] bg-[#FFFDF9] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#789B83]/40 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#302A35]">{user?.name}</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EDF4EF] text-[#789B83] font-bold border border-[#C8DECF] uppercase">
                Freelancer Workspace
              </span>
            </div>
            <p className="text-xs text-[#6F6675] mt-0.5">{user?.title || 'Developer'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('browse-projects')}
            className="px-5 py-2.5 rounded-xl bg-[#9B83BD] hover:bg-[#8F78B5] text-white text-xs font-extrabold shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Search className="w-4 h-4" />
            Find New Projects
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Earnings */}
        <div className="p-5 rounded-2xl border border-[#DED3E3] bg-[#FFFDF9] space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[#789B83]">
            <span className="text-xs font-medium">Wallet Balance</span>
            <Wallet className="w-4 h-4 text-[#789B83]" />
          </div>
          <div className="text-2xl font-extrabold text-[#789B83]">
            {formatCurrency(user?.wallet?.balance || 0)}
          </div>
          <p className="text-[10px] text-[#6F6675]">Available simulated earnings</p>
        </div>

        {/* Active Projects */}
        <div className="p-5 rounded-2xl border border-[#DED3E3] bg-[#FFFDF9] space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[#6F6675]">
            <span className="text-xs font-medium">Active Projects</span>
            <Briefcase className="w-4 h-4 text-[#765B9E]" />
          </div>
          <div className="text-2xl font-extrabold text-[#302A35]">{activeProjects.length}</div>
          <p className="text-[10px] text-[#6F6675]">Ongoing milestone deliveries</p>
        </div>

        {/* Proposals Submitted */}
        <div className="p-5 rounded-2xl border border-[#DED3E3] bg-[#FFFDF9] space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[#765B9E]">
            <span className="text-xs font-medium">Active Proposals</span>
            <Send className="w-4 h-4 text-[#9B83BD]" />
          </div>
          <div className="text-2xl font-extrabold text-[#765B9E]">{pendingProposals.length}</div>
          <p className="text-[10px] text-[#6F6675] font-medium">
            {acceptedProposals.length} proposals won & hired
          </p>
        </div>

        {/* Rating Score */}
        <div className="p-5 rounded-2xl border border-[#DED3E3] bg-[#FFFDF9] space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[#C29A68]">
            <span className="text-xs font-medium">Client Rating</span>
            <span className="text-[#C29A68]">★</span>
          </div>
          <div className="text-2xl font-extrabold text-[#C29A68]">
            {user?.ratings?.avg || '5.0'} / 5.0
          </div>
          <p className="text-[10px] text-[#6F6675]">
            Based on {user?.ratings?.count || 12} completed milestones
          </p>
        </div>
      </div>

      {/* ACTIVE WORKSPACE PROJECTS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#302A35] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#9B83BD]" />
              My Active Projects & Milestone Work
            </h3>
            <p className="text-xs text-[#6F6675] mt-0.5">
              Select any project to view deliverable requirements and submit work
            </p>
          </div>

          <button
            onClick={() => onNavigate('browse-projects')}
            className="text-xs font-bold text-[#765B9E] hover:text-[#9B83BD] flex items-center gap-1"
          >
            <span>Browse More Projects</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-xs text-[#6F6675]">Loading workspace...</div>
        ) : activeProjects.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-[#DED3E3] bg-[#FFFDF9]">
            <Briefcase className="w-12 h-12 text-[#968D99] mx-auto mb-3 opacity-60" />
            <h4 className="text-base font-bold text-[#302A35]">No Active Projects Yet</h4>
            <p className="text-xs text-[#6F6675] max-w-sm mx-auto mt-1 mb-4">
              Browse open job opportunities, submit competitive milestone proposals, and start earning stage payouts.
            </p>
            <button
              onClick={() => onNavigate('browse-projects')}
              className="px-6 py-2.5 rounded-xl bg-[#9B83BD] hover:bg-[#8F78B5] text-white font-bold text-xs shadow-sm transition-all"
            >
              Browse Open Jobs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeProjects.map((project) => (
              <div
                key={project._id}
                onClick={() => onNavigate('project-detail', project._id)}
                className="p-6 rounded-3xl border border-[#DED3E3] bg-[#FFFDF9] hover:border-[#9B83BD] hover:shadow-[0_12px_32px_rgba(155,131,189,0.14)] cursor-pointer transition-all duration-300 space-y-4 group shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <StatusBadge status={project.status} />
                      <span className="text-[10px] font-bold text-[#6F6675]">
                        {project.category}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-[#302A35] group-hover:text-[#765B9E] transition-colors line-clamp-1">
                      {project.title}
                    </h4>
                  </div>
                  <span className="text-sm font-extrabold text-[#789B83] shrink-0">
                    {formatCurrency(project.budget)}
                  </span>
                </div>

                <p className="text-xs text-[#6F6675] line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6F6675] font-medium">
                      {project.completedMilestones || 0} of {project.milestoneCount || 0} Milestones
                      Delivered & Paid
                    </span>
                    <span className="font-extrabold text-[#789B83]">{project.progress || 0}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#EEE6F5] overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full bg-[#789B83] transition-all duration-500"
                      style={{ width: `${project.progress || 0}%` }}
                    />
                  </div>
                </div>

                {/* Client + Action Footer */}
                <div className="pt-3 border-t border-[#DED3E3]/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={project.clientId?.avatar}
                      alt={project.clientId?.name}
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-[#9B83BD]/40"
                    />
                    <span className="text-[#302A35] font-medium">
                      Client: {project.clientId?.name}
                    </span>
                  </div>

                  <span className="font-bold text-[#765B9E] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Submit Deliverables <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
