import React, { useState, useEffect } from 'react';
import { UserCheck, Shield, ShieldCheck, Lock, AlertTriangle } from 'lucide-react';
import { useSocialAuth } from '../context/SocialAuthContext';
import { SocialProfile } from '../types';
import { socialApi } from '../lib/supabase';

export const AdminRolesView: React.FC = () => {
  const { currentUser, isSuperAdmin } = useSocialAuth();
  const [adminUsers, setAdminUsers] = useState<SocialProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await socialApi.getAdminRoles();
      setAdminUsers(res.admins || []);
    } catch (err) {
      console.error('Failed to load admin roles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-orange-500" />
            <span>Administrator & Moderator Team</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Server-enforced Role-Based Access Control (RBAC). Only Super-Admins can grant administrative privileges.
          </p>
        </div>

        <div className="p-2.5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-xs text-orange-800 dark:text-orange-300 font-bold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-orange-500" />
          <span>Super-Admin Protected</span>
        </div>
      </div>

      {/* Admin List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500">Loading admin roles...</div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {adminUsers.map((admin) => (
              <div
                key={admin.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={admin.avatarUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80'}
                    alt={admin.displayName}
                    className="w-11 h-11 rounded-full object-cover border-2 border-orange-500"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{admin.displayName}</span>
                      <span className="text-xs font-normal text-slate-400">@{admin.username}</span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {admin.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${
                    admin.role === 'super_admin'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                      : 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300'
                  }`}>
                    {admin.role.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
