import React, { useState, useEffect } from 'react';
import {
  Layers,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Wallet,
  TrendingUp,
  Award,
  ChevronRight,
  Users,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';
import api from '../api/axios';

export const LandingPage = ({ onNavigate }) => {
  const { switchDemoAccount, user } = useAuth();
  const [featuredProjects, setFeaturedProjects] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await api.get('/projects?status=OPEN');
        if (data.success) {
          setFeaturedProjects(data.projects?.slice(0, 3) || []);
        }
      } catch (err) {
        console.error('Failed to load featured jobs:', err);
      }
    };
    fetchFeatured();
  }, []);

  const handleQuickDemo = async (role) => {
    await switchDemoAccount(role);
    if (role === 'client') onNavigate('client-dashboard');
    else if (role === 'freelancer' || role === 'designer') onNavigate('freelancer-dashboard');
    else if (role === 'admin') onNavigate('admin-dashboard');
  };

  return (
    <div className="space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative pt-12 lg:pt-20 text-center px-4 max-w-5xl mx-auto">
        {/* Glow pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/40 bg-purple-500/10 text-purple-300 text-xs font-bold mb-6 shadow-glow-purple animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>The Next-Generation Milestone Freelance Marketplace</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
          Hire with <span className="gradient-text-purple">Confidence</span>.
          <br />
          Pay in <span className="gradient-text-cyan">Milestones</span>.
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Say goodbye to full-upfront risks and final-delivery deadlocks. Break projects into
          verifiable stages — UI, Frontend, Backend & Deployment — with guaranteed escrow release.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={() => onNavigate('browse-projects')}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-sm shadow-glow-purple flex items-center gap-2.5 transition-all transform hover:-translate-y-1"
          >
            <span>Explore Milestone Projects</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleQuickDemo('client')}
            className="px-8 py-4 rounded-2xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-purple-500/40 text-white font-bold text-sm backdrop-blur-xl transition-all"
          >
            Test Client Demo (Post & Fund)
          </button>
        </div>

        {/* QUICK DEMO ACCOUNT TILES */}
        <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.025] backdrop-blur-2xl max-w-4xl mx-auto shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              1-Click Demo Accounts (Instant Role Preview)
            </span>
            <span className="text-[11px] text-purple-300 font-mono">Password: password123</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Client */}
            <div
              onClick={() => handleQuickDemo('client')}
              className="p-4 rounded-2xl border border-purple-500/30 bg-purple-950/20 hover:bg-purple-900/30 cursor-pointer transition-all hover:scale-105 text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-3 h-3 rounded-full bg-purple-400" />
                <span className="text-[10px] uppercase font-bold text-purple-300 px-2 py-0.5 rounded-md bg-purple-500/20">
                  Client
                </span>
              </div>
              <p className="text-xs font-bold text-white group-hover:text-purple-300">
                Aditi Sharma
              </p>
              <p className="text-[11px] text-slate-400">Post jobs, fund escrow & approve stages</p>
            </div>

            {/* Freelancer */}
            <div
              onClick={() => handleQuickDemo('freelancer')}
              className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-900/30 cursor-pointer transition-all hover:scale-105 text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400" />
                <span className="text-[10px] uppercase font-bold text-cyan-300 px-2 py-0.5 rounded-md bg-cyan-500/20">
                  Developer
                </span>
              </div>
              <p className="text-xs font-bold text-white group-hover:text-cyan-300">
                Rohan Mehta
              </p>
              <p className="text-[11px] text-slate-400">Submit deliverables & get paid stage-by-stage</p>
            </div>

            {/* Designer */}
            <div
              onClick={() => handleQuickDemo('designer')}
              className="p-4 rounded-2xl border border-pink-500/30 bg-pink-950/20 hover:bg-pink-900/30 cursor-pointer transition-all hover:scale-105 text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-3 h-3 rounded-full bg-pink-400" />
                <span className="text-[10px] uppercase font-bold text-pink-300 px-2 py-0.5 rounded-md bg-pink-500/20">
                  Designer
                </span>
              </div>
              <p className="text-xs font-bold text-white group-hover:text-pink-300">
                Ananya Verma
              </p>
              <p className="text-[11px] text-slate-400">Bid on proposals & showcase UI/UX portfolio</p>
            </div>

            {/* Admin */}
            <div
              onClick={() => handleQuickDemo('admin')}
              className="p-4 rounded-2xl border border-rose-500/30 bg-rose-950/20 hover:bg-rose-900/30 cursor-pointer transition-all hover:scale-105 text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="text-[10px] uppercase font-bold text-rose-300 px-2 py-0.5 rounded-md bg-rose-500/20">
                  Admin
                </span>
              </div>
              <p className="text-xs font-bold text-white group-hover:text-rose-300">
                Vikram (Admin)
              </p>
              <p className="text-[11px] text-slate-400">Manage users, monitor GMV & resolve disputes</p>
            </div>
          </div>
        </div>
      </section>

      {/* MILESTONE WORKFLOW INTERACTIVE SHOWCASE */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
            How The <span className="gradient-text-purple">Milestone Engine</span> Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Transparent, stage-by-stage execution with built-in revision cycles and instant escrow release.
          </p>
        </div>

        {/* 4 Interactive Stages Mockup */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Stage 1 */}
          <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/15 backdrop-blur-xl relative space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">
                Stage 1 • UI Design
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                ✅ Approved
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">Homepage & Menu Figma Wireframes</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Freelancer uploads interactive prototypes. Client reviews and clicks approve.
            </p>
            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-bold">₹3,000 Released</span>
              <Lock className="w-3.5 h-3.5 text-slate-500" />
            </div>
          </div>

          {/* Stage 2 */}
          <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/15 backdrop-blur-xl relative space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">
                Stage 2 • Frontend
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                ✅ Approved
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">React Views & Tailwind Components</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Revision #1 requested cart animation fix. Resubmitted #2 and approved!
            </p>
            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-bold">₹5,000 Released</span>
              <Lock className="w-3.5 h-3.5 text-slate-500" />
            </div>
          </div>

          {/* Stage 3 */}
          <div className="p-5 rounded-2xl border border-amber-500/40 bg-amber-950/20 backdrop-blur-xl relative space-y-3 shadow-glow-purple">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">
                Stage 3 • Backend
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold animate-pulse">
                📤 In Review
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">Express APIs & Booking Schema</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Deliverables submitted by developer with live Render API link. Awaiting client review.
            </p>
            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs">
              <span className="text-amber-300 font-bold">₹5,000 in Escrow</span>
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            </div>
          </div>

          {/* Stage 4 */}
          <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl relative space-y-3 opacity-70">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Stage 4 • Deploy
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-500/20 text-slate-400 text-[10px] font-bold">
                ⏳ Queued
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">Cloud Hosting & QA Testing</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unlocks automatically once Stage 3 is approved. Final project completion.
            </p>
            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs">
              <span className="text-slate-400 font-bold">₹2,000 in Escrow</span>
              <Lock className="w-3.5 h-3.5 text-slate-500" />
            </div>
          </div>
        </div>
      </section>

      {/* THREE PILLARS / ADVANTAGES */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:border-purple-500/40 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Simulated Escrow Protection</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Clients deposit project funds into a secure escrow wallet. Freelancers work with 100% confidence that funds are already allocated.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:border-cyan-500/40 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Revision History Tracking</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every deliverable submission (Attempt #1, #2, #3) retains timestamped feedback logs, preventing endless scope-creep disagreements.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:border-pink-500/40 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Real-Time Socket Collaboration</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Live messaging, typing indicators, milestone state synchronizations, and admin dispute arbitration out of the box.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED OPEN PROJECTS */}
      {featuredProjects.length > 0 && (
        <section className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Open Project Opportunities</h3>
              <p className="text-xs text-slate-400 mt-0.5">Explore projects ready for milestone bids</p>
            </div>
            <button
              onClick={() => onNavigate('browse-projects')}
              className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((p) => (
              <div
                key={p._id}
                onClick={() => onNavigate('project-detail', p._id)}
                className="p-6 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:border-purple-500/40 hover:bg-white/[0.06] cursor-pointer transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {p.category}
                    </span>
                    <span className="text-sm font-extrabold text-emerald-400">
                      {formatCurrency(p.budget)}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 mb-2">
                    {p.title}
                  </h4>

                  <p className="text-xs text-slate-300/80 line-clamp-3 leading-relaxed mb-4">
                    {p.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={p.clientId?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'}
                      alt={p.clientId?.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-slate-300 truncate">{p.clientId?.name}</span>
                  </div>
                  <span className="font-bold text-purple-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Bid <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
