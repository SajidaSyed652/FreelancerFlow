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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl border border-[#DED3E3] bg-[#FFFDF9] p-6 shadow-2xl my-8 text-[#302A35]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#6F6675] hover:text-[#302A35] hover:bg-[#EEE6F5] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#EEE6F5] border border-[#DED3E3] flex items-center justify-center text-[#765B9E] shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#302A35]">Define & Fund Milestones</h3>
            <p className="text-xs text-[#6F6675]">
              Divide "{project.title}" into sequential funded deliverables.
            </p>
          </div>
        </div>

        {/* Escrow summary banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#EEE6F5]/50 border border-[#DED3E3] mb-6">
          <div>
            <span className="text-[11px] text-[#6F6675] block font-medium">Project Budget:</span>
            <span className="text-sm font-bold text-[#302A35]">
              {formatCurrency(project.budget)}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-[#6F6675] block font-medium">Total Milestone Sum:</span>
            <span className="text-base font-extrabold text-[#765B9E]">
              {formatCurrency(totalMilestonesAmount)}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-[#6F6675] block font-medium">Your Wallet Balance:</span>
            <span
              className={`text-sm font-bold ${
                isBalanceSufficient ? 'text-[#789B83]' : 'text-[#B97878]'
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
                className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#DED3E3] hover:border-[#9B83BD] transition-all space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#765B9E] uppercase tracking-wider">
                    Stage {m.order}
                  </span>
                  {milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(idx)}
                      className="p-1 rounded-lg text-[#6F6675] hover:text-[#B97878] hover:bg-[#F9EFEF] transition-colors"
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
                      className="w-full px-3 py-2 rounded-xl bg-[#FFFDF9] border border-[#DED3E3] text-xs text-[#302A35] font-semibold focus:outline-none focus:border-[#9B83BD]"
                      required
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F6675] text-xs font-bold">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="500"
                        step="500"
                        value={m.amount}
                        onChange={(e) => handleChange(idx, 'amount', Number(e.target.value))}
                        className="w-full pl-7 pr-3 py-2 rounded-xl bg-[#FFFDF9] border border-[#DED3E3] text-xs text-[#789B83] font-bold focus:outline-none focus:border-[#9B83BD]"
                        required
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <input
                      type="date"
                      value={m.deadline}
                      onChange={(e) => handleChange(idx, 'deadline', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FFFDF9] border border-[#DED3E3] text-xs text-[#302A35] focus:outline-none focus:border-[#9B83BD]"
                      required
                    />
                  </div>
                </div>

                <textarea
                  rows={2}
                  value={m.description}
                  onChange={(e) => handleChange(idx, 'description', e.target.value)}
                  placeholder="Deliverable details and acceptance criteria..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FFFDF9] border border-[#DED3E3] text-xs text-[#302A35] placeholder-[#968D99] focus:outline-none focus:border-[#9B83BD]"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddMilestone}
            className="w-full py-2.5 rounded-xl border border-dashed border-[#9B83BD] text-[#765B9E] text-xs font-bold hover:bg-[#EEE6F5] flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Another Milestone Stage
          </button>

          {!isBalanceSufficient && (
            <div className="p-3.5 rounded-xl bg-[#F9EFEF] border border-[#E4C0C0] flex items-center justify-between text-xs text-[#B97878]">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#B97878] shrink-0" />
                <span>
                  Deposit funds into wallet to lock {formatCurrency(totalMilestonesAmount)} into escrow.
                </span>
              </div>
              <button
                type="button"
                onClick={onOpenDeposit}
                className="px-3 py-1 rounded-lg bg-[#789B83] text-white font-extrabold hover:bg-[#688A72] transition-colors"
              >
                + Deposit Funds
              </button>
            </div>
          )}

          {error && (
            <p className="text-xs text-[#B97878] font-semibold bg-[#F9EFEF] p-2.5 rounded-xl border border-[#E4C0C0]">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#DED3E3]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#6F6675] hover:text-[#302A35]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isBalanceSufficient}
              className="px-6 py-2.5 rounded-xl bg-[#9B83BD] hover:bg-[#8F78B5] text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
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
