import React, { useState } from 'react';
import { Layers, ArrowRight, Lock, Mail, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = ({ onNavigate }) => {
  const { login, switchDemoAccount } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await login(email, password);
      if (user.role === 'client') onNavigate('client-dashboard');
      else if (user.role === 'freelancer') onNavigate('freelancer-dashboard');
      else if (user.role === 'admin') onNavigate('admin-dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role) => {
    await switchDemoAccount(role);
    if (role === 'client') onNavigate('client-dashboard');
    else if (role === 'freelancer' || role === 'designer') onNavigate('freelancer-dashboard');
    else if (role === 'admin') onNavigate('admin-dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-0.5 shadow-glow-purple mb-4">
            <div className="w-full h-full bg-[#0d0d24] rounded-[14px] flex items-center justify-center">
              <Layers className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to manage your milestones & escrow</p>
        </div>

        {/* Glass Card */}
        <div className="p-8 rounded-3xl border border-white/15 bg-[#0f0f29]/90 backdrop-blur-2xl shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@flow.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <span className="text-[11px] text-purple-400 cursor-pointer hover:underline">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-400 font-semibold bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-glow-purple flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Quick 1-Click Demo Logins */}
          <div className="pt-4 border-t border-white/[0.08]">
            <span className="text-[11px] font-bold text-slate-400 block mb-2 text-center uppercase tracking-wider">
              Or 1-Click Demo Login
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemo('client')}
                className="py-2 px-2 rounded-xl border border-purple-500/30 bg-purple-950/30 text-purple-300 text-xs font-semibold hover:bg-purple-900/40 transition-all text-center"
              >
                Client
              </button>
              <button
                type="button"
                onClick={() => handleDemo('freelancer')}
                className="py-2 px-2 rounded-xl border border-cyan-500/30 bg-cyan-950/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-900/40 transition-all text-center"
              >
                Freelancer
              </button>
              <button
                type="button"
                onClick={() => handleDemo('admin')}
                className="py-2 px-2 rounded-xl border border-rose-500/30 bg-rose-950/30 text-rose-300 text-xs font-semibold hover:bg-rose-900/40 transition-all text-center"
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="font-bold text-purple-400 hover:underline"
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
};
