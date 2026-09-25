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
      <div className="p-6 rounded-3xl border border-[#DED3E3] bg-[#FFFDF9] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF3EA] border border-[#E8D3BA] flex items-center justify-center text-[#C29A68] shadow-sm">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#302A35]">Platform Administration</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF3EA] text-[#C29A68] font-bold border border-[#E8D3BA] uppercase">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-[#6F6675] mt-0.5">
              Platform governance, user verification, escrow logs & dispute resolution
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-2xl bg-[#EEE6F5] p-1.5 border border-[#DED3E3]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-[#FFFDF9] text-[#302A35] shadow-sm'
                : 'text-[#6F6675] hover:text-[#302A35]'
            }`}
          >
            Overview & Stats
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'users'
                ? 'bg-[#FFFDF9] text-[#302A35] shadow-sm'
                : 'text-[#6F6675] hover:text-[#302A35]'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('disputes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'disputes'
                ? 'bg-[#FFFDF9] text-[#302A35] shadow-sm'
                : 'text-[#6F6675] hover:text-[#302A35]'
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
            <div className="p-5 rounded-2xl border border-[#DED3E3] bg-[#FFFDF9] space-y-2 shadow-sm">
              <span className="text-xs text-[#6F6675] font-medium">Total Registered Users</span>
              <div className="text-2xl font-extrabold text-[#302A35]">{stats?.totalUsers || 0}</div>
              <p className="text-[10px] text-[#765B9E]">
                {stats?.clientsCount || 0} Clients • {stats?.freelancersCount || 0} Freelancers
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[#DED3E3] bg-[#FFFDF9] space-y-2 shadow-sm">
              <span className="text-xs text-[#6F6675] font-medium">Total Platform Projects</span>
              <div className="text-2xl font-extrabold text-[#302A35]">{stats?.totalProjects || 0}</div>
              <p className="text-[10px] text-[#789B83]">
                {stats?.activeProjects || 0} Active • {stats?.completedProjects || 0} Completed
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[#DED3E3] bg-[#FFFDF9] space-y-2 shadow-sm">
              <span className="text-xs text-[#6F6675] font-medium">Milestones Processed</span>
              <div className="text-2xl font-extrabold text-[#789B83]">
                {stats?.completedMilestones || 0} / {stats?.totalMilestones || 0}
              </div>
              <p className="text-[10px] text-[#6F6675]">Delivered & verified stage payouts</p>
            </div>

            <div className="p-5 rounded-2xl border border-[#DED3E3] bg-[#FFFDF9] space-y-2 shadow-sm">
              <span className="text-xs text-[#B97878] font-medium">Open Disputes</span>
              <div className="text-2xl font-extrabold text-[#B97878]">
                {stats?.openDisputes || 0}
              </div>
              <p className="text-[10px] text-[#B97878]/80">Require administrative arbitration</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="w-4 h-4 text-[#968D99] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                placeholder="Search by name, email, or role..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FFFDF9] border border-[#DED3E3] text-xs text-[#302A35] placeholder-[#968D99] focus:outline-none focus:border-[#9B83BD]"
              />
            </div>
            <span className="text-xs text-[#6F6675]">Showing {filteredUsers.length} users</span>
          </div>

          <div className="rounded-3xl border border-[#DED3E3] bg-[#FFFDF9] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#EEE6F5]/60 text-[#302A35] font-bold border-b border-[#DED3E3]">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Wallet Balance</th>
                    <th className="p-4">Verification</th>
                    <th className="p-4">Account Status</th>
                    <th className="p-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DED3E3]/60 text-[#302A35]">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-[#EEE6F5]/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-8 h-8 rounded-lg object-cover ring-1 ring-[#DED3E3]"
                          />
                          <div>
                            <p className="font-bold text-[#302A35]">{u.name}</p>
                            <p className="text-[11px] text-[#6F6675]">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="capitalize font-semibold text-[#765B9E]">{u.role}</span>
                      </td>
                      <td className="p-4 font-mono font-bold text-[#789B83]">
                        {formatCurrency(u.wallet?.balance || 0)}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleVerify(u._id)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                            u.isVerified
                              ? 'bg-[#EDF4EF] text-[#789B83] border-[#C8DECF]'
                              : 'bg-[#EEE6F5] text-[#6F6675] border-[#DED3E3]'
                          }`}
                        >
                          {u.isVerified ? '✓ Verified' : 'Unverified'}
                        </button>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            u.isBlocked
                              ? 'bg-[#F9EFEF] text-[#B97878]'
                              : 'bg-[#EDF4EF] text-[#789B83]'
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
                              ? 'bg-[#EDF4EF] text-[#789B83] border border-[#C8DECF] hover:bg-[#C8DECF]'
                              : 'bg-[#F9EFEF] text-[#B97878] border border-[#E4C0C0] hover:bg-[#E4C0C0]'
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
          <h3 className="text-lg font-bold text-[#302A35] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#B97878]" />
            Active Dispute Resolution Center
          </h3>

          {disputes.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-[#DED3E3] bg-[#FFFDF9]">
              <CheckCircle2 className="w-12 h-12 text-[#789B83] mx-auto mb-3" />
              <h4 className="text-base font-bold text-[#302A35]">No Open Disputes</h4>
              <p className="text-xs text-[#6F6675] mt-1">All project milestones are running smoothly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {disputes.map((disp) => (
                <div
                  key={disp._id}
                  className="p-6 rounded-3xl border border-[#E4C0C0] bg-[#FFFDF9] space-y-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F9EFEF] text-[#B97878] border border-[#E4C0C0]">
                        Status: {disp.status}
                      </span>
                      <h4 className="text-base font-bold text-[#302A35] mt-2">
                        {disp.projectId?.title || 'Project Dispute'}
                      </h4>
                    </div>
                    <span className="text-sm font-extrabold text-[#789B83]">
                      {formatCurrency(disp.projectId?.budget || 0)}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#EEE6F5]/40 border border-[#DED3E3] text-xs text-[#302A35] space-y-1.5">
                    <p>
                      <span className="font-bold text-[#B97878]">Raised By: </span>
                      {disp.raisedBy?.name} ({disp.raisedBy?.role})
                    </p>
                    <p>
                      <span className="font-bold text-[#6F6675]">Against: </span>
                      {disp.against?.name} ({disp.against?.role})
                    </p>
                    <p>
                      <span className="font-bold text-[#C29A68]">Reason: </span>
                      {disp.reason}
                    </p>
                  </div>

                  {disp.status === 'OPEN' && (
                    <button
                      onClick={() => setSelectedDispute(disp)}
                      className="w-full py-2.5 rounded-xl bg-[#B97878] hover:bg-[#A86767] text-white font-bold text-xs shadow-sm transition-all"
                    >
                      Arbitrate & Issue Verdict
                    </button>
                  )}

                  {disp.status === 'RESOLVED' && (
                    <div className="p-3 rounded-xl bg-[#EDF4EF] border border-[#C8DECF] text-xs text-[#789B83]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#DED3E3] bg-[#FFFDF9] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-[#302A35] mb-2">Admin Dispute Arbitration</h3>
            <p className="text-xs text-[#6F6675] mb-4">
              Review claim for "{selectedDispute.projectId?.title}".
            </p>

            <form onSubmit={handleResolveDispute} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#302A35] mb-1.5">
                  Arbitration Verdict Action
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDecisionAction('refund')}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      decisionAction === 'refund'
                        ? 'bg-[#F9EFEF] border-[#E4C0C0] text-[#B97878]'
                        : 'border-[#DED3E3] bg-[#FFFDF9] text-[#6F6675]'
                    }`}
                  >
                    Refund Escrow to Client
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecisionAction('release')}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      decisionAction === 'release'
                        ? 'bg-[#EDF4EF] border-[#C8DECF] text-[#789B83]'
                        : 'border-[#DED3E3] bg-[#FFFDF9] text-[#6F6675]'
                    }`}
                  >
                    Release Escrow to Freelancer
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#302A35] mb-1">
                  Official Verdict Note *
                </label>
                <textarea
                  rows={3}
                  value={adminDecision}
                  onChange={(e) => setAdminDecision(e.target.value)}
                  placeholder="State the administrative ruling and rationale based on review of milestone deliverables..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FFFDF9] border border-[#DED3E3] text-xs text-[#302A35] placeholder-[#968D99] focus:outline-none focus:border-[#9B83BD]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#DED3E3]">
                <button
                  type="button"
                  onClick={() => setSelectedDispute(null)}
                  className="px-4 py-2 rounded-xl text-xs text-[#6F6675] hover:text-[#302A35]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-[#9B83BD] hover:bg-[#8F78B5] text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50"
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
