import React, { useState } from 'react';
import { X, Flag, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ReportReason } from '../types';
import { socialApi } from '../lib/supabase';

interface ReportModalProps {
  targetType: 'post' | 'comment' | 'profile';
  targetId: string;
  authorUsername: string;
  previewText?: string;
  onClose: () => void;
  onReportSubmitted?: () => void;
}

const REPORT_REASONS: { value: ReportReason; label: string; desc: string }[] = [
  { value: 'spam', label: 'Spam or Advertising', desc: 'Repetitive messages, deceptive links, or unwanted commercial solicitations' },
  { value: 'harassment', label: 'Harassment or Bullying', desc: 'Targeted attacks, threats, insults, or intimidation' },
  { value: 'hate_speech', label: 'Hate Speech', desc: 'Attacks on religion, community, nationality, or identity' },
  { value: 'inappropriate_content', label: 'Inappropriate or Adult Media', desc: 'Nudity, sexual activity, or sensitive explicit imagery' },
  { value: 'misinformation', label: 'False or Misleading Info', desc: 'Deceptive travel fraud, fake railway alerts, or hoaxes' },
  { value: 'copyright', label: 'Copyright or IP Infringement', desc: 'Unlicensed photography or media posted without creator consent' },
  { value: 'other', label: 'Other Violation', desc: 'Violates general Aazam Social community standards' },
];

export const ReportModal: React.FC<ReportModalProps> = ({
  targetType,
  targetId,
  authorUsername,
  previewText,
  onClose,
  onReportSubmitted,
}) => {
  const [selectedReason, setSelectedReason] = useState<ReportReason>('spam');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await socialApi.submitReport({
        targetType,
        targetId,
        reason: selectedReason,
        description: description.trim() || undefined,
      });

      setIsSubmitted(true);
      if (onReportSubmitted) onReportSubmitted();
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Flag className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Report {targetType === 'profile' ? 'User' : targetType === 'comment' ? 'Comment' : 'Post'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Report Submitted for Moderation
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              Our moderation team will review this content against platform safety rules. Thank you for keeping Aazam Social safe.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Context Box */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-xs">
              <div className="font-bold text-slate-700 dark:text-slate-300">
                Author: @{authorUsername}
              </div>
              {previewText && (
                <div className="text-slate-500 dark:text-slate-400 italic line-clamp-2 mt-1">
                  &ldquo;{previewText}&rdquo;
                </div>
              )}
            </div>

            {error && (
              <div className="p-2.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs rounded-xl border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            {/* Reasons List */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {REPORT_REASONS.map((r) => (
                <label
                  key={r.value}
                  className={`flex items-start gap-3 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                    selectedReason === r.value
                      ? 'border-orange-500 bg-orange-50/40 dark:bg-orange-950/30'
                      : 'border-slate-200 dark:border-slate-700/70 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={r.value}
                    checked={selectedReason === r.value}
                    onChange={() => setSelectedReason(r.value)}
                    className="mt-0.5 text-orange-500 focus:ring-orange-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {r.label}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      {r.desc}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Additional details */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Additional Details (Optional):
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Help our moderators understand why this content violates rules..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/20 disabled:opacity-50 transition-all"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
