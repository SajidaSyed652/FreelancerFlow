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
        return { label: 'Simulated Deposit', color: 'text-[#789B83]', icon: ArrowDownLeft, bg: 'bg-[#EDF4EF] border-[#C8DECF]' };
      case 'ESCROW_LOCK':
        return { label: 'Escrow Lock', color: 'text-[#765B9E]', icon: Lock, bg: 'bg-[#EEE6F5] border-[#DED3E3]' };
      case 'MILESTONE_RELEASE':
        return { label: 'Milestone Release', color: 'text-[#789B83]', icon: ArrowUpRight, bg: 'bg-[#EDF4EF] border-[#C8DECF]' };
      case 'REFUND':
        return { label: 'Dispute Refund', color: 'text-[#C29A68]', icon: ArrowDownLeft, bg: 'bg-[#FAF3EA] border-[#E8D3BA]' };
      default:
        return { label: type, color: 'text-[#6F6675]', icon: History, bg: 'bg-[#EEE6F5] border-[#DED3E3]' };
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#302A35]">
          Simulated Wallet & Escrow Ledger
        </h2>
        <p className="text-xs sm:text-sm text-[#6F6675] mt-1">
          Zero financial risk simulation for college evaluation and milestone state verification
        </p>
      </div>

      {/* Main Glass Balance Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-7 rounded-3xl border border-[#DED3E3] bg-[#FFFDF9] shadow-md space-y-4 md:col-span-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EDF4EF] border border-[#C8DECF] flex items-center justify-center shadow-sm">
                <Wallet className="w-6 h-6 text-[#789B83]" />
              </div>
              <div>
                <span className="text-xs text-[#6F6675] font-medium">Available Wallet Balance</span>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#302A35] mt-0.5">
                  {formatCurrency(wallet.balance || 0)}
                </div>
              </div>
            </div>

            <button
              onClick={onOpenDeposit}
              className="px-4 py-2.5 rounded-xl bg-[#789B83] hover:bg-[#688A72] text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              Deposit Test Funds
            </button>
          </div>

          <div className="pt-4 border-t border-[#DED3E3]/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#6F6675]">
              <ShieldCheck className="w-4 h-4 text-[#765B9E]" />
              <span>Simulated INR Currency</span>
            </div>
            <span className="text-[11px] font-mono text-[#765B9E] font-semibold">
              Account: {user?.email}
            </span>
          </div>
        </div>

        {/* Escrow Locked Card */}
        <div className="p-7 rounded-3xl border border-[#DED3E3] bg-[#FFFDF9] shadow-md flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-[#765B9E] mb-2">
              <span className="text-xs font-semibold">Funds In Escrow</span>
              <Lock className="w-4 h-4 text-[#9B83BD]" />
            </div>
            <div className="text-3xl font-extrabold text-[#765B9E]">
              {formatCurrency(wallet.escrow || 0)}
            </div>
            <p className="text-[11px] text-[#6F6675] mt-1">
              Guaranteed funds locked in active milestone stages
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#FFFDF9] border border-[#DED3E3] text-[11px] text-[#765B9E]">
            Released to freelancer upon milestone review & approval.
          </div>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#302A35] flex items-center gap-2">
            <History className="w-5 h-5 text-[#9B83BD]" />
            Transaction Audit Trail ({transactions.length})
          </h3>
          <span className="text-xs text-[#6F6675]">Real-time ledger events</span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-xs text-[#6F6675]">Loading ledger logs...</div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-[#DED3E3] bg-[#FFFDF9]">
            <History className="w-12 h-12 text-[#968D99] mx-auto mb-3 opacity-60" />
            <h4 className="text-base font-bold text-[#302A35]">No Transactions Yet</h4>
            <p className="text-xs text-[#6F6675] mt-1">
              Deposits, milestone escrow locks, and payment releases will appear here.
            </p>
          </div>
        ) : (
          <div className="rounded-3xl border border-[#DED3E3] bg-[#FFFDF9] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#EEE6F5]/60 text-[#302A35] font-bold border-b border-[#DED3E3]">
                  <tr>
                    <th className="p-4">Type</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Project / Stage</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DED3E3]/60 text-[#302A35]">
                  {transactions.map((tx) => {
                    const typeInfo = getTransactionTypeInfo(tx.type);
                    const Icon = typeInfo.icon;
                    return (
                      <tr key={tx._id} className="hover:bg-[#EEE6F5]/30 transition-colors">
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${typeInfo.bg} ${typeInfo.color}`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {typeInfo.label}
                          </span>
                        </td>
                        <td className="p-4 text-[#302A35] font-medium max-w-xs truncate">
                          {tx.description}
                        </td>
                        <td className="p-4 text-[#6F6675]">
                          {tx.projectId?.title || 'Wallet Activity'}
                        </td>
                        <td className="p-4 font-mono font-extrabold text-sm text-[#789B83]">
                          {formatCurrency(tx.amount)}
                        </td>
                        <td className="p-4 text-right text-[11px] text-[#6F6675] font-mono">
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
