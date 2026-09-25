import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, ArrowRight } from 'lucide-react';
import api from '../../api/axios';

export const DisputeModal = ({ project, isOpen, onClose, onDisputeRaised }) => {
  const [reason, setReason] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !project) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await api.post('/disputes', {
        projectId: project._id,
        reason,
        evidence: evidenceUrl ? [evidenceUrl] : [],
      });

      if (data.success) {
        if (onDisputeRaised) onDisputeRaised(data.dispute);
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-[#DED3E3] bg-[#FFFDF9] p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#6F6675] hover:text-[#302A35] hover:bg-[#EEE6F5]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#F9EFEF] border border-[#E4C0C0] flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-[#B97878]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#302A35]">Raise Project Dispute</h3>
            <p className="text-xs text-[#6F6675]">Escalate milestone or deliverable disagreement to Admin</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#302A35] mb-1">
              Detailed Reason for Dispute *
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain the disagreement, unmet milestone deliverables, or unresponsive counterparty..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#DED3E3] text-xs text-[#302A35] placeholder-[#968D99] focus:outline-none focus:border-[#B97878]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#302A35] mb-1">
              Evidence / Screenshot / Archive Link (Optional)
            </label>
            <input
              type="url"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#FFFDF9] border border-[#DED3E3] text-xs text-[#302A35] placeholder-[#968D99] focus:outline-none focus:border-[#B97878]"
            />
          </div>

          <div className="p-3 rounded-xl bg-[#F9EFEF] border border-[#E4C0C0] text-xs text-[#B97878]">
            Escrow funds will remain safely frozen until the platform admin investigates and issues a verdict.
          </div>

          {error && <p className="text-xs text-[#B97878] font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#B97878] hover:bg-[#A86767] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? 'Submitting Dispute...' : 'Escalate Dispute to Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};
