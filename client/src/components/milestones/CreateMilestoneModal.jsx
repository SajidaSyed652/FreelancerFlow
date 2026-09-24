import React, { useState } from 'react';
import { X, Plus, Trash2, ShieldCheck, Lock, AlertCircle, Sparkles } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';

export const CreateMilestoneModal = ({
  project,
  isOpen,
  onClose,
  onMilestonesCreated,
  onOpenDeposit,
}) => {
  const { user, refreshUser } = useAuth();
  const [milestones, setMilestones] = useState([
    {
      title: 'Milestone 1: UI/UX Wireframes & Design System',
      description: 'Deliver interactive high-fidelity Figma components and responsive layouts.',
      amount: 3000,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      order: 1,
    },
    {
      title: 'Milestone 2: Frontend Architecture & Component Views',
      description: 'Implement React application, component styling, and client-side logic.',
      amount: 5000,
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      order: 2,
    },
    {
      title: 'Milestone 3: Backend REST APIs & Database Integration',
      description: 'Node.js/Express server endpoints, schema validation, and authentication.',
      amount: 5000,
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      order: 3,
    },
    {
      title: 'Milestone 4: Deployment & Quality Assurance',
      description: 'End-to-end integration testing, Core Web Vitals audit, and live server deployment.',
      amount: 2000,
      deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      order: 4,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !project) return null;

  const totalMilestonesAmount = milestones.reduce((sum, m) => sum + Number(m.amount || 0), 0);
  const clientBalance = user?.wallet?.balance || 0;
  const isBalanceSufficient = clientBalance >= totalMilestonesAmount;

  const handleAddMilestone = () => {
    const nextOrder = milestones.length + 1;
    setMilestones([
      ...milestones,
      {
        title: `Milestone ${nextOrder}: New Stage Deliverable`,
        description: '',
        amount: 2000,
        deadline: new Date(Date.now() + nextOrder * 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        order: nextOrder,
      },
    ]);
  };

  const handleRemoveMilestone = (index) => {
    if (milestones.length <= 1) return;
    const updated = milestones
      .filter((_, i) => i !== index)
      .map((m, idx) => ({ ...m, order: idx + 1 }));
    setMilestones(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isBalanceSufficient) {
      setError(`Insufficient wallet balance. You need ${formatCurrency(totalMilestonesAmount - clientBalance)} more in your wallet.`);
      return;
    }

    setLoading(true);
    try {
      const data = await api.post(`/milestones/${project._id}`, { milestones });
      if (data.success) {
        await refreshUser();
        onMilestonesCreated(data.milestones);
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl border border-white/15 bg-[#0f0f29]/95 backdrop-blur-2xl p-6 shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 p-0.5 shadow-glow-purple">
            <div className="w-full h-full bg-[#0d0d24] rounded-[14px] flex items-center justify-center">
              <Lock className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Define & Fund Milestones</h3>
            <p className="text-xs text-slate-400">
              Divide "{project.title}" into sequential funded deliverables.
            </p>
          </div>
        </div>

        {/* Escrow summary banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] mb-6">
          <div>
            <span className="text-[11px] text-slate-400 block">Project Budget:</span>
            <span className="text-sm font-bold text-white">
              {formatCurrency(project.budget)}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block">Total Milestone Sum:</span>
            <span className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              {formatCurrency(totalMilestonesAmount)}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block">Your Wallet Balance:</span>
            <span
              className={`text-sm font-bold ${
                isBalanceSufficient ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {formatCurrency(clientBalance)}
            </span>
          </div>
        </div>

        {/* Milestone Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="max-h-80 overflow-y-auto pr-1 space-y-3">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-purple-500/30 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">
                    Stage {m.order}
                  </span>
                  {milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(idx)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-6">
                    <input
                      type="text"
                      value={m.title}
                      onChange={(e) => handleChange(idx, 'title', e.target.value)}
                      placeholder="Milestone Title"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-semibold focus:outline-none focus:border-purple-400"
                      required
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="500"
                        step="500"
                        value={m.amount}
                        onChange={(e) => handleChange(idx, 'amount', Number(e.target.value))}
                        className="w-full pl-7 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-emerald-400 font-bold focus:outline-none focus:border-purple-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <input
                      type="date"
                      value={m.deadline}
                      onChange={(e) => handleChange(idx, 'deadline', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-purple-400"
                      required
                    />
                  </div>
                </div>

                <textarea
                  rows={2}
                  value={m.description}
                  onChange={(e) => handleChange(idx, 'description', e.target.value)}
                  placeholder="Deliverable details and acceptance criteria..."
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-purple-400"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddMilestone}
            className="w-full py-2.5 rounded-xl border border-dashed border-purple-500/40 text-purple-300 text-xs font-bold hover:bg-purple-500/10 flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Another Milestone Stage
          </button>

          {!isBalanceSufficient && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-between text-xs text-rose-300">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  Deposit funds into wallet to lock {formatCurrency(totalMilestonesAmount)} into escrow.
                </span>
              </div>
              <button
                type="button"
                onClick={onOpenDeposit}
                className="px-3 py-1 rounded-lg bg-emerald-500 text-black font-extrabold hover:bg-emerald-400 transition-colors"
              >
                + Deposit Funds
              </button>
            </div>
          )}

          {error && (
            <p className="text-xs text-rose-400 font-semibold bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isBalanceSufficient}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-glow-purple flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                'Locking Escrow...'
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Lock {formatCurrency(totalMilestonesAmount)} in Escrow & Start</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
