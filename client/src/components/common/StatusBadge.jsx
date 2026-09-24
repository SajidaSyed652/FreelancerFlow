import React from 'react';

const statusStyles = {
  // Milestone statuses
  PENDING: { bg: 'bg-slate-500/15 border-slate-500/30 text-slate-300', icon: '⏳', label: 'Pending' },
  IN_PROGRESS: { bg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300', icon: '🔄', label: 'In Progress' },
  SUBMITTED: { bg: 'bg-amber-500/15 border-amber-500/30 text-amber-300', icon: '📤', label: 'Submitted (Review)' },
  REVISION_REQUESTED: { bg: 'bg-orange-500/15 border-orange-500/30 text-orange-300', icon: '✏️', label: 'Revision Needed' },
  APPROVED: { bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300', icon: '✅', label: 'Approved & Paid' },
  COMPLETED: { bg: 'bg-purple-500/15 border-purple-500/30 text-purple-300', icon: '🎉', label: 'Completed' },
  
  // Project statuses
  OPEN: { bg: 'bg-blue-500/15 border-blue-500/30 text-blue-300', icon: '🟢', label: 'Accepting Proposals' },
  ACTIVE: { bg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300', icon: '⚡', label: 'Active Milestones' },
  CANCELLED: { bg: 'bg-rose-500/15 border-rose-500/30 text-rose-300', icon: '⛔', label: 'Cancelled' },
  DISPUTED: { bg: 'bg-red-500/15 border-red-500/30 text-red-300', icon: '⚠️', label: 'In Dispute' },

  // Proposal statuses
  ACCEPTED: { bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300', icon: '🎯', label: 'Accepted' },
  REJECTED: { bg: 'bg-slate-500/15 border-slate-500/30 text-slate-400', icon: '✕', label: 'Declined' },
};

export const StatusBadge = ({ status, className = '' }) => {
  const current = statusStyles[status] || {
    bg: 'bg-slate-500/15 border-slate-500/30 text-slate-300',
    icon: '•',
    label: status,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${current.bg} ${className}`}
    >
      <span>{current.icon}</span>
      <span>{current.label}</span>
    </span>
  );
};
