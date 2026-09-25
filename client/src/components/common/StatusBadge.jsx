import React from 'react';

const statusStyles = {
  // Milestone statuses
  PENDING: { bg: 'bg-[#EEE6F5] border-[#DED3E3] text-[#6F6675]', icon: '⏳', label: 'Pending' },
  IN_PROGRESS: { bg: 'bg-[#EEE6F5] border-[#B9A7D9] text-[#765B9E]', icon: '🔄', label: 'In Progress' },
  SUBMITTED: { bg: 'bg-[#FAF3EA] border-[#E8D3BA] text-[#C29A68]', icon: '📤', label: 'Submitted (Review)' },
  REVISION_REQUESTED: { bg: 'bg-[#FDF0EB] border-[#F2C9B8] text-[#C06A45]', icon: '✏️', label: 'Revision Needed' },
  APPROVED: { bg: 'bg-[#EDF4EF] border-[#C8DECF] text-[#789B83]', icon: '✅', label: 'Approved & Paid' },
  COMPLETED: { bg: 'bg-[#EEE6F5] border-[#D8CDE8] text-[#765B9E]', icon: '🎉', label: 'Completed' },
  
  // Project statuses
  OPEN: { bg: 'bg-[#EEE6F5] border-[#B9A7D9] text-[#765B9E]', icon: '🟢', label: 'Accepting Proposals' },
  ACTIVE: { bg: 'bg-[#EEE6F5] border-[#B9A7D9] text-[#765B9E]', icon: '⚡', label: 'Active Milestones' },
  CANCELLED: { bg: 'bg-[#F9EFEF] border-[#E4C0C0] text-[#B97878]', icon: '⛔', label: 'Cancelled' },
  DISPUTED: { bg: 'bg-[#F9EFEF] border-[#E4C0C0] text-[#B97878]', icon: '⚠️', label: 'In Dispute' },

  // Proposal statuses
  ACCEPTED: { bg: 'bg-[#EDF4EF] border-[#C8DECF] text-[#789B83]', icon: '🎯', label: 'Accepted' },
  REJECTED: { bg: 'bg-[#EEE6F5] border-[#DED3E3] text-[#968D99]', icon: '✕', label: 'Declined' },
};

export const StatusBadge = ({ status, className = '' }) => {
  const current = statusStyles[status] || {
    bg: 'bg-[#EEE6F5] border-[#DED3E3] text-[#6F6675]',
    icon: '•',
    label: status,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${current.bg} ${className}`}
    >
      <span>{current.icon}</span>
      <span>{current.label}</span>
    </span>
  );
};
