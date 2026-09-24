import React from 'react';
import {
  CheckCircle2,
  Clock,
  Send,
  Eye,
  AlertCircle,
  FileCheck2,
  Calendar,
  Layers,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { formatCurrency, formatDate, getDeadlineStatus } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

export const MilestoneTimeline = ({
  milestones = [],
  project,
  onSelectMilestone,
  onOpenCreateMilestones,
}) => {
  const { user, isClient, isFreelancer } = useAuth();

  const totalAmount = milestones.reduce((sum, m) => sum + Number(m.amount || 0), 0);
  const completedCount = milestones.filter(
    (m) => m.status === 'APPROVED' || m.status === 'COMPLETED'
  ).length;
  const progressPercent = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Milestone Header & Progress Bar */}
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">Milestone Workflow</h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                {completedCount} of {milestones.length} Completed
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Funds are held safely in escrow and released sequentially upon client approval.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Total Funded:</span>
              <span className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                {formatCurrency(totalAmount)}
              </span>
            </div>

            {isClient && project?.status === 'OPEN' && milestones.length === 0 && (
              <button
                onClick={onOpenCreateMilestones}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-glow-purple flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Define Milestones
              </button>
            )}
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300">Overall Progress</span>
            <span className="text-cyan-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-white/[0.06] overflow-hidden p-0.5 border border-white/[0.08]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 transition-all duration-700 shadow-glow-purple"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Empty State */}
      {milestones.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-white/15 bg-white/[0.02]">
          <Layers className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-60" />
          <h4 className="text-base font-bold text-white">No Milestones Defined Yet</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            {isClient
              ? 'Divide your project budget into structured stages (UI, Frontend, Backend, Deployment) to start work.'
              : 'The client will create structured milestones for this project soon.'}
          </p>
          {isClient && (
            <button
              onClick={onOpenCreateMilestones}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-glow-purple transition-all"
            >
              + Create & Fund Milestones
            </button>
          )}
        </div>
      ) : (
        /* Vertical Step-by-Step Timeline */
        <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-3 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:via-cyan-500 before:to-slate-700">
          {milestones.map((milestone, idx) => {
            const deadlineInfo = getDeadlineStatus(milestone.deadline);
            const isApproved = milestone.status === 'APPROVED' || milestone.status === 'COMPLETED';
            const isSubmitted = milestone.status === 'SUBMITTED';
            const isInProgress = milestone.status === 'IN_PROGRESS';
            const isRevision = milestone.status === 'REVISION_REQUESTED';

            return (
              <div
                key={milestone._id || idx}
                className="relative group transition-all duration-300"
              >
                {/* Node Bullet Marker */}
                <div
                  className={`absolute -left-[30px] top-4 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold z-10 transition-all ${
                    isApproved
                      ? 'bg-emerald-500 border-emerald-300 text-black shadow-glow-cyan'
                      : isSubmitted
                      ? 'bg-amber-500 border-amber-300 text-black animate-pulse'
                      : isRevision
                      ? 'bg-orange-500 border-orange-300 text-white'
                      : isInProgress
                      ? 'bg-cyan-500 border-cyan-300 text-black'
                      : 'bg-[#0f0f29] border-slate-600 text-slate-400'
                  }`}
                >
                  {isApproved ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span>{milestone.order}</span>
                  )}
                </div>

                {/* Milestone Card */}
                <div
                  onClick={() => onSelectMilestone(milestone)}
                  className={`p-5 rounded-2xl border backdrop-blur-xl cursor-pointer transition-all duration-300 ${
                    isInProgress || isSubmitted || isRevision
                      ? 'bg-white/[0.06] border-purple-500/40 shadow-glow-purple'
                      : isApproved
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">
                          Milestone {milestone.order}
                        </span>
                        <StatusBadge status={milestone.status} />

                        {milestone.submissionCount > 0 && (
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-slate-300 font-mono">
                            Attempt #{milestone.submissionCount}
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                        {milestone.title}
                      </h4>

                      {milestone.description && (
                        <p className="text-xs text-slate-300/80 line-clamp-2 leading-relaxed">
                          {milestone.description}
                        </p>
                      )}
                    </div>

                    {/* Right side: Amount and Deadline */}
                    <div className="flex md:flex-col items-end justify-between md:justify-start gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/[0.07]">
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block md:hidden">Amount:</span>
                        <span className="text-base font-extrabold text-emerald-400">
                          {formatCurrency(milestone.amount)}
                        </span>
                      </div>

                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${deadlineInfo.bg} ${deadlineInfo.color}`}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(milestone.deadline)}</span>
                        <span className="text-[10px] opacity-80 font-mono">
                          ({deadlineInfo.text})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Feedback / Revision callout if any */}
                  {milestone.feedback && (
                    <div className="mt-3.5 p-3 rounded-xl bg-orange-950/30 border border-orange-500/30 text-xs text-orange-200 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-orange-300">Client Feedback: </span>
                        <span>{milestone.feedback}</span>
                      </div>
                    </div>
                  )}

                  {/* Action Banner inside card */}
                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      {isApproved
                        ? `Approved on ${formatDate(milestone.approvedAt || milestone.updatedAt)}`
                        : isSubmitted
                        ? 'Deliverable submitted — review pending'
                        : isRevision
                        ? 'Changes requested by client — awaiting resubmission'
                        : isInProgress
                        ? 'Work in progress'
                        : 'Awaiting prior milestone completion'}
                    </span>

                    <button className="flex items-center gap-1 font-bold text-purple-400 group-hover:text-purple-300 group-hover:translate-x-0.5 transition-all">
                      <span>View & Actions</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
