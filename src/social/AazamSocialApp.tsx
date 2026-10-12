import React, { useState, useEffect } from 'react';
import { SocialAuthProvider, useSocialAuth } from './context/SocialAuthContext';
import { NavigationSidebar } from './components/NavigationSidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HeaderBar } from './components/HeaderBar';
import { CreatePostModal } from './components/CreatePostModal';
import { ReportModal } from './components/ReportModal';
import { HomeFeedView } from './views/HomeFeedView';
import { ExploreView } from './views/ExploreView';
import { ReelsView } from './views/ReelsView';
import { MessagesView } from './views/MessagesView';
import { NotificationsView } from './views/NotificationsView';
import { ProfileView } from './views/ProfileView';
import { SettingsView } from './views/SettingsView';
import { AuthViews } from './views/AuthViews';
import { PolicyViews } from './views/PolicyViews';
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboardView } from './admin/AdminDashboardView';
import { AdminUsersView } from './admin/AdminUsersView';
import { AdminReportsView } from './admin/AdminReportsView';
import { AdminModerationHistoryView } from './admin/AdminModerationHistoryView';
import { AdminRolesView } from './admin/AdminRolesView';
import { AdminAuditLogsView } from './admin/AdminAuditLogsView';
import { AdminSettingsView } from './admin/AdminSettingsView';
import { SocialPost } from './types';

