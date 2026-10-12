import React from 'react';
import { Bell, MessageSquare, Sun, Moon, ShieldCheck, Search } from 'lucide-react';
import { SocialLogo } from './SocialLogo';
import { useSocialAuth } from '../context/SocialAuthContext';

interface HeaderBarProps {
  onNavigate: (path: string) => void;
  unreadNotificationsCount?: number;
  unreadMessagesCount?: number;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  onNavigate,
  unreadNotificationsCount = 0,
  unreadMessagesCount = 0,
}) => {
  const { currentUser, isAdmin, theme, toggleTheme } = useSocialAuth();

  return (
    <header className="md:hidden sticky top-0 left-0 right-0 h-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 z-30">
      <div onClick={() => onNavigate('/social')} className="cursor-pointer">
        <SocialLogo size="sm" showTagline={false} />
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onNavigate('/social/explore')}
          className="p-2 text-slate-600 dark:text-slate-300 hover:text-orange-500 rounded-xl"
          title="Search / Explore"
        >
          <Search className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('/social/messages')}
          className="p-2 text-slate-600 dark:text-slate-300 hover:text-orange-500 rounded-xl relative"
          title="Messages"
        >
          <MessageSquare className="w-5 h-5" />
          {unreadMessagesCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onNavigate('/social/notifications')}
          className="p-2 text-slate-600 dark:text-slate-300 hover:text-orange-500 rounded-xl relative"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500" />
          )}
        </button>

        {isAdmin && (
          <button
            type="button"
            onClick={() => onNavigate('/social/admin')}
            className="p-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/40 rounded-xl"
            title="Admin Panel"
          >
            <ShieldCheck className="w-5 h-5" />
          </button>
        )}

        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 text-slate-500 dark:text-slate-400 rounded-xl"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Moon className="w-4 h-4 text-sky-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
        </button>
      </div>
    </header>
  );
};
