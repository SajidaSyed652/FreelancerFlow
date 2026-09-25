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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-[#DED3E3] bg-[#FFFDF9] p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#6F6675] hover:text-[#302A35] hover:bg-[#EEE6F5]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#EDF4EF] border border-[#C8DECF] flex items-center justify-center text-[#789B83] shadow-sm">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#302A35]">Simulated Wallet Deposit</h3>
            <p className="text-xs text-[#6F6675]">Add test funds to fund milestones & escrow</p>
          </div>
        </div>

        {success ? (
          <div className="py-8 text-center animate-in zoom-in-95">
            <CheckCircle2 className="w-16 h-16 text-[#789B83] mx-auto mb-3 animate-bounce" />
            <h4 className="text-xl font-bold text-[#302A35]">Funds Deposited!</h4>
            <p className="text-sm text-[#6F6675] mt-1">
              +{formatCurrency(amount)} added to your simulated balance.
            </p>
          </div>
        ) : (
          <form onSubmit={handleDeposit} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-[#EEE6F5]/50 border border-[#DED3E3] flex items-center justify-between">
              <span className="text-xs text-[#6F6675] font-medium">Current Balance</span>
              <span className="text-sm font-bold text-[#789B83]">
                {formatCurrency(user?.wallet?.balance || 0)}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#302A35] mb-1.5">
                Deposit Amount (INR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F6675] font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-[#FFFDF9] border border-[#DED3E3] text-[#302A35] font-bold text-lg focus:outline-none focus:border-[#789B83]"
                  required
                />
              </div>
            </div>

            {/* Quick pack chips */}
            <div>
              <span className="block text-[11px] text-[#6F6675] mb-1.5 font-medium">
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
                        ? 'bg-[#EDF4EF] border-[#789B83] text-[#789B83] shadow-sm'
                        : 'bg-[#FFFDF9] border-[#DED3E3] text-[#6F6675] hover:bg-[#EEE6F5]'
                    }`}
                  >
                    ₹{(pack / 1000)}k
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#EEE6F5] border border-[#DED3E3] text-[11px] text-[#765B9E]">
              <ShieldCheck className="w-4 h-4 text-[#765B9E] shrink-0" />
              <span>
                100% Simulated Academic Payment Environment. No real cards or bank charges.
              </span>
            </div>

            {error && (
              <p className="text-xs text-[#B97878] font-semibold bg-[#F9EFEF] p-2.5 rounded-xl border border-[#E4C0C0]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#789B83] hover:bg-[#688A72] text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
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
