import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Briefcase,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Lock,
  Layers,
  Search,
} from 'lucide-react';
import api from '../api/axios';
import { formatCurrency, formatDate } from '../utils/formatters';
import { StatusBadge } from '../components/common/StatusBadge';

export const AdminDashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'disputes'
  const [loading, setLoading] = useState(true);
  const [searchUser, setSearchUser] = useState('');

  // Dispute resolution state
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [adminDecision, setAdminDecision] = useState('');
  const [decisionAction, setDecisionAction] = useState('refund'); // 'refund' | 'release'
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, dispRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/disputes'),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (usersRes.success) setUsers(usersRes.users || []);
      if (dispRes.success) setDisputes(dispRes.disputes || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId) => {
    try {
      const data = await api.put(`/admin/users/${userId}/block`);
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isBlocked: data.user.isBlocked } : u))
        );
      }
    } catch (err) {
      console.error('Failed to toggle block:', err);
    }
  };

  const handleToggleVerify = async (userId) => {
    try {
      const data = await api.put(`/admin/users/${userId}/verify`);
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isVerified: data.user.isVerified } : u))
        );
      }
    } catch (err) {
      console.error('Failed to toggle verify:', err);
    }
  };

  const handleResolveDispute = async (e) => {
    e.preventDefault();
    if (!selectedDispute || !adminDecision.trim()) return;

    setActionLoading(true);
    try {
      const data = await api.put(`/disputes/${selectedDispute._id}/resolve`, {
        adminDecision,
        refundToClient: decisionAction === 'refund',
        releaseToFreelancer: decisionAction === 'release',
      });

      if (data.success) {
        setSelectedDispute(null);
        setAdminDecision('');
        await fetchAdminData();
      }
    } catch (err) {
      console.error('Failed to resolve dispute:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.role.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Admin Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border border-rose-500/30 bg-rose-950/20 backdrop-blur-2xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Platform Administration</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 uppercase">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Platform governance, user verification, escrow logs & dispute resolution
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-2xl bg-white/[0.04] p-1.5 border border-white/10">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-rose-500 text-white shadow-glow-purple'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview & Stats
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'users'
                ? 'bg-rose-500 text-white shadow-glow-purple'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('disputes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'disputes'
                ? 'bg-rose-500 text-white shadow-glow-purple'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Disputes ({disputes.filter((d) => d.status === 'OPEN').length})
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & STATS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl space-y-2">
              <span className="text-xs text-slate-400 font-medium">Total Registered Users</span>
              <div className="text-2xl font-extrabold text-white">{stats?.totalUsers || 0}</div>
              <p className="text-[10px] text-purple-300">
                {stats?.clientsCount || 0} Clients • {stats?.freelancersCount || 0} Freelancers
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl space-y-2">
              <span className="text-xs text-slate-400 font-medium">Total Platform Projects</span>
              <div className="text-2xl font-extrabold text-white">{stats?.totalProjects || 0}</div>
              <p className="text-[10px] text-cyan-400">
                {stats?.activeProjects || 0} Active • {stats?.completedProjects || 0} Completed
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl space-y-2">
              <span className="text-xs text-slate-400 font-medium">Milestones Processed</span>
              <div className="text-2xl font-extrabold text-emerald-400">
                {stats?.completedMilestones || 0} / {stats?.totalMilestones || 0}
              </div>
              <p className="text-[10px] text-slate-400">Delivered & verified stage payouts</p>
            </div>

            <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-950/20 backdrop-blur-xl space-y-2">
              <span className="text-xs text-rose-300 font-medium">Open Disputes</span>
              <div className="text-2xl font-extrabold text-rose-400">
                {stats?.openDisputes || 0}
              </div>
              <p className="text-[10px] text-rose-300/80">Require administrative arbitration</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                placeholder="Search by name, email, or role..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
              />
            </div>
            <span className="text-xs text-slate-400">Showing {filteredUsers.length} users</span>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.04] text-slate-300 font-bold border-b border-white/10">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Wallet Balance</th>
                    <th className="p-4">Verification</th>
                    <th className="p-4">Account Status</th>
                    <th className="p-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-slate-300">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-8 h-8 rounded-lg object-cover ring-1 ring-white/10"
                          />
                          <div>
                            <p className="font-bold text-white">{u.name}</p>
                            <p className="text-[11px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="capitalize font-semibold text-purple-300">{u.role}</span>
                      </td>
                      <td className="p-4 font-mono font-bold text-emerald-400">
                        {formatCurrency(u.wallet?.balance || 0)}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleVerify(u._id)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                            u.isVerified
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                              : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                          }`}
                        >
                          {u.isVerified ? '✓ Verified' : 'Unverified'}
                        </button>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            u.isBlocked
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {u.isBlocked ? 'Blocked / Suspended' : 'Active'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleBlock(u._id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            u.isBlocked
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                          }`}
                        >
                          {u.isBlocked ? 'Unblock User' : 'Block / Suspend'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DISPUTE ARBITRATION */}
      {activeTab === 'disputes' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            Active Dispute Resolution Center
          </h3>

          {disputes.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-white/15 bg-white/[0.02]">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h4 className="text-base font-bold text-white">No Open Disputes</h4>
              <p className="text-xs text-slate-400 mt-1">All project milestones are running smoothly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {disputes.map((disp) => (
                <div
                  key={disp._id}
                  className="p-6 rounded-3xl border border-rose-500/30 bg-rose-950/15 backdrop-blur-xl space-y-4 shadow-xl"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Status: {disp.status}
                      </span>
                      <h4 className="text-base font-bold text-white mt-2">
                        {disp.projectId?.title || 'Project Dispute'}
                      </h4>
                    </div>
                    <span className="text-sm font-extrabold text-emerald-400">
                      {formatCurrency(disp.projectId?.budget || 0)}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-xs text-slate-300 space-y-1.5">
                    <p>
                      <span className="font-bold text-rose-400">Raised By: </span>
                      {disp.raisedBy?.name} ({disp.raisedBy?.role})
                    </p>
                    <p>
                      <span className="font-bold text-slate-400">Against: </span>
                      {disp.against?.name} ({disp.against?.role})
                    </p>
                    <p>
                      <span className="font-bold text-amber-300">Reason: </span>
                      {disp.reason}
                    </p>
                  </div>

                  {disp.status === 'OPEN' && (
                    <button
                      onClick={() => setSelectedDispute(disp)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-glow-purple transition-all"
                    >
                      Arbitrate & Issue Verdict
                    </button>
                  )}

                  {disp.status === 'RESOLVED' && (
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200">
                      <span className="font-bold">Admin Verdict: </span>
                      {disp.adminDecision}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ARBITRATION MODAL */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-rose-500/40 bg-[#0f0f29]/95 backdrop-blur-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Admin Dispute Arbitration</h3>
            <p className="text-xs text-slate-400 mb-4">
              Review claim for "{selectedDispute.projectId?.title}".
            </p>

            <form onSubmit={handleResolveDispute} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Arbitration Verdict Action
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDecisionAction('refund')}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      decisionAction === 'refund'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                        : 'border-white/10 bg-white/[0.02] text-slate-400'
                    }`}
                  >
                    Refund Escrow to Client
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecisionAction('release')}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      decisionAction === 'release'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'border-white/10 bg-white/[0.02] text-slate-400'
                    }`}
                  >
                    Release Escrow to Freelancer
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Official Verdict Note *
                </label>
                <textarea
                  rows={3}
                  value={adminDecision}
                  onChange={(e) => setAdminDecision(e.target.value)}
                  placeholder="State the administrative ruling and rationale based on review of milestone deliverables..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setSelectedDispute(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 text-white font-bold text-xs shadow-glow-purple transition-all disabled:opacity-50"
                >
                  {actionLoading ? 'Executing Ruling...' : 'Execute Resolution Verdict'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
