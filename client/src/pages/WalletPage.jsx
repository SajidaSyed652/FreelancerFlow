import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Lock,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  History,
  TrendingUp,
  Plus,
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export const WalletPage = ({ onOpenDeposit }) => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(user?.wallet || { balance: 0, escrow: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      const data = await api.get('/wallet');
      if (data.success) {
        setWallet(data.wallet);
        setTransactions(data.transactions || []);
      }
    } catch (err) {
      console.error('Failed to load wallet data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionTypeInfo = (type) => {
    switch (type) {
      case 'DEPOSIT':
        return { label: 'Simulated Deposit', color: 'text-emerald-400', icon: ArrowDownLeft, bg: 'bg-emerald-500/10' };
      case 'ESCROW_LOCK':
        return { label: 'Escrow Lock', color: 'text-purple-400', icon: Lock, bg: 'bg-purple-500/10' };
      case 'MILESTONE_RELEASE':
        return { label: 'Milestone Release', color: 'text-cyan-400', icon: ArrowUpRight, bg: 'bg-cyan-500/10' };
      case 'REFUND':
        return { label: 'Dispute Refund', color: 'text-amber-400', icon: ArrowDownLeft, bg: 'bg-amber-500/10' };
      default:
        return { label: type, color: 'text-slate-300', icon: History, bg: 'bg-white/10' };
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Simulated Wallet & Escrow Ledger
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Zero financial risk simulation for college evaluation and milestone state verification
        </p>
      </div>

      {/* Main Glass Balance Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-7 rounded-3xl border border-white/10 bg-gradient-to-br from-purple-950/40 via-[#0f0f29] to-cyan-950/20 backdrop-blur-2xl shadow-2xl space-y-4 md:col-span-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-glow-cyan">
                <div className="w-full h-full bg-[#0d0d24] rounded-[14px] flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Available Wallet Balance</span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white mt-0.5">
                  {formatCurrency(wallet.balance || 0)}
                </div>
              </div>
            </div>

            <button
              onClick={onOpenDeposit}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-glow-cyan flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              Deposit Test Funds
            </button>
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Simulated INR Currency</span>
            </div>
            <span className="text-[11px] font-mono text-purple-300">
              Account: {user?.email}
            </span>
          </div>
        </div>

        {/* Escrow Locked Card */}
        <div className="p-7 rounded-3xl border border-purple-500/30 bg-purple-950/20 backdrop-blur-2xl shadow-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-purple-300 mb-2">
              <span className="text-xs font-semibold">Funds In Escrow</span>
              <Lock className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              {formatCurrency(wallet.escrow || 0)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Guaranteed funds locked in active milestone stages
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] text-purple-200">
            Released to freelancer upon milestone review & approval.
          </div>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-purple-400" />
            Transaction Audit Trail ({transactions.length})
          </h3>
          <span className="text-xs text-slate-400">Real-time ledger events</span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-xs text-slate-400">Loading ledger logs...</div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-white/15 bg-white/[0.02]">
            <History className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-60" />
            <h4 className="text-base font-bold text-white">No Transactions Yet</h4>
            <p className="text-xs text-slate-400 mt-1">
              Deposits, milestone escrow locks, and payment releases will appear here.
            </p>
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.04] text-slate-300 font-bold border-b border-white/10">
                  <tr>
                    <th className="p-4">Type</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Project / Stage</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-slate-300">
                  {transactions.map((tx) => {
                    const typeInfo = getTransactionTypeInfo(tx.type);
                    const Icon = typeInfo.icon;
                    return (
                      <tr key={tx._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${typeInfo.bg} ${typeInfo.color}`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {typeInfo.label}
                          </span>
                        </td>
                        <td className="p-4 text-white font-medium max-w-xs truncate">
                          {tx.description}
                        </td>
                        <td className="p-4 text-slate-400">
                          {tx.projectId?.title || 'Wallet Activity'}
                        </td>
                        <td className="p-4 font-mono font-extrabold text-sm text-emerald-400">
                          {formatCurrency(tx.amount)}
                        </td>
                        <td className="p-4 text-right text-[11px] text-slate-400 font-mono">
                          {formatDate(tx.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
