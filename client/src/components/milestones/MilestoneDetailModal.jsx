import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Upload,
  ExternalLink,
  FileText,
  Clock,
  Sparkles,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  History,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate, getDeadlineStatus } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';

export const MilestoneDetailModal = ({
  milestone,
  project,
  isOpen,
  onClose,
  onMilestoneUpdated,
}) => {
  const { user, isClient, isFreelancer, refreshUser } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form states for submission
  const [deliverableNote, setDeliverableNote] = useState('');
  const [demoLink, setDemoLink] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  // Form states for review
  const [reviewTab, setReviewTab] = useState('approve'); // 'approve' | 'revision'
  const [feedbackNote, setFeedbackNote] = useState('');

  useEffect(() => {
    if (isOpen && milestone?._id) {
      fetchSubmissions();
      setError(null);
    }
  }, [isOpen, milestone]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const data = await api.get(`/milestones/${milestone._id}/submissions`);
      if (data.success) {
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !milestone) return null;

  const isApproved = milestone.status === 'APPROVED' || milestone.status === 'COMPLETED';
  const isSubmitted = milestone.status === 'SUBMITTED';
  const isRevision = milestone.status === 'REVISION_REQUESTED';
  const isInProgress = milestone.status === 'IN_PROGRESS';
  const deadlineInfo = getDeadlineStatus(milestone.deadline);

  // Freelancer submits or resubmits work
  const handleSubmitDeliverable = async (e) => {
    e.preventDefault();
    if (!deliverableNote.trim()) {
      setError('Please provide a description of the completed work.');
      return;
    }

    setActionLoading(true);
    setError(null);
    try {
      const files = fileName && fileUrl ? [{ name: fileName, url: fileUrl, type: 'document' }] : [];
      const data = await api.post(`/milestones/${milestone._id}/submit`, {
        description: deliverableNote,
        demoLink,
        files,
      });

      if (data.success) {
        setDeliverableNote('');
        setDemoLink('');
        setFileName('');
        setFileUrl('');
        await fetchSubmissions();
        onMilestoneUpdated(data.milestone);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Client approves milestone and releases payment
  const handleApproveMilestone = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const data = await api.put(`/milestones/${milestone._id}/approve`, {
        feedback: feedbackNote || 'Great work! Approved and paid.',
      });

      if (data.success) {
        // Confetti celebration 🎉
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#9B83BD', '#B9A7D9', '#789B83', '#C29A68'],
        });

        await refreshUser();
        onMilestoneUpdated(data.milestone);
        await fetchSubmissions();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Client requests revisions
  const handleRequestRevision = async () => {
    if (!feedbackNote.trim()) {
      setError('Please explain what changes are requested.');
      return;
    }

    setActionLoading(true);
    setError(null);
    try {
      const data = await api.put(`/milestones/${milestone._id}/revision`, {
        feedback: feedbackNote,
      });

      if (data.success) {
        onMilestoneUpdated(data.milestone);
        await fetchSubmissions();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-[#DED3E3] bg-[#FFFDF9] p-6 shadow-2xl my-8 text-[#302A35]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#6F6675] hover:text-[#302A35] hover:bg-[#EEE6F5] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-[#EEE6F5] border border-[#DED3E3] flex items-center justify-center font-extrabold text-[#765B9E] shrink-0 shadow-sm">
            #{milestone.order}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-bold text-[#765B9E] uppercase tracking-wider">
                Stage {milestone.order} of {project?.milestoneCount || 4}
              </span>
              <StatusBadge status={milestone.status} />
            </div>
            <h3 className="text-xl font-bold text-[#302A35] leading-tight">{milestone.title}</h3>
          </div>
        </div>

        {/* Milestone Metadata Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#EEE6F5]/50 border border-[#DED3E3] mb-6">
          <div>
            <span className="text-[11px] text-[#6F6675] block font-medium">Stage Payout</span>
            <span className="text-base font-extrabold text-[#789B83]">
              {formatCurrency(milestone.amount)}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-[#6F6675] block font-medium">Due Date</span>
            <span className={`text-xs font-bold ${deadlineInfo.color}`}>
              {formatDate(milestone.deadline)} ({deadlineInfo.text})
            </span>
          </div>

          <div>
            <span className="text-[11px] text-[#6F6675] block font-medium">Escrow Security</span>
            <span className="text-xs font-bold text-[#789B83] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Guaranteed
            </span>
          </div>
        </div>

        {/* Milestone Scope Description */}
        {milestone.description && (
          <div className="mb-6">
            <h4 className="text-xs font-bold text-[#302A35] uppercase tracking-wider mb-1.5">
              Deliverable Scope & Criteria
            </h4>
            <p className="text-xs text-[#302A35] bg-[#EEE6F5]/30 border border-[#DED3E3] p-3.5 rounded-xl leading-relaxed">
              {milestone.description}
            </p>
          </div>
        )}

        {/* SUBMISSIONS & REVISION TRAIL */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-[#302A35] uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-4 h-4 text-[#765B9E]" />
              Submission & Revision History ({submissions.length})
            </h4>
          </div>

          {loading ? (
            <div className="text-center py-6 text-xs text-[#6F6675]">Loading submissions...</div>
          ) : submissions.length === 0 ? (
            <div className="p-4 rounded-xl bg-[#FFFDF9] border border-dashed border-[#DED3E3] text-center text-xs text-[#6F6675]">
              No deliverables submitted yet for this milestone stage.
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {submissions.map((sub) => (
                <div
                  key={sub._id}
                  className={`p-4 rounded-xl border text-xs transition-all ${
                    sub.status === 'APPROVED'
                      ? 'bg-[#EDF4EF] border-[#C8DECF]'
                      : sub.status === 'REVISION_REQUESTED'
                      ? 'bg-[#FAF3EA] border-[#E8D3BA]'
                      : 'bg-[#FFFDF9] border-[#DED3E3]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-[#302A35]">
                        Submission #{sub.submissionNumber}
                      </span>
                      <StatusBadge status={sub.status} />
                    </div>
                    <span className="text-[11px] text-[#6F6675]">
                      {formatDate(sub.submittedAt)}
                    </span>
                  </div>

                  <p className="text-[#302A35] mb-2 leading-relaxed">{sub.description}</p>

                  {/* Links / Files */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#DED3E3]/60">
                    {sub.demoLink && (
                      <a
                        href={sub.demoLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EEE6F5] border border-[#DED3E3] text-[#765B9E] font-semibold hover:bg-[#D8CDE8] transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" /> Live Demo Link
                      </a>
                    )}
                    {sub.files?.map((f, i) => (
                      <a
                        key={i}
                        href={f.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EEE6F5] border border-[#DED3E3] text-[#765B9E] font-semibold hover:bg-[#D8CDE8] transition-colors"
                      >
                        <FileText className="w-3 h-3" /> {f.name || 'Deliverable File'}
                      </a>
                    ))}
                  </div>

                  {/* Client Feedback attached to this submission */}
                  {sub.clientFeedback && (
                    <div className="mt-2.5 p-2.5 rounded-lg bg-[#FAF3EA] border border-[#E8D3BA] text-[#302A35]">
                      <span className="font-bold text-[#C29A68]">Client Review: </span>
                      <span>{sub.clientFeedback}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-[#F9EFEF] border border-[#E4C0C0] text-xs text-[#B97878] font-semibold">
            {error}
          </div>
        )}

        {/* ROLE-BASED ACTIONS */}

        {/* 1. FREELANCER: Submit / Resubmit Work */}
        {isFreelancer && (isInProgress || isRevision) && (
          <form
            onSubmit={handleSubmitDeliverable}
            className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#DED3E3] space-y-3 shadow-sm"
          >
            <h4 className="text-xs font-bold text-[#302A35] uppercase tracking-wider flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-[#789B83]" />
              {isRevision ? 'Resubmit Deliverable (Revision)' : 'Submit Milestone Deliverables'}
            </h4>

            <div>
              <label className="block text-[11px] font-semibold text-[#302A35] mb-1">
                Summary of Work Done & Changes *
              </label>
              <textarea
                rows={3}
                value={deliverableNote}
                onChange={(e) => setDeliverableNote(e.target.value)}
                placeholder="Describe what you implemented, test notes, and deliverable highlights..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#DED3E3] text-xs text-[#302A35] placeholder-[#968D99] focus:outline-none focus:border-[#789B83]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#302A35] mb-1">
                  Live Preview / Github / Figma Link
                </label>
                <input
                  type="url"
                  value={demoLink}
                  onChange={(e) => setDemoLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FFFDF9] border border-[#DED3E3] text-xs text-[#302A35] placeholder-[#968D99] focus:outline-none focus:border-[#789B83]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#302A35] mb-1">
                  Deliverable URL / Cloudinary Asset
                </label>
                <input
                  type="text"
                  value={fileUrl}
                  onChange={(e) => {
                    setFileUrl(e.target.value);
                    if (!fileName) setFileName('Deliverable_Archive.zip');
                  }}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FFFDF9] border border-[#DED3E3] text-xs text-[#302A35] placeholder-[#968D99] focus:outline-none focus:border-[#789B83]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full py-3 rounded-xl bg-[#789B83] hover:bg-[#688A72] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {actionLoading ? (
                'Submitting Work...'
              ) : (
                <>
                  <span>Submit Deliverable for Review</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* 2. CLIENT: Review Submitted Work (Approve & Pay vs Request Revision) */}
        {isClient && isSubmitted && (
          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#DED3E3] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#302A35] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#C29A68]" />
                Review Milestone Deliverables
              </h4>

              <div className="flex rounded-xl bg-[#EEE6F5] p-1 border border-[#DED3E3]">
                <button
                  type="button"
                  onClick={() => setReviewTab('approve')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    reviewTab === 'approve'
                      ? 'bg-[#789B83] text-white shadow-sm'
                      : 'text-[#6F6675] hover:text-[#302A35]'
                  }`}
                >
                  Approve & Pay
                </button>
                <button
                  type="button"
                  onClick={() => setReviewTab('revision')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    reviewTab === 'revision'
                      ? 'bg-[#C29A68] text-white shadow-sm'
                      : 'text-[#6F6675] hover:text-[#302A35]'
                  }`}
                >
                  Request Changes
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#302A35] mb-1">
                {reviewTab === 'approve'
                  ? 'Approval Feedback / Note to Freelancer (Optional)'
                  : 'Specify Required Changes & Revision Details *'}
              </label>
              <textarea
                rows={2}
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
                placeholder={
                  reviewTab === 'approve'
                    ? 'Excellent job! All acceptance criteria met.'
                    : 'Please adjust the header padding on mobile and fix the cart submit validation...'
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#DED3E3] text-xs text-[#302A35] placeholder-[#968D99] focus:outline-none focus:border-[#9B83BD]"
              />
            </div>

            {reviewTab === 'approve' ? (
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-[#EDF4EF] border border-[#C8DECF] text-xs text-[#789B83] flex items-center justify-between">
                  <span>Escrow Release to Freelancer:</span>
                  <span className="font-extrabold text-[#789B83] text-sm">
                    {formatCurrency(milestone.amount)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleApproveMilestone}
                  disabled={actionLoading}
                  className="w-full py-3.5 rounded-xl bg-[#789B83] hover:bg-[#688A72] text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {actionLoading ? 'Releasing Payment...' : `✅ Approve Milestone & Release ${formatCurrency(milestone.amount)}`}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleRequestRevision}
                disabled={actionLoading}
                className="w-full py-3 rounded-xl bg-[#C29A68] hover:bg-[#B08958] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {actionLoading ? 'Sending Revision Request...' : '✏️ Send Revision Request to Freelancer'}
              </button>
            )}
          </div>
        )}

        {/* Approved Success Banner */}
        {isApproved && (
          <div className="p-4 rounded-2xl bg-[#EDF4EF] border border-[#C8DECF] flex items-center justify-between text-xs text-[#789B83]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#789B83]" />
              <div>
                <p className="font-bold text-[#789B83]">Milestone Completed & Paid</p>
                <p className="text-[11px] text-[#6F6675]">
                  {formatCurrency(milestone.amount)} released to freelancer wallet.
                </p>
              </div>
            </div>
            <span className="font-mono text-[#789B83] font-bold">100% Paid</span>
          </div>
        )}
      </div>
    </div>
  );
};
