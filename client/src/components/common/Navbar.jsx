import React, { useState, useEffect } from 'react';
import {
  Layers,
  Wallet,
  Bell,
  User,
  LogOut,
  PlusCircle,
  Shield,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import api from '../../api/axios';

export const Navbar = ({ onOpenDeposit, onNavigate, currentPage }) => {
  const { user, logout, isClient, isFreelancer, isAdmin } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

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

  return (
    <nav className="sticky top-0 z-50 border-b border-[#DED3E3] bg-[#FFFDF9]/90 backdrop-blur-2xl px-4 lg:px-8 py-3.5 transition-all shadow-[0_2px_12px_rgba(48,42,53,0.03)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#765B9E] via-[#9B83BD] to-[#B9A7D9] p-0.5 shadow-sm group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#FFFDF9] rounded-[10px] flex items-center justify-center">
              <Layers className="w-5 h-5 text-[#765B9E]" />
            </div>
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-[#302A35] flex items-center gap-1.5">
              Freelance<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#765B9E] to-[#9B83BD]">Flow</span>
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-[#6F6675] block uppercase -mt-1">
              Milestone Escrow
            </span>
          </div>
        </div>

        {/* Navigation links based on role */}
        <div className="hidden md:flex items-center gap-1.5">

          {user && isClient && (
            <>
              <button
                onClick={() => onNavigate('client-dashboard')}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  currentPage === 'client-dashboard'
                    ? 'bg-[#EEE6F5] text-[#765B9E] border border-[#DED3E3] font-semibold'
                    : 'text-[#6F6675] hover:text-[#302A35] hover:bg-[#EEE6F5]/50'
                }`}
              >
                My Projects
              </button>
              <button
                onClick={() => onNavigate('post-project')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-[#9B83BD] hover:bg-[#8F78B5] text-white shadow-sm transition-all"
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
                    ? 'bg-[#EEE6F5] text-[#765B9E] border border-[#DED3E3] font-semibold'
                    : 'text-[#6F6675] hover:text-[#302A35] hover:bg-[#EEE6F5]/50'
                }`}
              >
                Freelancer Workspace
              </button>
              <button
                onClick={() => onNavigate('my-proposals')}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  currentPage === 'my-proposals'
                    ? 'bg-[#EEE6F5] text-[#765B9E] border border-[#DED3E3] font-semibold'
                    : 'text-[#6F6675] hover:text-[#302A35] hover:bg-[#EEE6F5]/50'
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
                  ? 'bg-[#F9EFEF] text-[#B97878] border border-[#E4C0C0]'
                  : 'text-[#6F6675] hover:text-[#302A35] hover:bg-[#EEE6F5]/50'
              }`}
            >
              <Shield className="w-4 h-4 text-[#B97878]" />
              Admin Portal
            </button>
          )}
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-3">

          {user ? (
            <>
              {/* Wallet Pill */}
              <div
                onClick={() => onNavigate('wallet')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#DED3E3] bg-[#FFFDF9] hover:bg-[#EEE6F5] hover:border-[#9B83BD] transition-all cursor-pointer group shadow-sm"
              >
                <Wallet className="w-4 h-4 text-[#789B83] group-hover:scale-110 transition-transform" />
                <div className="text-right">
                  <div className="text-xs font-bold text-[#302A35] leading-tight">
                    {formatCurrency(user.wallet?.balance || 0)}
                  </div>
                  {user.wallet?.escrow > 0 && (
                    <div className="text-[10px] text-[#C29A68] font-medium">
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
                  className="p-2 rounded-xl border border-[#DED3E3] bg-[#FFFDF9] text-[#6F6675] hover:text-[#302A35] hover:bg-[#EEE6F5] transition-all relative shadow-sm"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#9B83BD] text-[10px] font-extrabold text-white flex items-center justify-center animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#FFFDF9] border border-[#DED3E3] shadow-xl p-3 z-50 animate-in fade-in">
                    <div className="flex items-center justify-between pb-2 border-b border-[#DED3E3] mb-2">
                      <span className="text-xs font-bold text-[#302A35]">Notifications</span>
                      <button
                        onClick={markAllRead}
                        className="text-[10px] text-[#765B9E] font-semibold hover:underline"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto space-y-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-[#6F6675] text-center py-4">No notifications yet</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n._id}
                            className={`p-2.5 rounded-xl border text-xs transition-colors ${
                              n.isRead
                                ? 'bg-[#FFFDF9] border-[#DED3E3]/60 text-[#6F6675]'
                                : 'bg-[#EEE6F5] border-[#DED3E3] text-[#302A35]'
                            }`}
                          >
                            <p className="font-semibold text-[11px] text-[#765B9E]">{n.title}</p>
                            <p className="text-[11px] text-[#6F6675] mt-0.5">{n.message}</p>
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
                  className="flex items-center gap-2 p-1 pr-2.5 rounded-xl border border-[#DED3E3] bg-[#FFFDF9] hover:bg-[#EEE6F5] transition-all shadow-sm"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-[#9B83BD]/40"
                  />
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-[#302A35] leading-none">{user.name.split(' ')[0]}</div>
                    <div className="text-[10px] text-[#765B9E] uppercase font-bold tracking-wider">
                      {user.role}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#6F6675]" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#FFFDF9] border border-[#DED3E3] shadow-xl p-2 z-50">
                    <div className="px-3 py-2 border-b border-[#DED3E3] mb-1">
                      <p className="text-xs font-bold text-[#302A35] truncate">{user.name}</p>
                      <p className="text-[10px] text-[#6F6675] truncate">{user.email}</p>
                    </div>
                    {isFreelancer && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onNavigate('profile');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#6F6675] hover:bg-[#EEE6F5] hover:text-[#302A35] font-medium"
                      >
                        <User className="w-3.5 h-3.5 text-[#765B9E]" />
                        My Profile & Portfolio
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onNavigate('wallet');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#6F6675] hover:bg-[#EEE6F5] hover:text-[#302A35] font-medium"
                    >
                      <Wallet className="w-3.5 h-3.5 text-[#789B83]" />
                      Wallet & Escrow
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                        onNavigate('landing');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#B97878] hover:bg-[#F9EFEF] font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
};
