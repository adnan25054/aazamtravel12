export type UserRole = 'user' | 'moderator' | 'admin' | 'super_admin';
export type AccountStatus = 'active' | 'suspended' | 'banned' | 'pending_verification';

export interface SocialProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  coverUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  isVerified: boolean;
  isPrivate: boolean;
  status: AccountStatus;
  role: UserRole;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface PostMediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
}

export interface SocialComment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  userDisplayName: string;
  userAvatarUrl: string;
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
  parentId?: string; // For replies
  replies?: SocialComment[];
}

export interface SocialPost {
  id: string;
  userId: string;
  username: string;
  userDisplayName: string;
  userAvatarUrl: string;
  isVerified?: boolean;
  content: string;
  media: PostMediaItem[];
  location?: string;
  hashtags: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
  visibility: 'public' | 'followers_only';
}

export interface SocialStory {
  id: string;
  userId: string;
  username: string;
  userDisplayName: string;
  userAvatarUrl: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string;
  createdAt: string;
  expiresAt: string;
  viewsCount: number;
  hasViewed?: boolean;
}

export interface SocialReel {
  id: string;
  userId: string;
  username: string;
  userDisplayName: string;
  userAvatarUrl: string;
  videoUrl: string;
  caption: string;
  audioTrack?: string;
  hashtags: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  createdAt: string;
}

export interface ConversationParticipant {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  isOnline?: boolean;
  lastSeen?: string;
}

export interface DirectMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  mediaUrl?: string;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participants: ConversationParticipant[];
  lastMessage?: {
    content: string;
    senderId: string;
    createdAt: string;
  };
  unreadCount: number;
  updatedAt: string;
}

export interface SocialNotification {
  id: string;
  userId: string;
  actorId: string;
  actorUsername: string;
  actorDisplayName: string;
  actorAvatarUrl: string;
  type: 'follow' | 'like' | 'comment' | 'mention' | 'message';
  content?: string;
  targetId?: string; // postId or commentId
  targetUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export type ReportReason = 
  | 'spam' 
  | 'harassment' 
  | 'hate_speech' 
  | 'inappropriate_content' 
  | 'violence' 
  | 'misinformation' 
  | 'copyright' 
  | 'other';

export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

export interface SocialReport {
  id: string;
  reporterId: string;
  reporterUsername: string;
  targetType: 'post' | 'comment' | 'profile';
  targetId: string;
  targetAuthorId: string;
  targetAuthorUsername: string;
  targetPreview?: string;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  moderationNotes?: string;
  actionTaken?: 'none' | 'removed_content' | 'suspended_user' | 'warning_issued';
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface ModerationAction {
  id: string;
  adminId: string;
  adminUsername: string;
  action: 'suspend_user' | 'restore_user' | 'delete_post' | 'dismiss_report' | 'update_role';
  targetType: 'user' | 'post' | 'comment' | 'report';
  targetId: string;
  targetSummary: string;
  reason: string;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  adminId: string;
  adminUsername: string;
  action: string;
  resource: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  totalPosts: number;
  totalComments: number;
  totalStories: number;
  pendingReports: number;
  resolvedReports: number;
  totalReels: number;
}
