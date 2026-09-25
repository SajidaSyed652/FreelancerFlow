import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { Navbar } from './components/common/Navbar';
import { DepositModal } from './components/common/DepositModal';
import { GlobalBackground } from './components/common/GlobalBackground';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ClientDashboard } from './pages/ClientDashboard';
import { FreelancerDashboard } from './pages/FreelancerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { BrowseProjectsPage } from './pages/BrowseProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { PostProjectPage } from './pages/PostProjectPage';
import { WalletPage } from './pages/WalletPage';
import { FreelancerProfilePage } from './pages/FreelancerProfilePage';
import { MyProposalsPage } from './pages/MyProposalsPage';
import { Layers, ShieldCheck } from 'lucide-react';

function AppContent() {
  const { user, isClient, isFreelancer, isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState('landing');
  const [activeProjectId, setActiveProjectId] = useState('66f2a8901234567890abcdef');
  const [showDepositModal, setShowDepositModal] = useState(false);

  const navigateTo = (page, projectId = null) => {
    if (projectId) setActiveProjectId(projectId);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={navigateTo} />;
      case 'login':
        return <LoginPage onNavigate={navigateTo} />;
      case 'register':
        return <RegisterPage onNavigate={navigateTo} />;
      case 'client-dashboard':
        return <ClientDashboard onNavigate={navigateTo} onOpenDeposit={() => setShowDepositModal(true)} />;
      case 'freelancer-dashboard':
        return <FreelancerDashboard onNavigate={navigateTo} />;
      case 'admin-dashboard':
        return <AdminDashboard onNavigate={navigateTo} />;
      case 'browse-projects':
        return <BrowseProjectsPage onNavigate={navigateTo} />;
      case 'project-detail':
        return (
          <ProjectDetailPage
            projectId={activeProjectId}
            onNavigate={navigateTo}
            onOpenDeposit={() => setShowDepositModal(true)}
          />
        );
      case 'post-project':
        return <PostProjectPage onNavigate={navigateTo} />;
      case 'wallet':
        return <WalletPage onOpenDeposit={() => setShowDepositModal(true)} />;
      case 'profile':
        return <FreelancerProfilePage onNavigate={navigateTo} />;
      case 'my-proposals':
        return <MyProposalsPage onNavigate={navigateTo} />;
      default:
        return <LandingPage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between text-[#302A35] relative">
      <GlobalBackground />
      <div className="relative z-10">
        <Navbar
          onOpenDeposit={() => setShowDepositModal(true)}
          onNavigate={navigateTo}
          currentPage={currentPage}
        />
        <main className="animate-in fade-in duration-300">
          {renderPage()}
        </main>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-[#DED3E3] bg-[#FFFDF9]/90 backdrop-blur-2xl py-8 px-4 lg:px-8 mt-16 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6F6675]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#9B83BD] flex items-center justify-center shadow-sm">
              <Layers className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-[#302A35]">FreelanceFlow</span>
            <span>— Structured Milestone Freelance Engine</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => navigateTo('browse-projects')} className="hover:text-[#765B9E] transition-colors">
              Projects
            </button>
            <button onClick={() => navigateTo('wallet')} className="hover:text-[#765B9E] transition-colors">
              Escrow Wallet
            </button>
            <span className="text-[#789B83] font-mono flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Simulated Academic Mode
            </span>
          </div>
        </div>
      </footer>

      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <AppContent />
      </SocketProvider>
    </AuthProvider>
  );
}
