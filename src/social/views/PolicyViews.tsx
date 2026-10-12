import React from 'react';
import { Shield, FileText, ArrowLeft } from 'lucide-react';
import { SocialLogo } from '../components/SocialLogo';

interface PolicyViewProps {
  type: 'privacy' | 'terms';
  onNavigateBack: () => void;
}

export const PolicyViews: React.FC<PolicyViewProps> = ({ type, onNavigateBack }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <button
        type="button"
        onClick={onNavigateBack}
        className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-orange-500 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Aazam Social</span>
      </button>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6 text-slate-800 dark:text-slate-200">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400">
            {type === 'privacy' ? <Shield className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Aazam Social · Connect • Share • Explore · Last updated October 2026
            </p>
          </div>
        </div>

        {type === 'privacy' ? (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Information We Collect</h2>
            <p>
              When you register on Aazam Social (https://aazamtravel.com/social), we collect your unique username, display name, email address, profile avatar, travel bio, and optional location coordinates. When you publish travel posts, reels, or stories, that content and associated media are hosted securely in accordance with your privacy settings.
            </p>

            <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Row Level Security & Access Control</h2>
            <p>
              We enforce PostgreSQL Row Level Security (RLS) across every database table. Your private messages are strictly visible only to conversation participants. Private account posts are restricted exclusively to approved followers.
            </p>

            <h2 className="text-base font-bold text-slate-900 dark:text-white">3. 24-Hour Ephemeral Stories</h2>
            <p>
              Stories uploaded to Aazam Social are programmed to expire 24 hours after publication. After expiration, story media is automatically unlinked from public feeds.
            </p>

            <h2 className="text-base font-bold text-slate-900 dark:text-white">4. Data Export & Account Deletion</h2>
            <p>
              In accordance with international privacy laws, you can export a complete machine-readable JSON archive of your personal data at any time via Account Settings, or delete your account permanently with one click.
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Community Standards & Authentic Travel</h2>
            <p>
              Aazam Social is designed to celebrate authentic journeys, Indian Railways exploration, landscape photography, and cultural travel. You agree not to post fake tickets, fraudulent travel schemes, harassment, hate speech, or non-consensual media.
            </p>

            <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Content Moderation & Suspension</h2>
            <p>
              Content reported by community members is reviewed by our authorized moderation team. Violations will result in content removal, warnings, or immediate account suspension. All moderation actions are logged in immutable audit records.
            </p>

            <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Intellectual Property</h2>
            <p>
              You retain ownership of your original travel photography and videos. By posting to Aazam Social, you grant the platform a non-exclusive license to display the media to users based on your visibility settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
