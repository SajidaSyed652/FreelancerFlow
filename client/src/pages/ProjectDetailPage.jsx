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
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-[#6F6675]">
        Loading project workspace...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h3 className="text-lg font-bold text-[#302A35] mb-2">Project Not Found</h3>
        <button
          onClick={() => onNavigate('browse-projects')}
          className="text-xs text-[#765B9E] hover:underline"
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
        className="inline-flex items-center gap-1 text-xs font-bold text-[#6F6675] hover:text-[#302A35] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      {/* PROJECT HEADER CARD */}
      <div className="p-6 sm:p-8 rounded-3xl border border-[#DED3E3] bg-[#FFFDF9] shadow-md space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#EEE6F5] text-[#765B9E] border border-[#DED3E3]">
                {project.category}
              </span>
              <StatusBadge status={project.status} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#302A35] leading-tight">
              {project.title}
            </h1>

            <p className="text-xs sm:text-sm text-[#6F6675] leading-relaxed max-w-4xl">
              {project.description}
            </p>

            {/* Skills chips */}
            {project.skills?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-[#EEE6F5]/50 border border-[#DED3E3] text-xs text-[#6F6675] font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right Metrics Box */}
          <div className="p-5 rounded-2xl bg-[#EEE6F5]/40 border border-[#DED3E3] lg:w-72 shrink-0 space-y-4">
            <div>
              <span className="text-[11px] text-[#6F6675] block font-medium">Total Project Budget</span>
              <span className="text-2xl font-extrabold text-[#765B9E]">
                {formatCurrency(project.budget)}
              </span>
            </div>

            <div className="pt-3 border-t border-[#DED3E3]/60 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#6F6675]">Target Deadline:</span>
                <span className={`font-bold ${deadlineInfo.color}`}>{formatDate(project.deadline)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#6F6675]">Escrow Security:</span>
                <span className="font-bold text-[#789B83] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Locked
                </span>
              </div>
            </div>

            {/* Project action buttons */}
            {(isProjectClient || isProjectFreelancer) && (
              <div className="pt-3 border-t border-[#DED3E3]/60 space-y-2">
                {isCompleted && (
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="w-full py-2.5 rounded-xl bg-[#C29A68] hover:bg-[#B08958] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <Star className="w-3.5 h-3.5 fill-white" />
                    Leave Rating & Review
                  </button>
                )}

                <button
                  onClick={() => setShowDisputeModal(true)}
                  className="w-full py-2 rounded-xl border border-[#E4C0C0] text-[#B97878] text-xs font-semibold hover:bg-[#F9EFEF] transition-colors flex items-center justify-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-[#B97878]" />
                  Raise Dispute / Issue
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Client & Freelancer Collaborator Bar */}
        <div className="pt-4 border-t border-[#DED3E3]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <img
              src={project.clientId?.avatar}
              alt={project.clientId?.name}
              className="w-8 h-8 rounded-xl object-cover ring-1 ring-[#9B83BD]/40"
            />
            <div>
              <p className="font-bold text-[#302A35]">Client: {project.clientId?.name}</p>
              <p className="text-[11px] text-[#6F6675]">{project.clientId?.title || 'Project Owner'}</p>
            </div>
          </div>

          {project.freelancerId ? (
            <div className="flex items-center gap-3">
              <img
                src={project.freelancerId?.avatar}
                alt={project.freelancerId?.name}
                className="w-8 h-8 rounded-xl object-cover ring-1 ring-[#789B83]/40"
              />
              <div>
                <p className="font-bold text-[#302A35]">Freelancer: {project.freelancerId?.name}</p>
                <p className="text-[11px] text-[#789B83] font-semibold">
                  {project.freelancerId?.title || 'Selected Specialist'}
                </p>
              </div>
            </div>
          ) : (
            <span className="text-[#C29A68] font-semibold">
              Accepting proposals from freelancers
            </span>
          )}
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-[#DED3E3] pb-1">
        <button
          onClick={() => setActiveTab('milestones')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'milestones'
              ? 'bg-[#EEE6F5] text-[#765B9E] border border-[#DED3E3]'
              : 'text-[#6F6675] hover:text-[#302A35]'
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
                ? 'bg-[#EEE6F5] text-[#765B9E] border border-[#DED3E3]'
                : 'text-[#6F6675] hover:text-[#302A35]'
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
                ? 'bg-[#EEE6F5] text-[#765B9E] border border-[#DED3E3]'
                : 'text-[#6F6675] hover:text-[#302A35]'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-[#765B9E]" />
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
            <h3 className="text-base font-bold text-[#302A35]">
              Freelancer Proposals ({proposals.length})
            </h3>
            <span className="text-xs text-[#6F6675]">
              Select the best proposal to assign the project and start milestone funding
            </span>
          </div>

          {proposals.length === 0 ? (
            <div className="text-center py-16 rounded-3xl border border-dashed border-[#DED3E3] bg-[#FFFDF9]">
              <p className="text-xs text-[#6F6675]">No proposals received yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {proposals.map((prop) => (
                <div
                  key={prop._id}
                  className={`p-6 rounded-3xl border transition-all space-y-4 shadow-sm ${
                    prop.status === 'ACCEPTED'
                      ? 'bg-[#EDF4EF]/80 border-[#C8DECF]'
                      : 'bg-[#FFFDF9] border-[#DED3E3]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prop.freelancerId?.avatar}
                        alt={prop.freelancerId?.name}
                        className="w-12 h-12 rounded-2xl object-cover ring-1 ring-[#9B83BD]/40"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#302A35]">{prop.freelancerId?.name}</h4>
                          <span className="text-[#C29A68] text-xs font-bold">
                            ★ {prop.freelancerId?.ratings?.avg || 5.0}
                          </span>
                        </div>
                        <p className="text-xs text-[#6F6675]">{prop.freelancerId?.title}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold text-[#789B83]">
                        {formatCurrency(prop.bidAmount)}
                      </span>
                      <p className="text-[11px] text-[#6F6675] font-mono">
                        in {prop.deliveryDays} delivery days
                      </p>
                    </div>
                  </div>

                  {/* Cover letter */}
                  <p className="text-xs text-[#302A35] bg-[#EEE6F5]/40 border border-[#DED3E3]/60 p-4 rounded-2xl leading-relaxed whitespace-pre-line">
                    {prop.coverLetter}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <StatusBadge status={prop.status} />

                    {prop.status === 'PENDING' && project.status === 'OPEN' && (
                      <button
                        onClick={() => handleHireFreelancer(prop._id)}
                        className="px-5 py-2.5 rounded-xl bg-[#789B83] hover:bg-[#688A72] text-white font-extrabold text-xs shadow-sm transition-all"
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
