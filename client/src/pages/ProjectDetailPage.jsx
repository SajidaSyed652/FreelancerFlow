import React, { useState, useEffect } from 'react';
import {
  Layers,
  Calendar,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  AlertTriangle,
  Star,
  ChevronLeft,
  Sparkles,
  Lock,
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate, getDeadlineStatus } from '../utils/formatters';
import { StatusBadge } from '../components/common/StatusBadge';
import { MilestoneTimeline } from '../components/milestones/MilestoneTimeline';
import { MilestoneDetailModal } from '../components/milestones/MilestoneDetailModal';
import { CreateMilestoneModal } from '../components/milestones/CreateMilestoneModal';
import { ProjectChat } from '../components/chat/ProjectChat';
import { DisputeModal } from '../components/disputes/DisputeModal';
import { ReviewModal } from '../components/reviews/ReviewModal';

export const ProjectDetailPage = ({ projectId, onNavigate, onOpenDeposit }) => {
  const { user, isClient, isFreelancer, isAdmin } = useAuth();
  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [activeTab, setActiveTab] = useState('milestones'); // 'milestones' | 'proposals' | 'chat'
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [showCreateMilestones, setShowCreateMilestones] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  const fetchProjectDetails = async () => {
    setLoading(true);
    try {
      const data = await api.get(`/projects/${projectId}`);
      if (data.success) {
        setProject(data.project);
        setMilestones(data.milestones || []);

        // If client, also fetch proposals
        if (data.project.clientId?._id === user?._id || isAdmin) {
          fetchProposals();
        }
      }
    } catch (err) {
      console.error('Failed to load project:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProposals = async () => {
    try {
      const data = await api.get(`/proposals/project/${projectId}`);
      if (data.success) {
        setProposals(data.proposals || []);
      }
    } catch (err) {
      console.error('Failed to load proposals:', err);
    }
  };

  const handleHireFreelancer = async (proposalId) => {
    try {
      const data = await api.put(`/proposals/${proposalId}/accept`);
      if (data.success) {
        await fetchProjectDetails();
        setShowCreateMilestones(true); // Guide client to define milestones next
      }
    } catch (err) {
      console.error('Failed to hire freelancer:', err);
    }
  };

  const handleMilestoneUpdated = (updatedMilestone) => {
    setMilestones((prev) =>
      prev.map((m) => (m._id === updatedMilestone._id ? updatedMilestone : m))
    );
    fetchProjectDetails();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-slate-400">
        Loading project workspace...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h3 className="text-lg font-bold text-white mb-2">Project Not Found</h3>
        <button
          onClick={() => onNavigate('browse-projects')}
          className="text-xs text-purple-400 hover:underline"
        >
          ← Return to Projects
        </button>
      </div>
    );
  }

  const deadlineInfo = getDeadlineStatus(project.deadline);
  const isProjectClient = project.clientId?._id === user?._id;
  const isProjectFreelancer = project.freelancerId?._id === user?._id;
  const isCompleted = project.status === 'COMPLETED';

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => onNavigate(isClient ? 'client-dashboard' : 'browse-projects')}
        className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      {/* PROJECT HEADER CARD */}
      <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {project.category}
              </span>
              <StatusBadge status={project.status} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {project.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
              {project.description}
            </p>

            {/* Skills chips */}
            {project.skills?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-slate-300 font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right Metrics Box */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] lg:w-72 shrink-0 space-y-4">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Total Project Budget</span>
              <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400">
                {formatCurrency(project.budget)}
              </span>
            </div>

            <div className="pt-3 border-t border-white/[0.06] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Target Deadline:</span>
                <span className={`font-bold ${deadlineInfo.color}`}>{formatDate(project.deadline)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Escrow Security:</span>
                <span className="font-bold text-cyan-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Locked
                </span>
              </div>
            </div>

            {/* Project action buttons */}
            {(isProjectClient || isProjectFreelancer) && (
              <div className="pt-3 border-t border-white/[0.06] space-y-2">
                {isCompleted && (
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-glow-purple"
                  >
                    <Star className="w-3.5 h-3.5 fill-black" />
                    Leave Rating & Review
                  </button>
                )}

                <button
                  onClick={() => setShowDisputeModal(true)}
                  className="w-full py-2 rounded-xl border border-rose-500/30 text-rose-300 text-xs font-semibold hover:bg-rose-500/10 transition-colors flex items-center justify-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  Raise Dispute / Issue
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Client & Freelancer Collaborator Bar */}
        <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <img
              src={project.clientId?.avatar}
              alt={project.clientId?.name}
              className="w-8 h-8 rounded-xl object-cover ring-1 ring-purple-500/40"
            />
            <div>
              <p className="font-bold text-white">Client: {project.clientId?.name}</p>
              <p className="text-[11px] text-slate-400">{project.clientId?.title || 'Project Owner'}</p>
            </div>
          </div>

          {project.freelancerId ? (
            <div className="flex items-center gap-3">
              <img
                src={project.freelancerId?.avatar}
                alt={project.freelancerId?.name}
                className="w-8 h-8 rounded-xl object-cover ring-1 ring-cyan-500/40"
              />
              <div>
                <p className="font-bold text-white">Freelancer: {project.freelancerId?.name}</p>
                <p className="text-[11px] text-cyan-300">
                  {project.freelancerId?.title || 'Selected Specialist'}
                </p>
              </div>
            </div>
          ) : (
            <span className="text-amber-400 font-medium">
              Accepting proposals from freelancers
            </span>
          )}
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1">
        <button
          onClick={() => setActiveTab('milestones')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'milestones'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Milestones Engine ({milestones.length})</span>
        </button>

        {isProjectClient && (
          <button
            onClick={() => setActiveTab('proposals')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'proposals'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Freelancer Proposals ({proposals.length})</span>
          </button>
        )}

        {project.freelancerId && (
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'chat'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>Live Project Chat</span>
          </button>
        )}
      </div>

      {/* TAB 1: MILESTONES WORKSPACE */}
      {activeTab === 'milestones' && (
        <MilestoneTimeline
          milestones={milestones}
          project={project}
          onSelectMilestone={(m) => setSelectedMilestone(m)}
          onOpenCreateMilestones={() => setShowCreateMilestones(true)}
        />
      )}

      {/* TAB 2: PROPOSALS (For Client to Review and Hire) */}
      {activeTab === 'proposals' && isProjectClient && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">
              Freelancer Proposals ({proposals.length})
            </h3>
            <span className="text-xs text-slate-400">
              Select the best proposal to assign the project and start milestone funding
            </span>
          </div>

          {proposals.length === 0 ? (
            <div className="text-center py-16 rounded-3xl border border-dashed border-white/10 bg-white/[0.02]">
              <p className="text-xs text-slate-400">No proposals received yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {proposals.map((prop) => (
                <div
                  key={prop._id}
                  className={`p-6 rounded-3xl border backdrop-blur-xl transition-all space-y-4 ${
                    prop.status === 'ACCEPTED'
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-white/[0.03] border-white/10'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prop.freelancerId?.avatar}
                        alt={prop.freelancerId?.name}
                        className="w-12 h-12 rounded-2xl object-cover ring-1 ring-purple-500/40"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{prop.freelancerId?.name}</h4>
                          <span className="text-amber-400 text-xs font-bold">
                            ★ {prop.freelancerId?.ratings?.avg || 5.0}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{prop.freelancerId?.title}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold text-emerald-400">
                        {formatCurrency(prop.bidAmount)}
                      </span>
                      <p className="text-[11px] text-slate-400 font-mono">
                        in {prop.deliveryDays} delivery days
                      </p>
                    </div>
                  </div>

                  {/* Cover letter */}
                  <p className="text-xs text-slate-300 bg-white/[0.02] border border-white/[0.06] p-4 rounded-2xl leading-relaxed whitespace-pre-line">
                    {prop.coverLetter}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <StatusBadge status={prop.status} />

                    {prop.status === 'PENDING' && project.status === 'OPEN' && (
                      <button
                        onClick={() => handleHireFreelancer(prop._id)}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-glow-cyan transition-all"
                      >
                        Hire {prop.freelancerId?.name?.split(' ')[0]} & Setup Milestones
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: LIVE PROJECT CHAT */}
      {activeTab === 'chat' && project.freelancerId && (
        <ProjectChat project={project} />
      )}

      {/* MODALS */}
      {selectedMilestone && (
        <MilestoneDetailModal
          milestone={selectedMilestone}
          project={project}
          isOpen={!!selectedMilestone}
          onClose={() => setSelectedMilestone(null)}
          onMilestoneUpdated={handleMilestoneUpdated}
        />
      )}

      {showCreateMilestones && (
        <CreateMilestoneModal
          project={project}
          isOpen={showCreateMilestones}
          onClose={() => setShowCreateMilestones(false)}
          onMilestonesCreated={(newMilestones) => {
            setMilestones(newMilestones);
            fetchProjectDetails();
          }}
          onOpenDeposit={onOpenDeposit}
        />
      )}

      {showDisputeModal && (
        <DisputeModal
          project={project}
          isOpen={showDisputeModal}
          onClose={() => setShowDisputeModal(false)}
          onDisputeRaised={() => fetchProjectDetails()}
        />
      )}

      {showReviewModal && (
        <ReviewModal
          project={project}
          revieweeId={isProjectClient ? project.freelancerId?._id : project.clientId?._id}
          revieweeName={isProjectClient ? project.freelancerId?.name : project.clientId?.name}
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onReviewSubmitted={() => fetchProjectDetails()}
        />
      )}
    </div>
  );
};