export const AazamSocialInner: React.FC = () => {
  const { currentUser, isAuthenticated } = useSocialAuth();
  
  // URL routing state
  const getInitialPath = () => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
      if (p.startsWith('/social')) return window.location.pathname;
    }
    return '/social';
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [reportConfig, setReportConfig] = useState<{
    targetType: 'post' | 'comment' | 'profile';
    targetId: string;
    authorId: string;
    authorUsername: string;
    previewText?: string;
  } | null>(null);

  // Sync route with window popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    setCurrentPath(path);
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Extract route parameters
  const isProfileRoute = currentPath.startsWith('/social/profile/');
  const profileUsername = isProfileRoute ? currentPath.replace('/social/profile/', '').split('/')[0] : '';
  const isAdminRoute = currentPath.startsWith('/social/admin');

  // Sub-routes for Admin: /social/admin/users, /social/admin/reports, etc.
  let adminSubRoute = 'dashboard';
  if (currentPath === '/social/admin/users') adminSubRoute = 'users';
  else if (currentPath === '/social/admin/reports') adminSubRoute = 'reports';
  else if (currentPath === '/social/admin/moderation') adminSubRoute = 'moderation';
  else if (currentPath === '/social/admin/roles' || currentPath === '/social/admin/admin-users') adminSubRoute = 'roles';
  else if (currentPath === '/social/admin/audit-logs') adminSubRoute = 'audit-logs';
  else if (currentPath === '/social/admin/settings') adminSubRoute = 'settings';

  const handleAdminSubNavigate = (sub: string) => {
    if (sub === 'dashboard') navigate('/social/admin');
    else navigate(`/social/admin/${sub}`);
  };

  // Render Admin View if under /social/admin
  if (isAdminRoute) {
    return (
      <AdminLayout
        currentSubRoute={adminSubRoute}
        onNavigateSubRoute={handleAdminSubNavigate}
        onExitAdmin={() => navigate('/social')}
      >
        {adminSubRoute === 'dashboard' && <AdminDashboardView onNavigateTab={handleAdminSubNavigate} />}
        {adminSubRoute === 'users' && <AdminUsersView />}
        {adminSubRoute === 'reports' && <AdminReportsView />}
        {adminSubRoute === 'moderation' && <AdminModerationHistoryView />}
        {adminSubRoute === 'roles' && <AdminRolesView />}
        {adminSubRoute === 'audit-logs' && <AdminAuditLogsView />}
        {adminSubRoute === 'settings' && <AdminSettingsView />}
      </AdminLayout>
    );
  }

  // Render Auth views: /social/login or /social/signup
  if (currentPath === '/social/login' || currentPath === '/social/signup') {
    return (
      <AuthViews
        initialMode={currentPath === '/social/signup' ? 'signup' : 'login'}
        onSuccess={() => navigate('/social')}
        onNavigateHome={() => navigate('/social')}
      />
    );
  }

  // Render Policy views: /social/privacy or /social/terms
  if (currentPath === '/social/privacy' || currentPath === '/social/terms') {
    return (
      <PolicyViews
        type={currentPath === '/social/privacy' ? 'privacy' : 'terms'}
        onNavigateBack={() => navigate('/social')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex">
      {/* 1. Desktop Sidebar */}
      <div className="hidden md:block shrink-0">
        <NavigationSidebar
          currentPath={currentPath}
          onNavigate={navigate}
          onOpenCreatePost={() => setShowCreatePost(true)}
          unreadNotificationsCount={1}
          unreadMessagesCount={1}
        />
      </div>

      {/* 2. Main Content View Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Mobile Header Bar */}
        <HeaderBar
          onNavigate={navigate}
          unreadNotificationsCount={1}
          unreadMessagesCount={1}
        />

        <main className="flex-1 w-full">
          {/* Main Feed: /social or /social/ */}
          {(currentPath === '/social' || currentPath === '/social/') && (
            <HomeFeedView
              onOpenCreatePost={() => setShowCreatePost(true)}
              onOpenReport={(targetType, targetId, authorId, authorUsername, previewText) => {
                setReportConfig({ targetType, targetId, authorId, authorUsername, previewText });
              }}
              onNavigateProfile={(u) => navigate(`/social/profile/${u}`)}
              onNavigateExplore={() => navigate('/social/explore')}
            />
          )}

          {/* Explore: /social/explore */}
          {currentPath.startsWith('/social/explore') && (
            <ExploreView
              onNavigateProfile={(u) => navigate(`/social/profile/${u}`)}
              onSelectPost={(post: SocialPost) => {
                // If clicked, jump to user profile or open
                navigate(`/social/profile/${post.username}`);
              }}
            />
          )}

          {/* Reels: /social/reels */}
          {currentPath.startsWith('/social/reels') && (
            <ReelsView
              onNavigateProfile={(u) => navigate(`/social/profile/${u}`)}
            />
          )}

          {/* Messages: /social/messages */}
          {currentPath.startsWith('/social/messages') && (
            <MessagesView />
          )}

          {/* Notifications: /social/notifications */}
          {currentPath.startsWith('/social/notifications') && (
            <NotificationsView
              onNavigateProfile={(u) => navigate(`/social/profile/${u}`)}
            />
          )}

          {/* Profile: /social/profile/:username */}
          {isProfileRoute && (
            <ProfileView
              username={profileUsername}
              onOpenReport={(targetType, targetId, authorId, authorUsername, previewText) => {
                setReportConfig({ targetType, targetId, authorId, authorUsername, previewText });
              }}
              onStartChat={() => navigate('/social/messages')}
            />
          )}

          {/* Settings: /social/settings */}
          {currentPath.startsWith('/social/settings') && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* 3. Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenCreatePost={() => setShowCreatePost(true)}
        unreadMessagesCount={1}
      />

      {/* Global Modals */}
      {showCreatePost && (
        <CreatePostModal
          onClose={() => setShowCreatePost(false)}
          onPostCreated={() => {
            setShowCreatePost(false);
            window.location.reload();
          }}
        />
      )}

      {reportConfig && (
        <ReportModal
          targetType={reportConfig.targetType}
          targetId={reportConfig.targetId}
          authorUsername={reportConfig.authorUsername}
          previewText={reportConfig.previewText}
          onClose={() => setReportConfig(null)}
        />
      )}
    </div>
  );
};

export const AazamSocialApp: React.FC = () => {
  return (
    <SocialAuthProvider>
      <AazamSocialInner />
    </SocialAuthProvider>
  );
};
