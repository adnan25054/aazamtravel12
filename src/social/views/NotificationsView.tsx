import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Heart, 
  UserPlus, 
  MessageCircle, 
  CheckCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SocialNotification } from '../types';
import { socialApi } from '../lib/supabase';

interface NotificationsViewProps {
  onNavigateProfile: (username: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  onNavigateProfile,
}) => {
  const [notifications, setNotifications] = useState<SocialNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await socialApi.getNotifications();
      setNotifications(res.notifications || []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await socialApi.markNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Error marking notifications as read:', err);
    }
  };

  const getIcon = (type: SocialNotification['type']) => {
    switch (type) {
      case 'follow':
        return <UserPlus className="w-4 h-4 text-orange-500" />;
      case 'like':
        return <Heart className="w-4 h-4 text-red-500 fill-red-500/10" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-sky-500" />;
      default:
        return <Bell className="w-4 h-4 text-orange-400" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-500" />
            <span>Activity Notifications</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Follows, likes, comments, and mentions on your travel posts
          </p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-xs font-bold hover:bg-orange-100 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-16 text-center space-y-2">
          <div className="w-8 h-8 mx-auto border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500">Checking new updates...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-xs text-slate-500 space-y-2">
          <Bell className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
          <p className="font-bold text-slate-700 dark:text-slate-300">You&rsquo;re all caught up!</p>
          <p className="text-slate-400">No new notifications at this time.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => onNavigateProfile(n.actorUsername)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                n.isRead
                  ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
                  : 'bg-orange-50/40 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800/80 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={n.actorAvatarUrl}
                    alt={n.actorDisplayName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-white dark:bg-slate-900 shadow-xs border border-slate-200 dark:border-slate-700">
                    {getIcon(n.type)}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                    <span className="font-bold hover:underline">{n.actorDisplayName}</span>{' '}
                    <span className="text-slate-600 dark:text-slate-300 font-normal">
                      {n.content || (n.type === 'follow' ? 'started following you' : 'interacted with your post')}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(n.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>

              {!n.isRead && (
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
