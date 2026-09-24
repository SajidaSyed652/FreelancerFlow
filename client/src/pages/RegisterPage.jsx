import React, { useState } from 'react';
import { Layers, User, Briefcase, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = ({ onNavigate }) => {
  const { register } = useAuth();
  const [role, setRole] = useState('freelancer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const skillsArray = skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const user = await register({
        name,
        email,
        password,
        role,
        title: title || (role === 'client' ? 'Project Owner' : 'Full Stack Engineer'),
        skills: skillsArray,
      });

      if (user.role === 'client') onNavigate('client-dashboard');
      else onNavigate('freelancer-dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-white">Join FreelanceFlow</h2>
          <p className="text-xs text-slate-400 mt-1">
            Choose your account role to start collaborating with escrow milestones
          </p>
        </div>

        <div className="p-8 rounded-3xl border border-white/15 bg-[#0f0f29]/90 backdrop-blur-2xl shadow-2xl space-y-6">
          {/* Role selector buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('client')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                role === 'client'
                  ? 'border-purple-500 bg-purple-950/40 shadow-glow-purple'
                  : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
              }`}
            >
              <Briefcase className={`w-5 h-5 mb-2 ${role === 'client' ? 'text-purple-400' : 'text-slate-400'}`} />
              <div className="text-xs font-bold text-white">I am a Client</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Post projects & hire freelancers</p>
            </button>

            <button
              type="button"
              onClick={() => setRole('freelancer')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                role === 'freelancer'
                  ? 'border-cyan-500 bg-cyan-950/40 shadow-glow-cyan'
                  : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
              }`}
            >
              <User className={`w-5 h-5 mb-2 ${role === 'freelancer' ? 'text-cyan-400' : 'text-slate-400'}`} />
              <div className="text-xs font-bold text-white">I am a Freelancer</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Apply for jobs & earn stage payouts</p>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rohan Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rohan@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Professional Title / Headline
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={role === 'client' ? 'CEO @ TechCorp' : 'Full Stack & React Developer'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
              />
            </div>

            {role === 'freelancer' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React.js, Node.js, Tailwind CSS, MongoDB"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            )}

            {error && (
              <p className="text-xs text-rose-400 font-semibold bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs shadow-glow-purple flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400">
          Already registered?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="font-bold text-purple-400 hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
