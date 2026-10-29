import React, { useState } from 'react';
import { loginAdmin } from '../../api';
import { AdminUser } from '../../types';
import { OFFICIAL_LOGO_URL } from '../Logo';
import { Lock, Mail, Key, AlertCircle, Loader2, X, CheckCircle, Shield } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AdminUser) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('admin@aazamtravels.com');
  const [password, setPassword] = useState('AazamTravels@2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await loginAdmin(email, password);
      onLoginSuccess(result.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleUseDemoCredentials = () => {
    setEmail('admin@aazamtravels.com');
    setPassword('AazamTravels@2026');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-3">
            <img
              src={OFFICIAL_LOGO_URL}
              alt="Aazam Travel Agency Logo"
              className="h-16 w-auto object-contain"
            />
          </div>
          <h3 className="text-xl font-extrabold text-[#0B2545]">
            Agency Owner Login
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Secure access to Aazam Travel Agency management portal
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aazamtravels.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Admin Password
            </label>
            <div className="relative">
              <Key className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm text-slate-800"
              />
            </div>
          </div>

          {/* Quick Demo Pre-fill Box for seamless testing */}
          <div className="p-3 bg-blue-50/70 border border-blue-200/70 rounded-xl text-xs space-y-1 text-slate-700">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0B2545] flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                Default Credentials:
              </span>
              <button
                type="button"
                onClick={handleUseDemoCredentials}
                className="text-[11px] font-bold text-orange-600 hover:underline"
              >
                Auto-fill
              </button>
            </div>
            <div className="text-[11px] text-slate-600 font-mono">
              Email: admin@aazamtravels.com<br />
              Password: AazamTravels@2026
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-[#0B2545] hover:bg-blue-900 text-white shadow-md transition-all disabled:opacity-75"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Sign In to Admin Panel</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
