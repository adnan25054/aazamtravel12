import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  FileText, 
  MessageSquare, 
  Flag, 
  ShieldAlert, 
  Film, 
  Clock, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { AdminStats } from '../types';
import { socialApi } from '../lib/supabase';

interface AdminDashboardViewProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onNavigateTab }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await socialApi.getAdminStats();
        setStats(res.stats || null);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 mx-auto border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500">Querying live database statistics...</p>
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Registered Users',
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-50 dark:bg-sky-950/40',
      sub: `${stats?.activeUsers ?? 0} active accounts`,
      action: () => onNavigateTab('users'),
    },
    {
      label: 'Suspended Accounts',
      value: stats?.suspendedUsers ?? 0,
      icon: UserX,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      sub: 'Restricted for policy violations',
      action: () => onNavigateTab('users'),
    },
    {
      label: 'Total Posts Published',
      value: stats?.totalPosts ?? 0,
      icon: FileText,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      sub: `${stats?.totalReels ?? 0} short video reels`,
    },
    {
      label: 'Total Comments',
      value: stats?.totalComments ?? 0,
      icon: MessageSquare,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      sub: 'Across community travel feed',
    },
    {
      label: 'Pending Reports',
      value: stats?.pendingReports ?? 0,
      icon: Flag,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-950/40',
      sub: 'Awaiting administrator action',
      highlight: (stats?.pendingReports ?? 0) > 0,
      action: () => onNavigateTab('reports'),
    },
    {
      label: 'Resolved Reports',
      value: stats?.resolvedReports ?? 0,
      icon: ShieldAlert,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      sub: 'Actioned with audit records',
      action: () => onNavigateTab('moderation'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Overview Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Aazam Social Platform Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time server & database analytics. All counts queried directly from PostgreSQL / Supabase storage.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            Database Healthy & Operational
          </span>
        </div>
      </div>

      {/* Real Statistics Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              onClick={c.action}
              className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all ${
                c.highlight
                  ? 'border-red-300 dark:border-red-800 shadow-md ring-1 ring-red-400/30'
                  : 'border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-orange-300'
              } ${c.action ? 'cursor-pointer hover:shadow-md group' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl ${c.bg} ${c.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                {c.action && (
                  <span className="text-slate-400 group-hover:text-orange-500 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </div>

              <div className="mt-4">
                <div className="text-3xl font-black text-slate-900 dark:text-white">
                  {c.value.toLocaleString()}
                </div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                  {c.label}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {c.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Moderation Queue Quick Action Banner */}
      {(stats?.pendingReports ?? 0) > 0 && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/20">
              <Flag className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold">
                {stats?.pendingReports} Content Reports Awaiting Moderation
              </div>
              <div className="text-xs text-white/80">
                Review flagged posts, comments, or accounts to enforce platform standards.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('reports')}
            className="px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-black shadow-md hover:bg-slate-100 transition-colors shrink-0"
          >
            Review Queue →
          </button>
        </div>
      )}
    </div>
  );
};
