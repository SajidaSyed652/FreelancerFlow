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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-rose-500/30 bg-[#0f0f29]/95 backdrop-blur-2xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Raise Project Dispute</h3>
            <p className="text-xs text-slate-400">Escalate milestone or deliverable disagreement to Admin</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Detailed Reason for Dispute *
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain the disagreement, unmet milestone deliverables, or unresponsive counterparty..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Evidence / Screenshot / Archive Link (Optional)
            </label>
            <input
              type="url"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
            />
          </div>

          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/20 text-xs text-rose-200">
            Escrow funds will remain safely frozen until the platform admin investigates and issues a verdict.
          </div>

          {error && <p className="text-xs text-rose-400 font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-glow-purple flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? 'Submitting Dispute...' : 'Escalate Dispute to Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};
