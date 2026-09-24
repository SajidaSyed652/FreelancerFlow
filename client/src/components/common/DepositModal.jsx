import React, { useState } from 'react';
import { X, Wallet, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';

export const DepositModal = ({ isOpen, onClose, onSuccess }) => {
  const { user, refreshUser } = useAuth();
  const [amount, setAmount] = useState(15000);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const quickPacks = [5000, 15000, 30000, 50000];

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;

    setLoading(true);
    setError(null);
    try {
      const data = await api.post('/wallet/deposit', { amount: Number(amount) });
      if (data.success) {
        setSuccess(true);
        await refreshUser();
        if (onSuccess) onSuccess();
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1200);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-[#0f0f29]/95 backdrop-blur-2xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-glow-cyan">
            <div className="w-full h-full bg-[#0d0d24] rounded-[14px] flex items-center justify-center">
              <Wallet className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Simulated Wallet Deposit</h3>
            <p className="text-xs text-slate-400">Add test funds to fund milestones & escrow</p>
          </div>
        </div>

        {success ? (
          <div className="py-8 text-center animate-in zoom-in-95">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-3 animate-bounce" />
            <h4 className="text-xl font-bold text-white">Funds Deposited!</h4>
            <p className="text-sm text-slate-300 mt-1">
              +{formatCurrency(amount)} added to your simulated balance.
            </p>
          </div>
        ) : (
          <form onSubmit={handleDeposit} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Current Balance</span>
              <span className="text-sm font-bold text-emerald-400">
                {formatCurrency(user?.wallet?.balance || 0)}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Deposit Amount (INR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white font-bold text-lg focus:outline-none focus:border-emerald-500/50"
                  required
                />
              </div>
            </div>

            {/* Quick pack chips */}
            <div>
              <span className="block text-[11px] text-slate-400 mb-1.5 font-medium">
                Quick Select:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {quickPacks.map((pack) => (
                  <button
                    key={pack}
                    type="button"
                    onClick={() => setAmount(pack)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                      amount === pack
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-glow-cyan'
                        : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.08]'
                    }`}
                  >
                    ₹{(pack / 1000)}k
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-[11px] text-purple-300">
              <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
              <span>
                100% Simulated Academic Payment Environment. No real cards or bank charges.
              </span>
            </div>

            {error && (
              <p className="text-xs text-rose-400 font-semibold bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-glow-cyan flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                'Adding Funds...'
              ) : (
                <>
                  <span>Deposit {formatCurrency(amount)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
