import React from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Users, 
  Flag, 
  History, 
  UserCheck, 
  FileText, 
  Settings, 
  LogOut, 
  ArrowLeft,
  Lock,
  AlertTriangle
} from 'lucide-react';
import { useSocialAuth } from '../context/SocialAuthContext';

interface AdminLayoutProps {
  currentSubRoute: string;
  onNavigateSubRoute: (sub: string) => void;
  onExitAdmin: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentSubRoute,
  onNavigateSubRoute,
  onExitAdmin,
  children,
}) => {
  const { currentUser, isAdmin, isSuperAdmin, logout } = useSocialAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'reports', label: 'Reports', icon: Flag },
    { id: 'moderation', label: 'Moderation History', icon: History },
    { id: 'roles', label: 'Admin Users', icon: UserCheck },
    { id: 'audit-logs', label: 'Audit Logs', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // If not authorized as admin, render strict access denied guard
  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/60 rounded-3xl p-8 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Admin Access Restricted
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            This dashboard requires server-side administrator credentials. You are currently logged in as a standard user or unauthenticated.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <button
              type="button"
              onClick={onExitAdmin}
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold"
            >
              Return to Public Feed
            </button>
            <a
              href="/social/login"
              className="py-2.5 px-4 rounded-xl bg-[#0B2545] hover:bg-[#133E68] text-white text-xs font-bold"
            >
              Sign In with Administrator Account
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col">
      {/* Top Admin Bar */}
      <header className="bg-[#0B2545] text-white px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-white/10 shadow-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExitAdmin}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Return to Social Community"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-500 text-white">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div>
              <div className="text-sm font-black tracking-tight leading-tight flex items-center gap-2">
                <span>Aazam Social</span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-orange-500 px-1.5 py-0.5 rounded text-white">
                  Admin Panel
                </span>
              </div>
              <span className="text-[10px] text-slate-300">
                Server-Authorized Moderation Console
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="hidden sm:flex items-center gap-2">
            <img
              src={currentUser?.avatarUrl}
              alt={currentUser?.displayName}
              className="w-7 h-7 rounded-full object-cover border border-orange-400"
            />
            <div className="text-left">
              <div className="font-bold">{currentUser?.displayName}</div>
              <div className="text-[10px] text-orange-400 font-mono capitalize">
                {currentUser?.role?.replace('_', ' ')}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-red-600/80 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Sub-Navigation Tabs */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-2 overflow-x-auto no-scrollbar shadow-xs">
        <div className="flex items-center gap-2 min-w-max text-xs font-bold">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSubRoute === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigateSubRoute(item.id)}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-[#0B2545] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Admin View Content */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};
