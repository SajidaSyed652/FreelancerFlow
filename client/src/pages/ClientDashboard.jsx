import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  Briefcase,
  Layers,
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Lock,
  ChevronRight,
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { StatusBadge } from '../components/common/StatusBadge';

export const ClientDashboard = ({ onNavigate, onOpenDeposit }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientProjects();
  }, []);

  const fetchClientProjects = async () => {
    setLoading(true);
    try {
      const data = await api.get('/projects/client/my');
      if (data.success) {
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error('Failed to load client projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeProjects = projects.filter((p) => p.status === 'ACTIVE');
  const completedProjects = projects.filter((p) => p.status === 'COMPLETED');
  const openProjects = projects.filter((p) => p.status === 'OPEN');

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Client Header */}
      <div className="p-6 rounded-3xl border border-[#DED3E3] bg-[#FFFDF9] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#9B83BD]/40 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#302A35]">{user?.name}</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EEE6F5] text-[#765B9E] font-bold border border-[#DED3E3] uppercase">
                Client Workspace
              </span>
            </div>
            <p className="text-xs text-[#6F6675] mt-0.5">{user?.title || 'Project Manager'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDeposit}
            className="px-4 py-2.5 rounded-xl border border-[#C8DECF] bg-[#EDF4EF] text-[#789B83] text-xs font-bold hover:bg-[#C8DECF] transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Wallet className="w-4 h-4 text-[#789B83]" />
            + Deposit Wallet
          </button>
          <button
            onClick={() => onNavigate('post-project')}
            className="px-5 py-2.5 rounded-xl bg-[#9B83BD] hover:bg-[#8F78B5] text-white text-xs font-extrabold shadow-sm flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Post New Project
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Wallet Balance */}
        <div className="p-5 rounded-2xl border border-[#DED3E3] bg-[#FFFDF9] space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[#6F6675]">
            <span className="text-xs font-medium">Available Balance</span>
            <Wallet className="w-4 h-4 text-[#789B83]" />
          </div>
          <div className="text-2xl font-extrabold text-[#302A35]">
            {formatCurrency(user?.wallet?.balance || 0)}
          </div>
          <p className="text-[10px] text-[#6F6675]">Ready to lock into milestone escrow</p>
        </div>

        {/* Escrow Locked */}
        <div className="p-5 rounded-2xl border border-[#DED3E3] bg-[#FFFDF9] space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[#765B9E]">
            <span className="text-xs font-medium">Escrow Locked</span>
            <Lock className="w-4 h-4 text-[#9B83BD]" />
          </div>
          <div className="text-2xl font-extrabold text-[#765B9E]">
            {formatCurrency(user?.wallet?.escrow || 0)}
          </div>
          <p className="text-[10px] text-[#6F6675]">Secured in ongoing project stages</p>
        </div>

        {/* Active Projects */}
        <div className="p-5 rounded-2xl border border-[#DED3E3] bg-[#FFFDF9] space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[#6F6675]">
            <span className="text-xs font-medium">Active Collaborations</span>
            <Briefcase className="w-4 h-4 text-[#765B9E]" />
          </div>
          <div className="text-2xl font-extrabold text-[#302A35]">{activeProjects.length}</div>
          <p className="text-[10px] text-[#765B9E] font-medium">
            {openProjects.length} projects accepting proposals
          </p>
        </div>

        {/* Completed Projects */}
        <div className="p-5 rounded-2xl border border-[#DED3E3] bg-[#FFFDF9] space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[#6F6675]">
            <span className="text-xs font-medium">Completed Projects</span>
            <CheckCircle2 className="w-4 h-4 text-[#789B83]" />
          </div>
          <div className="text-2xl font-extrabold text-[#789B83]">{completedProjects.length}</div>
          <p className="text-[10px] text-[#6F6675]">100% milestones delivered & paid</p>
        </div>
      </div>

      {/* ACTIVE PROJECTS LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#302A35] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#9B83BD]" />
              My Active Projects & Milestone Progress
            </h3>
            <p className="text-xs text-[#6F6675] mt-0.5">
              Track real-time progress, review milestone submissions, and release payments
            </p>
          </div>

          <button
            onClick={() => onNavigate('post-project')}
            className="text-xs font-bold text-[#765B9E] hover:text-[#9B83BD] flex items-center gap-1"
          >
            <span>+ New Project</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-xs text-[#6F6675]">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-[#DED3E3] bg-[#FFFDF9]">
            <Briefcase className="w-12 h-12 text-[#968D99] mx-auto mb-3 opacity-60" />
            <h4 className="text-base font-bold text-[#302A35]">No Projects Posted Yet</h4>
            <p className="text-xs text-[#6F6675] max-w-sm mx-auto mt-1 mb-4">
              Post your first project, hire a top freelancer, and pay securely in structured milestones.
            </p>
            <button
              onClick={() => onNavigate('post-project')}
              className="px-6 py-2.5 rounded-xl bg-[#9B83BD] hover:bg-[#8F78B5] text-white font-bold text-xs shadow-sm transition-all"
            >
              Post Project Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
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
                      Completed
                    </span>
                    <span className="font-extrabold text-[#765B9E]">{project.progress || 0}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#EEE6F5] overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full bg-[#9B83BD] transition-all duration-500"
                      style={{ width: `${project.progress || 0}%` }}
                    />
                  </div>
                </div>

                {/* Freelancer + Action Footer */}
                <div className="pt-3 border-t border-[#DED3E3]/60 flex items-center justify-between text-xs">
                  {project.freelancerId ? (
                    <div className="flex items-center gap-2">
                      <img
                        src={project.freelancerId.avatar}
                        alt={project.freelancerId.name}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-[#9B83BD]/40"
                      />
                      <span className="text-[#302A35] font-medium">
                        Hired: {project.freelancerId.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[#C29A68] font-medium">
                      Awaiting proposal selection
                    </span>
                  )}

                  <span className="font-bold text-[#765B9E] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Manage Milestones <ChevronRight className="w-3.5 h-3.5" />
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
