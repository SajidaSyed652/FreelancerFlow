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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#DED3E3] bg-[#EEE6F5] text-[#765B9E] text-xs font-bold mb-6 shadow-sm animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5 text-[#9B83BD]" />
          <span>The Next-Generation Milestone Freelance Marketplace</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#302A35] tracking-tight leading-[1.15] mb-6">
          Hire with <span className="gradient-text-purple">Confidence</span>.
          <br />
          Pay in <span className="gradient-text-accent">Milestones</span>.
        </h1>

        <p className="text-base sm:text-lg text-[#6F6675] max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Say goodbye to full-upfront risks and final-delivery deadlocks. Break projects into
          verifiable stages — UI, Frontend, Backend & Deployment — with guaranteed escrow release.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={() => onNavigate('browse-projects')}
            className="px-8 py-4 rounded-2xl bg-[#9B83BD] hover:bg-[#8F78B5] text-white font-extrabold text-sm shadow-[0_4px_20px_rgba(155,131,189,0.35)] flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5"
          >
            <span>Explore Milestone Projects</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/*<button
            onClick={() => handleQuickDemo('client')}
            className="px-8 py-4 rounded-2xl border border-[#DED3E3] bg-[#FFFDF9] hover:bg-[#EEE6F5] text-[#302A35] font-bold text-sm shadow-sm transition-all"
          >
            Test Client Demo (Post & Fund)
          </button>
        </div>

        {/* QUICK DEMO ACCOUNT TILES 
        <div className="p-6 rounded-3xl border border-[#DED3E3] bg-[#FFFDF9]/95 backdrop-blur-2xl max-w-4xl mx-auto shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold text-[#6F6675] uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#C29A68]" />
              1-Click Demo Accounts (Instant Role Preview)
            </span>
            <span className="text-[11px] text-[#765B9E] font-mono font-semibold">Password: password123</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Client 
            <div
              onClick={() => handleQuickDemo('client')}
              className="p-4 rounded-2xl border border-[#DED3E3] bg-[#EEE6F5]/50 hover:bg-[#EEE6F5] hover:border-[#9B83BD] cursor-pointer transition-all hover:scale-[1.02] text-left group shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#9B83BD]" />
                <span className="text-[10px] uppercase font-bold text-[#765B9E] px-2 py-0.5 rounded-md bg-[#FFFDF9] border border-[#DED3E3]">
                  Client
                </span>
              </div>
              <p className="text-xs font-bold text-[#302A35] group-hover:text-[#765B9E] transition-colors">
                Aditi Sharma
              </p>
              <p className="text-[11px] text-[#6F6675] mt-0.5">Post jobs, fund escrow & approve stages</p>
            </div>

            {/* Freelancer 
            <div
              onClick={() => handleQuickDemo('freelancer')}
              className="p-4 rounded-2xl border border-[#C8DECF] bg-[#EDF4EF]/60 hover:bg-[#EDF4EF] hover:border-[#789B83] cursor-pointer transition-all hover:scale-[1.02] text-left group shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#789B83]" />
                <span className="text-[10px] uppercase font-bold text-[#789B83] px-2 py-0.5 rounded-md bg-[#FFFDF9] border border-[#C8DECF]">
                  Developer
                </span>
              </div>
              <p className="text-xs font-bold text-[#302A35] group-hover:text-[#789B83] transition-colors">
                Rohan Mehta
              </p>
              <p className="text-[11px] text-[#6F6675] mt-0.5">Submit deliverables & get paid stage-by-stage</p>
            </div>

            {/* Designer 
            <div
              onClick={() => handleQuickDemo('designer')}
              className="p-4 rounded-2xl border border-[#DED3E3] bg-[#F3EDF9]/60 hover:bg-[#F3EDF9] hover:border-[#B9A7D9] cursor-pointer transition-all hover:scale-[1.02] text-left group shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B9A7D9]" />
                <span className="text-[10px] uppercase font-bold text-[#765B9E] px-2 py-0.5 rounded-md bg-[#FFFDF9] border border-[#DED3E3]">
                  Designer
                </span>
              </div>
              <p className="text-xs font-bold text-[#302A35] group-hover:text-[#765B9E] transition-colors">
                Ananya Verma
              </p>
              <p className="text-[11px] text-[#6F6675] mt-0.5">Bid on proposals & showcase UI/UX portfolio</p>
            </div>

            {/* Admin 
            <div
              onClick={() => handleQuickDemo('admin')}
              className="p-4 rounded-2xl border border-[#E8D3BA] bg-[#FAF3EA]/60 hover:bg-[#FAF3EA] hover:border-[#C29A68] cursor-pointer transition-all hover:scale-[1.02] text-left group shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C29A68]" />
                <span className="text-[10px] uppercase font-bold text-[#C29A68] px-2 py-0.5 rounded-md bg-[#FFFDF9] border border-[#E8D3BA]">
                  Admin
                </span>
              </div>
              <p className="text-xs font-bold text-[#302A35] group-hover:text-[#C29A68] transition-colors">
                Vikram (Admin)
              </p>
              <p className="text-[11px] text-[#6F6675] mt-0.5">Manage users, monitor GMV & resolve disputes</p>
            </div>
          </div>*/}
        </div>
      </section>

      {/* MILESTONE WORKFLOW INTERACTIVE SHOWCASE */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="lg-banner rounded-3xl border border-[#DED3E3] p-6 sm:p-10 shadow-lg overflow-hidden relative">
          {/* Animated Background Layer: Floating Orbs */}
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
          <div className="orb orb-4" />

          {/* Continuous Horizontal Moving Track (Right to Left Marquee) */}
          <div className="track" aria-hidden="true">
            {/* Sequence 1 */}
            <div className="bar" />
            <div className="bar dark" />
            <div className="bar" />
            <div className="bar dark" />
            <div className="bar" />
            <div className="bar dark" />
            <div className="bar" />
            <div className="bar dark" />
            <div className="bar" />
            <div className="bar dark" />
            <div className="bar" />
            <div className="bar dark" />
            <div className="bar" />
            <div className="bar dark" />
            <div className="bar" />
            <div className="bar dark" />

            {/* Sequence 2 (Identical for seamless infinite loop) */}
            <div className="bar" />
            <div className="bar dark" />
            <div className="bar" />
            <div className="bar dark" />
            <div className="bar" />
            <div className="bar dark" />
            <div className="bar" />
            <div className="bar dark" />
            <div className="bar" />
            <div className="bar dark" />
            <div className="bar" />
            <div className="bar dark" />
            <div className="bar" />
            <div className="bar dark" />
            <div className="bar" />
            <div className="bar dark" />
          </div>

          {/* Frosted Glass Sheet Layer */}
          <div className="glass-sheet" aria-hidden="true" />

          {/* Foreground Content: Title & 4 Milestone Cards */}
          <div className="banner-content relative space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#C8A2FF] mb-3">
                How The Milestone Engine Works
              </h2>
              {/*<p className="text-xs sm:text-sm text-[#6F6675]">
                Transparent, stage-by-stage execution with built-in revision cycles and instant escrow release.
              </p>*/}
            </div>

            {/* 4 Interactive Stages Cards - Continuously Moving Marquee */}
            <div className="milestone-track-wrapper overflow-hidden w-full py-2">
              <div className="milestone-track">
                {/* Sequence 1 */}
                <div className="milestone-sequence">
                  {/* Stage 1 */}
                  <div className="milestone-card p-6 rounded-2xl border border-white/80 bg-white/80 backdrop-blur-md shadow-sm hover:shadow-md hover:bg-white/95 transition-all duration-300 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EEE6F5] border border-[#DED3E3] flex items-center justify-center text-[#765B9E] font-bold shadow-sm">
                      1
                    </div>
                    <h3 className="text-sm font-bold text-[#302A35]">Post with Milestones</h3>
                    <p className="text-xs text-[#6F6675] leading-relaxed">
                      Client specifies stages, budgets, deliverables, and automated deadlines.
                    </p>
                  </div>

                  {/* Stage 2 */}
                  <div className="milestone-card p-6 rounded-2xl border border-white/80 bg-white/80 backdrop-blur-md shadow-sm hover:shadow-md hover:bg-white/95 transition-all duration-300 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EEE6F5] border border-[#DED3E3] flex items-center justify-center text-[#765B9E] font-bold shadow-sm">
                      2
                    </div>
                    <h3 className="text-sm font-bold text-[#302A35]">Lock Escrow Funds</h3>
                    <p className="text-xs text-[#6F6675] leading-relaxed">
                      Client funds the active milestone into a cryptographically secured simulated vault.
                    </p>
                  </div>

                  {/* Stage 3 */}
                  <div className="milestone-card p-6 rounded-2xl border border-white/80 bg-white/80 backdrop-blur-md shadow-sm hover:shadow-md hover:bg-white/95 transition-all duration-300 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EEE6F5] border border-[#DED3E3] flex items-center justify-center text-[#765B9E] font-bold shadow-sm">
                      3
                    </div>
                    <h3 className="text-sm font-bold text-[#302A35]">Deliver & Review</h3>
                    <p className="text-xs text-[#6F6675] leading-relaxed">
                      Freelancer uploads code/designs. Client tests within a structured feedback window.
                    </p>
                  </div>

                  {/* Stage 4 */}
                  <div className="milestone-card p-6 rounded-2xl border border-white/80 bg-white/80 backdrop-blur-md shadow-sm hover:shadow-md hover:bg-white/95 transition-all duration-300 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EEE6F5] border border-[#DED3E3] flex items-center justify-center text-[#765B9E] font-bold shadow-sm">
                      4
                    </div>
                    <h3 className="text-sm font-bold text-[#302A35]">Instant Stage Payout</h3>
                    <p className="text-xs text-[#6F6675] leading-relaxed">
                      Approval triggers immediate escrow release. Next milestone unlocks automatically.
                    </p>
                  </div>
                </div>

                {/* Sequence 2 (Duplicate for seamless infinite loop) */}
                <div className="milestone-sequence" aria-hidden="true">
                  {/* Stage 1 */}
                  <div className="milestone-card p-6 rounded-2xl border border-white/80 bg-white/80 backdrop-blur-md shadow-sm hover:shadow-md hover:bg-white/95 transition-all duration-300 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EEE6F5] border border-[#DED3E3] flex items-center justify-center text-[#765B9E] font-bold shadow-sm">
                      1
                    </div>
                    <h3 className="text-sm font-bold text-[#302A35]">Post with Milestones</h3>
                    <p className="text-xs text-[#6F6675] leading-relaxed">
                      Client specifies stages, budgets, deliverables, and automated deadlines.
                    </p>
                  </div>

                  {/* Stage 2 */}
                  <div className="milestone-card p-6 rounded-2xl border border-white/80 bg-white/80 backdrop-blur-md shadow-sm hover:shadow-md hover:bg-white/95 transition-all duration-300 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EEE6F5] border border-[#DED3E3] flex items-center justify-center text-[#765B9E] font-bold shadow-sm">
                      2
                    </div>
                    <h3 className="text-sm font-bold text-[#302A35]">Lock Escrow Funds</h3>
                    <p className="text-xs text-[#6F6675] leading-relaxed">
                      Client funds the active milestone into a cryptographically secured simulated vault.
                    </p>
                  </div>

                  {/* Stage 3 */}
                  <div className="milestone-card p-6 rounded-2xl border border-white/80 bg-white/80 backdrop-blur-md shadow-sm hover:shadow-md hover:bg-white/95 transition-all duration-300 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EEE6F5] border border-[#DED3E3] flex items-center justify-center text-[#765B9E] font-bold shadow-sm">
                      3
                    </div>
                    <h3 className="text-sm font-bold text-[#302A35]">Deliver & Review</h3>
                    <p className="text-xs text-[#6F6675] leading-relaxed">
                      Freelancer uploads code/designs. Client tests within a structured feedback window.
                    </p>
                  </div>

                  {/* Stage 4 */}
                  <div className="milestone-card p-6 rounded-2xl border border-white/80 bg-white/80 backdrop-blur-md shadow-sm hover:shadow-md hover:bg-white/95 transition-all duration-300 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EEE6F5] border border-[#DED3E3] flex items-center justify-center text-[#765B9E] font-bold shadow-sm">
                      4
                    </div>
                    <h3 className="text-sm font-bold text-[#302A35]">Instant Stage Payout</h3>
                    <p className="text-xs text-[#6F6675] leading-relaxed">
                      Approval triggers immediate escrow release. Next milestone unlocks automatically.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM ADVANTAGES */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl border border-[#DED3E3] bg-[#FFFDF9] space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#EDF4EF] border border-[#C8DECF] flex items-center justify-center text-[#789B83]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#302A35]">100% Escrow Protection</h3>
            <p className="text-xs text-[#6F6675] leading-relaxed">
              Funds are never in danger. Freelancers only start working once escrow is locked, and clients only release funds upon verifying progress.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-[#DED3E3] bg-[#FFFDF9] space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#EEE6F5] border border-[#DED3E3] flex items-center justify-center text-[#765B9E]">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#302A35]">Role-Based Portfolios</h3>
            <p className="text-xs text-[#6F6675] leading-relaxed">
              Freelancers build verified stage completion badges, live demonstration links, and verified escrow earnings credibility.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-[#DED3E3] bg-[#FFFDF9] space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF3EA] border border-[#E8D3BA] flex items-center justify-center text-[#C29A68]">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#302A35]">Real-time Collaboration</h3>
            <p className="text-xs text-[#6F6675] leading-relaxed">
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
              <h3 className="text-xl sm:text-2xl font-bold text-[#302A35]">Open Project Opportunities</h3>
              <p className="text-xs text-[#6F6675] mt-0.5">Explore projects ready for milestone bids</p>
            </div>
            <button
              onClick={() => onNavigate('browse-projects')}
              className="text-xs font-bold text-[#765B9E] hover:text-[#9B83BD] flex items-center gap-1 transition-colors"
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
                className="p-6 rounded-3xl border border-[#DED3E3] bg-[#FFFDF9] hover:border-[#9B83BD] hover:shadow-[0_12px_32px_rgba(155,131,189,0.14)] cursor-pointer transition-all flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-[#EEE6F5] text-[#765B9E] border border-[#DED3E3]">
                      {p.category}
                    </span>
                    <span className="text-sm font-extrabold text-[#789B83]">
                      {formatCurrency(p.budget)}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#302A35] group-hover:text-[#765B9E] transition-colors line-clamp-2 mb-2">
                    {p.title}
                  </h4>

                  <p className="text-xs text-[#6F6675] line-clamp-3 leading-relaxed mb-4">
                    {p.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#DED3E3]/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={p.clientId?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'}
                      alt={p.clientId?.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-[#6F6675] truncate">{p.clientId?.name}</span>
                  </div>
                  <span className="font-bold text-[#765B9E] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
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
