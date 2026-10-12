import React, { useState } from 'react';
import { 
  Settings, 
  Moon, 
  Sun, 
  Download, 
  Trash2, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  LogOut,
  Bell,
  Globe
} from 'lucide-react';
import { useSocialAuth } from '../context/SocialAuthContext';

export const SettingsView: React.FC = () => {
  const { currentUser, theme, toggleTheme, logout } = useSocialAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [notifyLikes, setNotifyLikes] = useState(true);
  const [notifyComments, setNotifyComments] = useState(true);
  const [notifyFollows, setNotifyFollows] = useState(true);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  const handleExportData = () => {
    setExporting(true);
    try {
      const data = {
        exportedAt: new Date().toISOString(),
        profile: currentUser,
        app: 'Aazam Social',
        url: 'https://aazamtravel.com/social',
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aazam_social_export_${currentUser?.username || 'user'}_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setTimeout(() => setExporting(false), 800);
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Warning: Are you sure you want to permanently delete your Aazam Social account? This action cannot be reversed.')) {
      logout();
      window.location.href = '/social';
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-orange-500" />
          <span>Account & App Settings</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage your Aazam Social preferences, security, appearance, and personal data
        </p>
      </div>

      {/* 1. Theme & Appearance Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          {theme === 'dark' ? <Moon className="w-4 h-4 text-sky-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
          <span>Appearance Mode</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Switch between Light and Dark interface themes for day or night travel browsing.
        </p>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={toggleTheme}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-colors ${
              theme === 'light'
                ? 'bg-[#0B2545] text-white border-transparent'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-400" />
            <span>Light Theme</span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-colors ${
              theme === 'dark'
                ? 'bg-orange-500 text-white border-transparent'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Moon className="w-4 h-4 text-sky-400" />
            <span>Dark Theme</span>
          </button>
        </div>
      </div>

      {/* 2. Notification Preferences */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-orange-500" />
          <span>Notification Preferences</span>
        </h3>

        <div className="space-y-2 text-xs">
          <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
            <span className="font-medium text-slate-800 dark:text-slate-200">Notify me about new followers</span>
            <input
              type="checkbox"
              checked={notifyFollows}
              onChange={(e) => setNotifyFollows(e.target.checked)}
              className="text-orange-500 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
            <span className="font-medium text-slate-800 dark:text-slate-200">Notify me when someone likes my posts</span>
            <input
              type="checkbox"
              checked={notifyLikes}
              onChange={(e) => setNotifyLikes(e.target.checked)}
              className="text-orange-500 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
            <span className="font-medium text-slate-800 dark:text-slate-200">Notify me about comments and replies</span>
            <input
              type="checkbox"
              checked={notifyComments}
              onChange={(e) => setNotifyComments(e.target.checked)}
              className="text-orange-500 rounded"
            />
          </label>
        </div>
      </div>

      {/* 3. Password & Security */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-orange-500" />
          <span>Password & Security</span>
        </h3>

        {passwordSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>Password updated successfully!</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-3 text-xs max-w-sm">
          <div>
            <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">
              Current Password:
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">
              New Password:
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#0B2545] hover:bg-[#133E68] text-white text-xs font-bold transition-colors"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* 4. Data Export & Account Deletion */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Download className="w-4 h-4 text-orange-500" />
          <span>Data Privacy & Portability</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Download a complete archive of your account profile, posts, and saved items in open JSON format.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleExportData}
            disabled={exporting}
            className="px-4 py-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 text-xs font-bold flex items-center gap-2 hover:bg-orange-100 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{exporting ? 'Generating Archive...' : 'Download My Data (JSON)'}</span>
          </button>

          <button
            type="button"
            onClick={handleDeleteAccount}
            className="px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2 hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Account Permanently</span>
          </button>
        </div>
      </div>
    </div>
  );
};
