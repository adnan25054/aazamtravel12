import React from 'react';
import { Home, Compass, Film, MessageSquare, PlusSquare, User } from 'lucide-react';
import { useSocialAuth } from '../context/SocialAuthContext';

interface MobileBottomNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenCreatePost: () => void;
  unreadMessagesCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPath,
  onNavigate,
  onOpenCreatePost,
  unreadMessagesCount = 0,
}) => {
  const { currentUser } = useSocialAuth();

  const isCurrent = (p: string) => {
    if (p === '/social') return currentPath === '/social' || currentPath === '/social/';
    return currentPath.startsWith(p);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-2 z-40 shadow-lg">
      <button
        type="button"
        onClick={() => onNavigate('/social')}
        className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-colors ${
          isCurrent('/social') ? 'text-orange-500 font-bold' : 'text-slate-600 dark:text-slate-400'
        }`}
        title="Home"
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Feed</span>
      </button>

      <button
        type="button"
        onClick={() => onNavigate('/social/explore')}
        className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-colors ${
          isCurrent('/social/explore') ? 'text-orange-500 font-bold' : 'text-slate-600 dark:text-slate-400'
        }`}
        title="Explore"
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Explore</span>
      </button>

      {/* Primary Center Action: Create Post */}
      <button
        type="button"
        onClick={onOpenCreatePost}
        className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0B2545] to-orange-500 text-white shadow-md shadow-orange-500/30 transform active:scale-95 transition-transform"
        title="Create New Post"
      >
        <PlusSquare className="w-6 h-6 text-white" />
      </button>

      <button
        type="button"
        onClick={() => onNavigate('/social/reels')}
        className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-colors ${
          isCurrent('/social/reels') ? 'text-orange-500 font-bold' : 'text-slate-600 dark:text-slate-400'
        }`}
        title="Reels"
      >
        <Film className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Reels</span>
      </button>

      <button
        type="button"
        onClick={() => onNavigate(currentUser ? `/social/profile/${currentUser.username}` : '/social/login')}
        className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-colors ${
          isCurrent('/social/profile') ? 'text-orange-500 font-bold' : 'text-slate-600 dark:text-slate-400'
        }`}
        title="Profile"
      >
        {currentUser?.avatarUrl ? (
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.displayName}
            className={`w-6 h-6 rounded-full object-cover border ${isCurrent('/social/profile') ? 'border-orange-500' : 'border-transparent'}`}
          />
        ) : (
          <User className="w-5 h-5" />
        )}
        <span className="text-[10px] mt-0.5">Profile</span>
      </button>
    </div>
  );
};
