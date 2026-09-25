import React, { useState, useEffect } from 'react';
import { Send, Briefcase, Calendar, ChevronRight } from 'lucide-react';
import api from '../api/axios';
import { formatCurrency, formatDate } from '../utils/formatters';
import { StatusBadge } from '../components/common/StatusBadge';

export const MyProposalsPage = ({ onNavigate }) => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const data = await api.get('/proposals/freelancer/my');
      if (data.success) {
        setProposals(data.proposals || []);
      }
    } catch (err) {
      console.error('Failed to load proposals:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-[#302A35]">My Submitted Proposals</h2>
        <p className="text-xs text-[#6F6675] mt-1">
          Track the status of your milestone bids across client listings
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-xs text-[#6F6675]">Loading submitted bids...</div>
      ) : proposals.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-[#DED3E3] bg-[#FFFDF9]">
          <Send className="w-12 h-12 text-[#968D99] mx-auto mb-3 opacity-60" />
          <h4 className="text-base font-bold text-[#302A35]">No Proposals Submitted</h4>
          <p className="text-xs text-[#6F6675] mt-1 mb-4">
            Explore open project listings and submit milestone bids to start working.
          </p>
          <button
            onClick={() => onNavigate('browse-projects')}
            className="px-6 py-2.5 rounded-xl bg-[#9B83BD] hover:bg-[#8F78B5] text-white font-bold text-xs shadow-sm transition-all"
          >
            Explore Projects
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map((prop) => (
            <div
              key={prop._id}
              onClick={() => onNavigate('project-detail', prop.projectId?._id)}
              className="p-6 rounded-3xl border border-[#DED3E3] bg-[#FFFDF9] hover:border-[#9B83BD] hover:shadow-[0_12px_32px_rgba(155,131,189,0.14)] cursor-pointer transition-all space-y-3 group shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <StatusBadge status={prop.status} />
                    <span className="text-[11px] text-[#6F6675]">
                      Submitted on {formatDate(prop.createdAt)}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#302A35] group-hover:text-[#765B9E] transition-colors">
                    {prop.projectId?.title || 'Project'}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-base font-extrabold text-[#789B83]">
                    Bid: {formatCurrency(prop.bidAmount)}
                  </span>
                  <p className="text-[11px] text-[#6F6675]">
                    Est: {prop.deliveryDays} delivery days
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#302A35] line-clamp-2 leading-relaxed bg-[#EEE6F5]/40 p-3 rounded-xl border border-[#DED3E3]/60">
                {prop.coverLetter}
              </p>

              <div className="pt-2 flex items-center justify-between text-xs text-[#765B9E] font-bold">
                <span>Client: {prop.projectId?.clientId?.name || 'Project Owner'}</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View Project Milestones <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
