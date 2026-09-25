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
      <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#DED3E3] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#9B83BD]" />
              <h3 className="text-lg font-bold text-[#302A35]">Milestone Workflow</h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EEE6F5] text-[#765B9E] font-semibold border border-[#DED3E3]">
                {completedCount} of {milestones.length} Completed
              </span>
            </div>
            <p className="text-xs text-[#6F6675] mt-1">
              Funds are held safely in escrow and released sequentially upon client approval.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-[#6F6675] block">Total Funded:</span>
              <span className="text-base font-extrabold text-[#765B9E]">
                {formatCurrency(totalAmount)}
              </span>
            </div>

            {isClient && project?.status === 'OPEN' && milestones.length === 0 && (
              <button
                onClick={onOpenCreateMilestones}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#9B83BD] hover:bg-[#8F78B5] text-white shadow-sm flex items-center gap-1.5 transition-all"
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
            <span className="text-[#6F6675]">Overall Progress</span>
            <span className="text-[#765B9E] font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-[#EEE6F5] overflow-hidden p-0.5 border border-[#DED3E3]">
            <div
              className="h-full rounded-full bg-[#9B83BD] transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Empty State */}
      {milestones.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-[#DED3E3] bg-[#FFFDF9]">
          <Layers className="w-12 h-12 text-[#968D99] mx-auto mb-3 opacity-60" />
          <h4 className="text-base font-bold text-[#302A35]">No Milestones Defined Yet</h4>
          <p className="text-xs text-[#6F6675] max-w-sm mx-auto mt-1 mb-4">
            {isClient
              ? 'Divide your project budget into structured stages (UI, Frontend, Backend, Deployment) to start work.'
              : 'The client will create structured milestones for this project soon.'}
          </p>
          {isClient && (
            <button
              onClick={onOpenCreateMilestones}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#9B83BD] hover:bg-[#8F78B5] text-white shadow-sm transition-all"
            >
              + Create & Fund Milestones
            </button>
          )}
        </div>
      ) : (
        /* Vertical Step-by-Step Timeline */
        <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-3 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-[#9B83BD] before:via-[#B9A7D9] before:to-[#DED3E3]">
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
                      ? 'bg-[#789B83] border-[#C8DECF] text-white shadow-sm'
                      : isSubmitted
                      ? 'bg-[#C29A68] border-[#E8D3BA] text-white animate-pulse'
                      : isRevision
                      ? 'bg-[#C06A45] border-[#F2C9B8] text-white'
                      : isInProgress
                      ? 'bg-[#9B83BD] border-[#D8CDE8] text-white'
                      : 'bg-[#FFFDF9] border-[#DED3E3] text-[#6F6675]'
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
                  className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 shadow-sm ${
                    isInProgress || isSubmitted || isRevision
                      ? 'bg-[#FFFDF9] border-[#9B83BD] shadow-[0_4px_20px_rgba(155,131,189,0.12)]'
                      : isApproved
                      ? 'bg-[#EDF4EF]/70 border-[#C8DECF]'
                      : 'bg-[#FFFDF9] border-[#DED3E3] hover:border-[#9B83BD]'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-extrabold text-[#765B9E] uppercase tracking-wider">
                          Milestone {milestone.order}
                        </span>
                        <StatusBadge status={milestone.status} />

                        {milestone.submissionCount > 0 && (
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#EEE6F5] border border-[#DED3E3] text-[#765B9E] font-mono">
                            Attempt #{milestone.submissionCount}
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-[#302A35] group-hover:text-[#765B9E] transition-colors">
                        {milestone.title}
                      </h4>

                      {milestone.description && (
                        <p className="text-xs text-[#6F6675] line-clamp-2 leading-relaxed">
                          {milestone.description}
                        </p>
                      )}
                    </div>

                    {/* Right side: Amount and Deadline */}
                    <div className="flex md:flex-col items-end justify-between md:justify-start gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#DED3E3]/60">
                      <div className="text-right">
                        <span className="text-xs text-[#6F6675] block md:hidden">Amount:</span>
                        <span className="text-base font-extrabold text-[#789B83]">
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
                    <div className="mt-3.5 p-3 rounded-xl bg-[#FAF3EA] border border-[#E8D3BA] text-xs text-[#302A35] flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-[#C29A68] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-[#C29A68]">Client Feedback: </span>
                        <span>{milestone.feedback}</span>
                      </div>
                    </div>
                  )}

                  {/* Action Banner inside card */}
                  <div className="mt-4 pt-3 border-t border-[#DED3E3]/60 flex items-center justify-between text-xs">
                    <span className="text-[#6F6675] font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#9B83BD]" />
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

                    <button className="flex items-center gap-1 font-bold text-[#765B9E] group-hover:text-[#9B83BD] group-hover:translate-x-0.5 transition-all">
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
