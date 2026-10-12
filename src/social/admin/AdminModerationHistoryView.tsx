import React, { useState, useEffect } from 'react';
import { History, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { ModerationAction } from '../types';
import { socialApi } from '../lib/supabase';

export const AdminModerationHistoryView: React.FC = () => {
  const [actions, setActions] = useState<ModerationAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await socialApi.getModerationActions();
        setActions(res.actions || []);
      } catch (err) {
        console.error('Failed to load moderation history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <History className="w-5 h-5 text-orange-500" />
          <span>Moderation History & Enforcements</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Complete historical record of content deletions, user suspensions, and report outcomes
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500">Loading history...</div>
        ) : actions.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            No moderation actions recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-bold">
                  <th className="p-4">Action</th>
                  <th className="p-4">Target Type & Summary</th>
                  <th className="p-4">Reason / Justification</th>
                  <th className="p-4">Moderator</th>
                  <th className="p-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {actions.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-4 font-bold">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400">
                        {act.action.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-slate-800 dark:text-slate-200">
                      <div className="font-bold">{act.targetType}</div>
                      <div className="text-slate-500 text-[11px]">{act.targetSummary}</div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300 italic">
                      &ldquo;{act.reason}&rdquo;
                    </td>
                    <td className="p-4 font-mono text-slate-700 dark:text-slate-300">
                      @{act.adminUsername}
                    </td>
                    <td className="p-4 text-slate-400">
                      {new Date(act.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
