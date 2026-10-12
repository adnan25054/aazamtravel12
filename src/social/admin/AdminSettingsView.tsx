import React, { useState } from 'react';
import { Settings, Shield, Lock, CheckCircle2, Server, Database } from 'lucide-react';
import { useSocialAuth } from '../context/SocialAuthContext';

export const AdminSettingsView: React.FC = () => {
  const { isSuperAdmin } = useSocialAuth();
  const [maxUploadSizeMb, setMaxUploadSizeMb] = useState(25);
  const [rateLimitPerMinute, setRateLimitPerMinute] = useState(60);
  const [storyExpiryHours, setStoryExpiryHours] = useState(24);
  const [autoFlagSpam, setAutoFlagSpam] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-orange-500" />
          <span>Platform & Moderation Settings</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure global platform limits, media thresholds, rate limiting, and automated spam filtering
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>Platform settings updated and cached successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
            Story Ephemeral Lifespan (Hours):
          </label>
          <input
            type="number"
            value={storyExpiryHours}
            disabled={!isSuperAdmin}
            onChange={(e) => setStoryExpiryHours(Number(e.target.value))}
            min={1}
            max={72}
            className="w-full sm:w-48 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
          />
          <span className="text-[11px] text-slate-400 block mt-1">
            Standard is 24 hours. Stories expire and vanish from user carousels automatically.
          </span>
        </div>

        <div>
          <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
            Max Post Media Upload Size (MB):
          </label>
          <input
            type="number"
            value={maxUploadSizeMb}
            disabled={!isSuperAdmin}
            onChange={(e) => setMaxUploadSizeMb(Number(e.target.value))}
            min={5}
            max={100}
            className="w-full sm:w-48 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
          />
          <span className="text-[11px] text-slate-400 block mt-1">
            Applies to photos, galleries, and short reel MP4 files.
          </span>
        </div>

        <div>
          <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
            API Request Rate Limit per IP (Requests / min):
          </label>
          <input
            type="number"
            value={rateLimitPerMinute}
            disabled={!isSuperAdmin}
            onChange={(e) => setRateLimitPerMinute(Number(e.target.value))}
            min={10}
            max={300}
            className="w-full sm:w-48 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
          />
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoFlagSpam}
              disabled={!isSuperAdmin}
              onChange={(e) => setAutoFlagSpam(e.target.checked)}
              className="text-orange-500 rounded"
            />
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Enable automated heuristics for suspicious repetitive links & spam
            </span>
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <Lock className="w-3.5 h-3.5" />
            <span>{isSuperAdmin ? 'Super-Admin Privileges Active' : 'Read-Only (Requires Super-Admin Role)'}</span>
          </div>

          {isSuperAdmin && (
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20"
            >
              Save Configuration
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
