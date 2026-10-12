import React, { useState, useEffect } from 'react';
import { 
  Flag, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  AlertTriangle, 
  Filter,
  Eye,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { SocialReport } from '../types';
import { socialApi } from '../lib/supabase';

export const AdminReportsView: React.FC = () => {
  const [reports, setReports] = useState<SocialReport[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('pending');
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<SocialReport | null>(null);
  const [moderationNote, setModerationNote] = useState('');
  const [actionInProgress, setActionInProgress] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await socialApi.getAdminReports(statusFilter === 'all' ? undefined : statusFilter);
      setReports(res.reports || []);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const handleAction = async (action: 'removed_content' | 'suspended_user' | 'dismissed') => {
    if (!selectedReport) return;
    setActionInProgress(true);
    try {
      await socialApi.resolveReport(
        selectedReport.id,
        action,
        moderationNote || `Moderation action taken: ${action}`
      );
      setSelectedReport(null);
      setModerationNote('');
      fetchReports();
    } catch (err) {
      alert('Failed to resolve report: ' + err);
    } finally {
      setActionInProgress(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Flag className="w-5 h-5 text-red-500" />
            <span>Content Moderation Queue</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review community flags, evaluate potential violations, and enforce published platform rules
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 text-xs font-bold bg-slate-50 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
          {(['pending', 'resolved', 'dismissed', 'all'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                statusFilter === s
                  ? 'bg-[#0B2545] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500">Loading reports queue...</div>
        ) : reports.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              No reports in this category
            </h4>
            <p className="text-xs text-slate-500">
              Community submissions in &ldquo;{statusFilter}&rdquo; are all clear.
            </p>
          </div>
        ) : (
          reports.map((rep) => {
            const isPending = rep.status === 'pending';
            return (
              <div
                key={rep.id}
                className={`bg-white dark:bg-slate-900 border rounded-3xl p-5 shadow-xs transition-all space-y-3 ${
                  isPending
                    ? 'border-red-200 dark:border-red-900/60'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
                      Reason: {rep.reason.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Target: {rep.targetType.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>Reported by @{rep.reporterUsername}</span>
                    <span>·</span>
                    <span>{new Date(rep.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Target context */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white">
                    Reported Author: @{rep.targetAuthorUsername}
                  </div>
                  {rep.targetPreview && (
                    <div className="text-slate-600 dark:text-slate-300 italic">
                      &ldquo;{rep.targetPreview}&rdquo;
                    </div>
                  )}
                  {rep.description && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                      Reporter note: {rep.description}
                    </div>
                  )}
                </div>

                {/* Status & Resolution Info */}
                {!isPending && (
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white capitalize">
                      Outcome: {rep.actionTaken?.replace('_', ' ')} ({rep.status})
                    </div>
                    {rep.moderationNotes && (
                      <p className="text-slate-500 dark:text-slate-400">
                        Admin Note: {rep.moderationNotes}
                      </p>
                    )}
                  </div>
                )}

                {/* Action buttons if pending */}
                {isPending && (
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedReport(rep)}
                      className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition-colors"
                    >
                      Take Moderation Action
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Moderation Action Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-orange-500" />
              <span>Action Report #{selectedReport.id.slice(0, 8)}</span>
            </h3>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs">
              <div><strong>Target:</strong> {selectedReport.targetType} by @{selectedReport.targetAuthorUsername}</div>
              <div><strong>Violation Claimed:</strong> {selectedReport.reason}</div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Moderator Decision Notes:
              </label>
              <textarea
                rows={3}
                value={moderationNote}
                onChange={(e) => setModerationNote(e.target.value)}
                placeholder="Enter justification for moderation decision (will be logged in audit trail)..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleAction('dismissed')}
                disabled={actionInProgress}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                Dismiss Report
              </button>

              <button
                type="button"
                onClick={() => handleAction('removed_content')}
                disabled={actionInProgress}
                className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold"
              >
                Remove Content
              </button>

              <button
                type="button"
                onClick={() => handleAction('suspended_user')}
                disabled={actionInProgress}
                className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Suspend Author
              </button>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
