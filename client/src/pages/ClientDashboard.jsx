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
  const totalSpent = projects.reduce((acc, p) => acc + (p.completedMilestones > 0 ? (p.budget * (p.progress / 100)) : 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Client Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-xl">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-500/40 shadow-glow-purple"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 uppercase">
                Client Workspace
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user?.title || 'Project Manager'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDeposit}
            className="px-4 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/30 text-emerald-300 text-xs font-bold hover:bg-emerald-900/40 transition-all flex items-center gap-1.5"
          >
            <Wallet className="w-4 h-4 text-emerald-400" />
            + Deposit Wallet
          </button>
          <button
            onClick={() => onNavigate('post-project')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-glow-purple flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Post New Project
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Wallet Balance */}
        <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Available Balance</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {formatCurrency(user?.wallet?.balance || 0)}
          </div>
          <p className="text-[10px] text-slate-400">Ready to lock into milestone escrow</p>
        </div>

        {/* Escrow Locked */}
        <div className="p-5 rounded-2xl border border-purple-500/30 bg-purple-950/20 backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between text-purple-300">
            <span className="text-xs font-medium">Escrow Locked</span>
            <Lock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            {formatCurrency(user?.wallet?.escrow || 0)}
          </div>
          <p className="text-[10px] text-purple-300/80">Secured in ongoing project stages</p>
        </div>

        {/* Active Projects */}
        <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Active Collaborations</span>
            <Briefcase className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{activeProjects.length}</div>
          <p className="text-[10px] text-cyan-400 font-medium">
            {openProjects.length} projects accepting proposals
          </p>
        </div>

        {/* Completed Projects */}
        <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Completed Projects</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">{completedProjects.length}</div>
          <p className="text-[10px] text-slate-400">100% milestones delivered & paid</p>
        </div>
      </div>

      {/* ACTIVE PROJECTS LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              My Active Projects & Milestone Progress
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Track real-time progress, review milestone submissions, and release payments
            </p>
          </div>

          <button
            onClick={() => onNavigate('post-project')}
            className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <span>+ New Project</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-xs text-slate-400">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-white/15 bg-white/[0.02]">
            <Briefcase className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-60" />
            <h4 className="text-base font-bold text-white">No Projects Posted Yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              Post your first project, hire a top freelancer, and pay securely in structured milestones.
            </p>
            <button
              onClick={() => onNavigate('post-project')}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-glow-purple transition-all"
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
                className="p-6 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:border-purple-500/40 hover:bg-white/[0.06] cursor-pointer transition-all duration-300 space-y-4 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <StatusBadge status={project.status} />
                      <span className="text-[10px] font-bold text-slate-400">
                        {project.category}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                      {project.title}
                    </h4>
                  </div>
                  <span className="text-sm font-extrabold text-emerald-400 shrink-0">
                    {formatCurrency(project.budget)}
                  </span>
                </div>

                <p className="text-xs text-slate-300/80 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">
                      {project.completedMilestones || 0} of {project.milestoneCount || 0} Milestones
                      Completed
                    </span>
                    <span className="font-extrabold text-cyan-400">{project.progress || 0}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-500"
                      style={{ width: `${project.progress || 0}%` }}
                    />
                  </div>
                </div>

                {/* Freelancer + Action Footer */}
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  {project.freelancerId ? (
                    <div className="flex items-center gap-2">
                      <img
                        src={project.freelancerId.avatar}
                        alt={project.freelancerId.name}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-purple-500/40"
                      />
                      <span className="text-slate-300 font-medium">
                        Hired: {project.freelancerId.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-amber-400 font-medium">
                      Awaiting proposal selection
                    </span>
                  )}

                  <span className="font-bold text-purple-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
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
