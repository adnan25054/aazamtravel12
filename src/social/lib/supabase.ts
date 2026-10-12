import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read environment variables (Vite client convention)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co'
);

let client: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
  }
}

export const supabase = client;

/**
 * Universal Social API client that queries either Supabase or the Express fallback API
 */
export const socialApi = {
  // Helper for REST calls to server
  async fetch(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('aazam_social_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> || {}),
    };

    const res = await fetch(`/api/social${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(errData.error || `Error ${res.status}: ${res.statusText}`);
    }

    return res.json();
  },

  // Auth methods
  async getCurrentUser() {
    return this.fetch('/auth/me');
  },

  async login(emailOrUsername: string, password: string) {
    return this.fetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ emailOrUsername, password }),
    });
  },

  async signup(data: { username: string; email: string; displayName: string; password: string }) {
    return this.fetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProfile(profileData: Record<string, any>) {
    return this.fetch('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Posts & Feed
  async getFeed(filter: 'for_you' | 'following' | 'latest' = 'for_you') {
    return this.fetch(`/posts?filter=${filter}`);
  },

  async createPost(data: { content: string; media?: any[]; location?: string; hashtags?: string[] }) {
    return this.fetch('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async toggleLike(postId: string) {
    return this.fetch(`/posts/${postId}/like`, { method: 'POST' });
  },

  async toggleSave(postId: string) {
    return this.fetch(`/posts/${postId}/save`, { method: 'POST' });
  },

  async deletePost(postId: string) {
    return this.fetch(`/posts/${postId}`, { method: 'DELETE' });
  },

  // Comments
  async getComments(postId: string) {
    return this.fetch(`/posts/${postId}/comments`);
  },

  async addComment(postId: string, content: string, parentId?: string) {
    return this.fetch(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, parentId }),
    });
  },

  // Stories
  async getStories() {
    return this.fetch('/stories');
  },

  async createStory(mediaUrl: string, caption?: string, mediaType: 'image' | 'video' = 'image') {
    return this.fetch('/stories', {
      method: 'POST',
      body: JSON.stringify({ mediaUrl, caption, mediaType }),
    });
  },

  // Reels
  async getReels() {
    return this.fetch('/reels');
  },

  async toggleReelLike(reelId: string) {
    return this.fetch(`/reels/${reelId}/like`, { method: 'POST' });
  },

  // Profiles & Follows
  async getProfile(username: string) {
    return this.fetch(`/profile/${username}`);
  },

  async toggleFollow(targetUserId: string) {
    return this.fetch(`/users/${targetUserId}/follow`, { method: 'POST' });
  },

  // Explore & Search
  async search(query: string) {
    return this.fetch(`/search?q=${encodeURIComponent(query)}`);
  },

  async getExplore() {
    return this.fetch('/explore');
  },

  // Messages
  async getConversations() {
    return this.fetch('/messages/conversations');
  },

  async getMessages(conversationId: string) {
    return this.fetch(`/messages/${conversationId}`);
  },

  async sendMessage(conversationId: string, content: string) {
    return this.fetch(`/messages/${conversationId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  async startConversation(targetUserId: string, initialMessage?: string) {
    return this.fetch('/messages/start', {
      method: 'POST',
      body: JSON.stringify({ targetUserId, initialMessage }),
    });
  },

  // Notifications
  async getNotifications() {
    return this.fetch('/notifications');
  },

  async markNotificationsRead() {
    return this.fetch('/notifications/read-all', { method: 'POST' });
  },

  // Reports
  async submitReport(data: {
    targetType: 'post' | 'comment' | 'profile';
    targetId: string;
    reason: string;
    description?: string;
  }) {
    return this.fetch('/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Admin APIs
  async getAdminStats() {
    return this.fetch('/admin/stats');
  },

  async getAdminUsers(query?: string) {
    return this.fetch(`/admin/users${query ? `?q=${encodeURIComponent(query)}` : ''}`);
  },

  async setAccountStatus(userId: string, status: 'active' | 'suspended' | 'banned', reason: string) {
    return this.fetch(`/admin/users/${userId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status, reason }),
    });
  },

  async getAdminReports(statusFilter?: string) {
    return this.fetch(`/admin/reports${statusFilter ? `?status=${statusFilter}` : ''}`);
  },

  async resolveReport(reportId: string, actionTaken: string, moderationNotes: string) {
    return this.fetch(`/admin/reports/${reportId}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ actionTaken, moderationNotes }),
    });
  },

  async getModerationActions() {
    return this.fetch('/admin/moderation-actions');
  },

  async getAuditLogs() {
    return this.fetch('/admin/audit-logs');
  },

  async getAdminRoles() {
    return this.fetch('/admin/roles');
  },

  async updateAdminRole(userId: string, role: string) {
    return this.fetch(`/admin/roles/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },
};
