import React, { useState, useEffect } from 'react';
import {
  Layers,
  Wallet,
  Bell,
  User,
  LogOut,
  PlusCircle,
  Briefcase,
  Shield,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import api from '../../api/axios';

export const Navbar = ({ onOpenDeposit, onNavigate, currentPage }) => {
  const { user, logout, switchDemoAccount, isClient, isFreelancer, isAdmin } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const data = await api.get('/notifications');
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/all/read');
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark notifications read:', err);
    }
  };

  const handleDemoSwitch = async (role) => {
    setShowDemoMenu(false);
    await switchDemoAccount(role);
    if (role === 'client') onNavigate('client-dashboard');
    else if (role === 'freelancer' || role === 'designer') onNavigate('freelancer-dashboard');
    else if (role === 'admin') onNavigate('admin-dashboard');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#070714]/80 backdrop-blur-2xl px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-0.5 shadow-glow-purple group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0d0d24] rounded-[10px] flex items-center justify-center">
              <Layers className="w-5 h-5 text-cyan-400 animate-pulse-slow" />
            </div>
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
              Freelance<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Flow</span>
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-purple-300/70 block uppercase -mt-1">
              Milestone Escrow
            </span>
          </div>
        </div>

        {/* Navigation links based on role */}
        <div className="hidden md:flex items-center gap-1.5">
          <button
            onClick={() => onNavigate('browse-projects')}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
              currentPage === 'browse-projects'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            Explore Projects
          </button>

          {user && isClient && (
            <>
              <button
                onClick={() => onNavigate('client-dashboard')}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  currentPage === 'client-dashboard'
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                My Projects
              </button>
              <button
                onClick={() => onNavigate('post-project')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-glow-purple transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                Post Project
              </button>
            </>
          )}

          {user && isFreelancer && (
            <>
              <button
                onClick={() => onNavigate('freelancer-dashboard')}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  currentPage === 'freelancer-dashboard'
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                Freelancer Workspace
              </button>
              <button
                onClick={() => onNavigate('my-proposals')}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  currentPage === 'my-proposals'
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                My Proposals
              </button>
            </>
          )}

          {user && isAdmin && (
            <button
              onClick={() => onNavigate('admin-dashboard')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentPage === 'admin-dashboard'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Shield className="w-4 h-4 text-rose-400" />
              Admin Portal
            </button>
          )}
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Switcher Button */}
          <div className="relative">
            <button
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/20 transition-all shadow-glow-cyan"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin-slow" />
              <span>Demo Roles</span>
              <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>

            {showDemoMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0f0f29]/95 border border-white/10 backdrop-blur-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-white/[0.07] mb-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Instant Role Switch
                  </p>
                </div>
                <button
                  onClick={() => handleDemoSwitch('client')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left text-slate-200 hover:bg-purple-600/20 hover:text-purple-300 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    <span>Aditi (Client)</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Post & Fund</span>
                </button>
                <button
                  onClick={() => handleDemoSwitch('freelancer')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left text-slate-200 hover:bg-cyan-600/20 hover:text-cyan-300 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span>Rohan (Developer)</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Deliver Work</span>
                </button>
                <button
                  onClick={() => handleDemoSwitch('designer')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left text-slate-200 hover:bg-pink-600/20 hover:text-pink-300 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                    <span>Ananya (Designer)</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Apply & Bid</span>
                </button>
                <button
                  onClick={() => handleDemoSwitch('admin')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left text-slate-200 hover:bg-rose-600/20 hover:text-rose-300 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                    <span>Vikram (Admin)</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Disputes & Stats</span>
                </button>
              </div>
            )}
          </div>

          {user ? (
            <>
              {/* Wallet Pill */}
              <div
                onClick={() => onNavigate('wallet')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-purple-500/40 transition-all cursor-pointer group"
              >
                <Wallet className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <div className="text-right">
                  <div className="text-xs font-bold text-white leading-tight">
                    {formatCurrency(user.wallet?.balance || 0)}
                  </div>
                  {user.wallet?.escrow > 0 && (
                    <div className="text-[10px] text-amber-300/80 font-medium">
                      🔒 {formatCurrency(user.wallet.escrow)} locked
                    </div>
                  )}
                </div>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    if (!showNotifications && unreadCount > 0) markAllRead();
                  }}
                  className="p-2 rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all relative"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-[10px] font-extrabold text-white flex items-center justify-center animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0f0f29]/95 border border-white/10 backdrop-blur-2xl shadow-2xl p-3 z-50 animate-in fade-in">
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] mb-2">
                      <span className="text-xs font-bold text-white">Notifications</span>
                      <button
                        onClick={markAllRead}
                        className="text-[10px] text-purple-400 hover:underline"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto space-y-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-4">No notifications yet</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n._id}
                            className={`p-2.5 rounded-xl border text-xs transition-colors ${
                              n.isRead
                                ? 'bg-white/[0.02] border-white/[0.05] text-slate-300'
                                : 'bg-purple-950/40 border-purple-500/30 text-white'
                            }`}
                          >
                            <p className="font-semibold text-[11px] text-purple-300">{n.title}</p>
                            <p className="text-[11px] text-slate-300 mt-0.5">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 pr-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-all"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-purple-500/40"
                  />
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-semibold text-white leading-none">{user.name.split(' ')[0]}</div>
                    <div className="text-[10px] text-purple-300/70 uppercase font-bold tracking-wider">
                      {user.role}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#0f0f29]/95 border border-white/10 backdrop-blur-2xl shadow-2xl p-2 z-50">
                    <div className="px-3 py-2 border-b border-white/[0.08] mb-1">
                      <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    {isFreelancer && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onNavigate('profile');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/[0.06] hover:text-white"
                      >
                        <User className="w-3.5 h-3.5 text-purple-400" />
                        My Profile & Portfolio
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onNavigate('wallet');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/[0.06] hover:text-white"
                    >
                      <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                      Wallet & Escrow
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                        onNavigate('landing');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('login')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-glow-purple transition-all"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
