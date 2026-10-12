import React from 'react';
import { 
  Home, 
  Compass, 
  Film, 
  MessageSquare, 
  Bell, 
  User, 
  Settings, 
  ShieldCheck, 
  PlusSquare, 
  Sun, 
  Moon, 
  LogOut,
  ArrowLeft,
  Bookmark
} from 'lucide-react';
import { SocialLogo } from './SocialLogo';
import { useSocialAuth } from '../context/SocialAuthContext';

interface NavigationSidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenCreatePost: () => void;
  unreadNotificationsCount?: number;
  unreadMessagesCount?: number;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  currentPath,
  onNavigate,
  onOpenCreatePost,
  unreadNotificationsCount = 0,
  unreadMessagesCount = 0,
}) => {
  const { currentUser, isAdmin, theme, toggleTheme, logout } = useSocialAuth();

  const navItems = [
    { label: 'Home Feed', path: '/social', icon: Home },
    { label: 'Explore', path: '/social/explore', icon: Compass },
    { label: 'Reels', path: '/social/reels', icon: Film },
    { 
      label: 'Messages', 
      path: '/social/messages', 
      icon: MessageSquare, 
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined 
    },
    { 
      label: 'Notifications', 
      path: '/social/notifications', 
      icon: Bell, 
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined 
    },
    { 
      label: 'My Profile', 
      path: currentUser ? `/social/profile/${currentUser.username}` : '/social/login', 
      icon: User 
    },
    { label: 'Settings', path: '/social/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 xl:w-72 h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-4 xl:p-6 select-none z-20">
      <div className="space-y-6">
        {/* Brand Header */}
        <div 
          onClick={() => onNavigate('/social')}
          className="cursor-pointer px-2 py-1 flex items-center justify-between"
        >
          <SocialLogo size="md" showTagline={true} />
        </div>

        {/* Back to Travel Agency Link */}
        <a
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-800/60 rounded-xl transition-colors border border-slate-200/60 dark:border-slate-700/60"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-orange-500" />
          <span>Aazam Travel Agency (Home)</span>
        </a>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = 
              item.path === '/social' 
                ? currentPath === '/social' || currentPath === '/social/' 
                : currentPath.startsWith(item.path);

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onNavigate(item.path)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all group ${
                  isActive
                    ? 'bg-[#0B2545] text-white shadow-md shadow-blue-950/20'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-orange-400' : 'text-slate-500 group-hover:text-orange-500'} transition-colors`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-orange-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Admin Panel button if user has role */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => onNavigate('/social/admin')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all ${
                currentPath.startsWith('/social/admin')
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5" />
                <span>Admin Panel</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-orange-200 dark:bg-orange-900/60 text-orange-800 dark:text-orange-300 px-1.5 py-0.5 rounded">
                Admin
              </span>
            </button>
          )}
        </nav>

        {/* Create Post Action Button */}
        <button
          type="button"
          onClick={onOpenCreatePost}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
        >
          <PlusSquare className="w-5 h-5" />
          <span>Create Post</span>
        </button>
      </div>

      {/* Footer controls: Dark mode & User profile quick bar */}
      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        {/* Dark/Light mode toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-sky-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </span>
          <span className="text-[11px] text-slate-400 font-mono">Toggle</span>
        </button>

        {/* Current User Card or Login Button */}
        {currentUser ? (
          <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80">
            <div 
              onClick={() => onNavigate(`/social/profile/${currentUser.username}`)}
              className="flex items-center gap-2.5 cursor-pointer overflow-hidden flex-1"
            >
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser.displayName}
                className="w-9 h-9 rounded-full object-cover border border-orange-500/30"
              />
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {currentUser.displayName}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  @{currentUser.username}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              title="Log Out"
              className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onNavigate('/social/login')}
            className="w-full py-2.5 rounded-xl bg-[#0B2545] hover:bg-[#133E68] text-white text-xs font-bold transition-colors"
          >
            Sign In / Register
          </button>
        )}
      </div>
    </aside>
  );
};
