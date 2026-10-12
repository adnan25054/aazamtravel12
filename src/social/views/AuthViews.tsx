import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Compass,
  AlertCircle 
} from 'lucide-react';
import { SocialLogo } from '../components/SocialLogo';
import { useSocialAuth } from '../context/SocialAuthContext';
import { SocialProfile } from '../types';

interface AuthViewsProps {
  initialMode?: 'login' | 'signup';
  onSuccess: () => void;
  onNavigateHome: () => void;
}

export const AuthViews: React.FC<AuthViewsProps> = ({
  initialMode = 'login',
  onSuccess,
  onNavigateHome,
}) => {
  const { login, signup, switchAccount } = useSocialAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername || !password) {
      setError('Please provide your username/email and password.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await login(emailOrUsername, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Try demo login below.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !displayName || !password) {
      setError('All fields are required to register.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await signup({
        username: username.toLowerCase().replace(/[^a-z0-9_]/g, ''),
        email,
        displayName,
        password,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try a different username.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setResetSent(true);
  };

  // Demo creator profiles for immediate 1-tap testing
  const demoAccounts = [
    {
      name: 'Aazam Official (Super Admin)',
      user: {
        id: 'usr_super_01',
        username: 'aazam_official',
        displayName: 'Aazam Social',
        email: 'social@aazamtravel.com',
        avatarUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80',
        role: 'super_admin' as const,
        status: 'active' as const,
        followersCount: 14200,
        followingCount: 18,
        postsCount: 24,
        isVerified: true,
        isPrivate: false,
        createdAt: '2026-01-01T08:00:00.000Z',
      },
    },
    {
      name: 'Priya Sharma (Creator)',
      user: {
        id: 'usr_priya_02',
        username: 'wanderlust_priya',
        displayName: 'Priya Sharma',
        email: 'priya.travels@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        role: 'user' as const,
        status: 'active' as const,
        followersCount: 8450,
        followingCount: 320,
        postsCount: 58,
        isVerified: true,
        isPrivate: false,
        createdAt: '2026-01-10T11:20:00.000Z',
      },
    },
  ];

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-8">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center cursor-pointer" onClick={onNavigateHome}>
            <SocialLogo size="lg" showTagline={true} />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
            {mode === 'login'
              ? 'Sign In to Your Social Account'
              : mode === 'signup'
              ? 'Create Your Creator Profile'
              : 'Reset Your Password'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {mode === 'login'
              ? 'Connect with verified travel storytellers across India'
              : mode === 'signup'
              ? 'Share scenic railway moments, road trips, and adventures'
              : 'Enter your registered email address to receive recovery steps'}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 border border-red-200 dark:border-red-800">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email or Username:
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder="e.g. wanderlust_priya or social@aazamtravel.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Password:
                </label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-orange-600 dark:text-orange-400 hover:underline text-[11px]"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 2. Signup Form */}
        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Display Name:
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Sameer Kapoor"
                required
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Unique Username:
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="sameer_travels"
                  required
                  className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Choose Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Creating Profile...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 3. Forgot Password Form */}
        {mode === 'forgot' && (
          <div className="space-y-4 text-xs">
            {resetSent ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
                <p className="font-bold">Password Reset Link Sent</p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                  We sent password reset instructions to your email address. Check your inbox to complete verification.
                </p>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="mt-2 text-xs font-bold text-emerald-700 hover:underline"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your Registered Email:
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#0B2545] hover:bg-[#133E68] text-white font-bold"
                >
                  Send Reset Link
                </button>
              </form>
            )}
          </div>
        )}

        {/* Switch mode links */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          {mode === 'login' ? (
            <p>
              Don&rsquo;t have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="font-bold text-orange-600 dark:text-orange-400 hover:underline"
              >
                Sign Up for Free
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-orange-600 dark:text-orange-400 hover:underline"
              >
                Sign In here
              </button>
            </p>
          )}
        </div>

        {/* Quick Demo Switcher */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            Instant 1-Click Test Access:
          </div>
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((item) => (
              <button
                key={item.user.username}
                type="button"
                onClick={() => {
                  switchAccount(item.user as SocialProfile);
                  onSuccess();
                }}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/40 border border-slate-200/80 dark:border-slate-700/80 text-[11px] font-semibold text-slate-700 dark:text-slate-300 text-left transition-colors flex items-center gap-2"
              >
                <img
                  src={item.user.avatarUrl}
                  alt={item.user.displayName}
                  className="w-6 h-6 rounded-full object-cover shrink-0"
                />
                <span className="truncate">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
