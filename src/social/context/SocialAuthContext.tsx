import React, { createContext, useContext, useState, useEffect } from 'react';
import { SocialProfile } from '../types';
import { socialApi } from '../lib/supabase';

interface SocialAuthContextType {
  currentUser: SocialProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  loading: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  login: (emailOrUsername: string, pass: string) => Promise<void>;
  signup: (data: { username: string; email: string; displayName: string; password: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<SocialProfile>) => Promise<void>;
  switchAccount: (user: SocialProfile) => void;
}

const SocialAuthContext = createContext<SocialAuthContextType | undefined>(undefined);

export const SocialAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<SocialProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aazam_social_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('aazam_social_theme', next);
      return next;
    });
  };

  useEffect(() => {
    // Initial fetch of current user
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem('aazam_social_current_user');
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        } else {
          // Default to the official account for instant interactive access
          const res = await socialApi.getCurrentUser().catch(() => null);
          if (res && res.user) {
            setCurrentUser(res.user);
            localStorage.setItem('aazam_social_current_user', JSON.stringify(res.user));
          }
        }
      } catch (err) {
        console.warn('Auth init note:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (emailOrUsername: string, pass: string) => {
    setLoading(true);
    try {
      const res = await socialApi.login(emailOrUsername, pass);
      if (res.user) {
        setCurrentUser(res.user);
        localStorage.setItem('aazam_social_current_user', JSON.stringify(res.user));
        if (res.token) {
          localStorage.setItem('aazam_social_token', res.token);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: { username: string; email: string; displayName: string; password: string }) => {
    setLoading(true);
    try {
      const res = await socialApi.signup(data);
      if (res.user) {
        setCurrentUser(res.user);
        localStorage.setItem('aazam_social_current_user', JSON.stringify(res.user));
        if (res.token) {
          localStorage.setItem('aazam_social_token', res.token);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('aazam_social_current_user');
    localStorage.removeItem('aazam_social_token');
  };

  const updateProfile = async (data: Partial<SocialProfile>) => {
    if (!currentUser) return;
    const res = await socialApi.updateProfile(data);
    if (res.user) {
      setCurrentUser(res.user);
      localStorage.setItem('aazam_social_current_user', JSON.stringify(res.user));
    }
  };

  const switchAccount = (user: SocialProfile) => {
    setCurrentUser(user);
    localStorage.setItem('aazam_social_current_user', JSON.stringify(user));
  };

  const isAuthenticated = Boolean(currentUser);
  const isAdmin = Boolean(currentUser && (currentUser.role === 'admin' || currentUser.role === 'super_admin'));
  const isSuperAdmin = Boolean(currentUser && currentUser.role === 'super_admin');

  return (
    <SocialAuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isAdmin,
        isSuperAdmin,
        loading,
        theme,
        toggleTheme,
        login,
        signup,
        logout,
        updateProfile,
        switchAccount,
      }}
    >
      <div className={theme === 'dark' ? 'dark' : ''}>{children}</div>
    </SocialAuthContext.Provider>
  );
};

export const useSocialAuth = () => {
  const context = useContext(SocialAuthContext);
  if (!context) {
    throw new Error('useSocialAuth must be used within a SocialAuthProvider');
  }
  return context;
};
