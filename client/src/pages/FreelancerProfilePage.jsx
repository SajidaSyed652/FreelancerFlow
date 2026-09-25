import React, { useState, useEffect } from 'react';
import {
  User,
  Star,
  Sparkles,
  Award,
  ExternalLink,
  Plus,
  Briefcase,
  CheckCircle2,
  Save,
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export const FreelancerProfilePage = ({ onNavigate }) => {
  const { user, refreshUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [editing, setEditing] = useState(false);

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [title, setTitle] = useState(user?.title || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [skills, setSkills] = useState(user?.skills?.join(', ') || '');
  const [hourlyRate, setHourlyRate] = useState(user?.hourlyRate || 800);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user?._id) {
      fetchReviews();
    }
  }, [user?._id]);

  const fetchReviews = async () => {
    try {
      const data = await api.get(`/reviews/user/${user._id}`);
      if (data.success) {
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const skillsArr = skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const data = await api.put('/auth/profile', {
        name,
        title,
        bio,
        skills: skillsArr,
        hourlyRate: Number(hourlyRate),
      });

      if (data.success) {
        await refreshUser();
        setSaved(true);
        setEditing(false);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Profile Header */}
      <div className="p-8 rounded-3xl border border-[#DED3E3] bg-[#FFFDF9] shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-20 h-20 rounded-3xl object-cover ring-2 ring-[#789B83]/40 shadow-sm"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-[#302A35]">{user?.name}</h2>
                {user?.isVerified && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDF4EF] text-[#789B83] border border-[#C8DECF] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-[#765B9E]">{user?.title}</p>
              <div className="flex items-center gap-3 pt-1 text-xs text-[#6F6675]">
                <span className="flex items-center gap-1 text-[#C29A68] font-bold">
                  <Star className="w-3.5 h-3.5 fill-[#C29A68]" />
                  {user?.ratings?.avg || 5.0} ({reviews.length} reviews)
                </span>
                <span>•</span>
                <span className="text-[#789B83] font-bold">
                  {formatCurrency(user?.hourlyRate || 800)}/hr
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 rounded-xl border border-[#DED3E3] bg-[#EEE6F5] text-[#765B9E] text-xs font-bold hover:bg-[#D8CDE8] transition-all self-start"
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Bio */}
        {!editing ? (
          <p className="text-xs text-[#6F6675] leading-relaxed max-w-3xl">
            {user?.bio || 'Passionate developer dedicated to delivering high quality milestone deliverables.'}
          </p>
        ) : (
          <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-[#DED3E3]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#302A35] mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FFFDF9] border border-[#DED3E3] text-xs text-[#302A35] focus:outline-none focus:border-[#9B83BD]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#302A35] mb-1">Professional Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FFFDF9] border border-[#DED3E3] text-xs text-[#302A35] focus:outline-none focus:border-[#9B83BD]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#302A35] mb-1">Bio Summary</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#FFFDF9] border border-[#DED3E3] text-xs text-[#302A35] focus:outline-none focus:border-[#9B83BD]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#302A35] mb-1">Skills (comma-separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#FFFDF9] border border-[#DED3E3] text-xs text-[#302A35] focus:outline-none focus:border-[#9B83BD]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#9B83BD] hover:bg-[#8F78B5] text-white text-xs font-bold flex items-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4" /> Save Profile Changes
            </button>
          </form>
        )}

        {/* Skills Chips */}
        {user?.skills?.length > 0 && (
          <div className="pt-2">
            <h4 className="text-[11px] font-bold text-[#6F6675] uppercase tracking-wider mb-2">
              Verified Technical Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {user.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl bg-[#EEE6F5]/50 border border-[#DED3E3] text-xs text-[#765B9E] font-mono font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Portfolio Showcase */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#302A35] flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-[#765B9E]" />
          Featured Portfolio Projects
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {user?.portfolio?.length > 0 ? (
            user.portfolio.map((item, i) => (
              <div
                key={i}
                className="p-5 rounded-3xl border border-[#DED3E3] bg-[#FFFDF9] space-y-3 shadow-sm"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-40 rounded-2xl object-cover mb-2"
                  />
                )}
                <h4 className="text-sm font-bold text-[#302A35]">{item.title}</h4>
                <p className="text-xs text-[#6F6675] leading-relaxed">{item.description}</p>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#765B9E] hover:underline pt-1"
                  >
                    <span>View Live Demonstration</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 rounded-3xl border border-dashed border-[#DED3E3] bg-[#FFFDF9] text-center text-xs text-[#6F6675] sm:col-span-2">
              No portfolio projects uploaded yet.
            </div>
          )}
        </div>
      </div>

      {/* Client Reviews */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#302A35] flex items-center gap-2">
          <Star className="w-5 h-5 text-[#C29A68]" />
          Client Testimonials & Milestone Ratings ({reviews.length})
        </h3>

        {reviews.length === 0 ? (
          <div className="p-8 rounded-3xl border border-dashed border-[#DED3E3] bg-[#FFFDF9] text-center text-xs text-[#6F6675]">
            No completed project reviews yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="p-5 rounded-3xl border border-[#DED3E3] bg-[#FFFDF9] space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.reviewerId?.avatar}
                      alt={rev.reviewerId?.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#302A35]">{rev.reviewerId?.name}</p>
                      <p className="text-[10px] text-[#6F6675]">{formatDate(rev.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex text-[#C29A68] text-xs">
                    {'★'.repeat(rev.rating)}
                  </div>
                </div>
                <p className="text-xs text-[#6F6675] leading-relaxed italic">"{rev.comment}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
