import React, { useState, useEffect } from 'react';
import { FileText, Shield, Terminal, Clock } from 'lucide-react';
import { AuditLogItem } from '../types';
import { socialApi } from '../lib/supabase';

export const AdminAuditLogsView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await socialApi.getAuditLogs();
        setLogs(res.logs || []);
      } catch (err) {
        console.error('Failed to load audit logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-orange-500" />
          <span>Security & Administration Audit Trail</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Immutable server event records logging administrator logins, suspensions, role modifications, and content removals
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500">Querying security audit logs...</div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            No audit events recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-bold">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Admin Account</th>
                  <th className="p-4">Action Event</th>
                  <th className="p-4">Target Resource</th>
                  <th className="p-4">Event Details</th>
                  <th className="p-4 font-mono">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white font-mono">
                      @{log.adminUsername}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-orange-600 dark:text-orange-400">
                      {log.resource}
                    </td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">
                      {log.details}
                    </td>
                    <td className="p-4 font-mono text-[11px] text-slate-400">
                      {log.ipAddress || '127.0.0.1'}
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
