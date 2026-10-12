import { Express, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(process.cwd(), 'data');
const SOCIAL_DB_FILE = path.join(DATA_DIR, 'aazam_social.json');

interface SocialDbSchema {
  profiles: any[];
  posts: any[];
  comments: any[];
  stories: any[];
  reels: any[];
  conversations: any[];
  messages: any[];
  notifications: any[];
  reports: any[];
  moderationActions: any[];
  auditLogs: any[];
  follows: { followerId: string; followingId: string; createdAt: string }[];
  savedPosts: { userId: string; postId: string; createdAt: string }[];
}

function loadSocialDb(): SocialDbSchema {
  try {
    if (!fs.existsSync(SOCIAL_DB_FILE)) {
      return {
        profiles: [],
        posts: [],
        comments: [],
        stories: [],
        reels: [],
        conversations: [],
        messages: [],
        notifications: [],
        reports: [],
        moderationActions: [],
        auditLogs: [],
        follows: [],
        savedPosts: [],
      };
    }
    const raw = fs.readFileSync(SOCIAL_DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading social DB:', err);
    return {
      profiles: [],
      posts: [],
      comments: [],
      stories: [],
      reels: [],
      conversations: [],
      messages: [],
      notifications: [],
      reports: [],
      moderationActions: [],
      auditLogs: [],
      follows: [],
      savedPosts: [],
    };
  }
}

function saveSocialDb(db: SocialDbSchema) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(SOCIAL_DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving social DB:', err);
  }
}

export function setupSocialRoutes(app: Express) {
  // 1. Auth: Get current user (defaults to official or bearer token)
  app.get('/api/social/auth/me', (req: Request, res: Response) => {
    const db = loadSocialDb();
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const username = authHeader.replace('Bearer ', '').trim();
      const user = db.profiles.find((p) => p.username === username || p.id === username);
      if (user) {
        return res.json({ user });
      }
    }
    // Default to the official account
    const defaultUser = db.profiles[0] || null;
    res.json({ user: defaultUser });
  });

  // Auth: Login
  app.post('/api/social/auth/login', (req: Request, res: Response) => {
    const { emailOrUsername, password } = req.body;
    const db = loadSocialDb();
    const query = String(emailOrUsername || '').toLowerCase();
    const user = db.profiles.find(
      (p) => p.username.toLowerCase() === query || p.email.toLowerCase() === query
    );

    if (!user) {
      return res.status(401).json({ error: 'User account not found.' });
    }

    if (user.status === 'suspended' || user.status === 'banned') {
      return res.status(403).json({ error: 'This account has been suspended by administration.' });
    }

    // Add login audit log
    db.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      adminId: user.id,
      adminUsername: user.username,
      action: user.role.includes('admin') ? 'ADMIN_LOGIN' : 'USER_LOGIN',
      resource: '/social/login',
      details: `User @${user.username} successfully authenticated`,
      ipAddress: req.ip || '127.0.0.1',
      timestamp: new Date().toISOString(),
    });
    saveSocialDb(db);

    res.json({
      success: true,
      user,
      token: user.id,
    });
  });

  // Auth: Signup
  app.post('/api/social/auth/signup', (req: Request, res: Response) => {
    const { username, email, displayName, password } = req.body;
    if (!username || !email || !displayName) {
      return res.status(400).json({ error: 'Missing required signup fields.' });
    }

    const db = loadSocialDb();
    const cleanUsername = String(username).toLowerCase().replace(/[^a-z0-9_]/g, '');

    const existing = db.profiles.find(
      (p) => p.username.toLowerCase() === cleanUsername || p.email.toLowerCase() === email.toLowerCase()
    );
    if (existing) {
      return res.status(400).json({ error: 'Username or email already in use.' });
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      username: cleanUsername,
      displayName,
      email,
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      bio: 'New traveler exploring on Aazam Social.',
      isVerified: false,
      isPrivate: false,
      status: 'active',
      role: 'user',
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      createdAt: new Date().toISOString(),
    };

    db.profiles.push(newUser);
    saveSocialDb(db);

    res.status(201).json({
      success: true,
      user: newUser,
      token: newUser.id,
    });
  });

  // 2. Profile endpoints
  app.get('/api/social/profile/:username', (req: Request, res: Response) => {
    const db = loadSocialDb();
    const target = db.profiles.find(
      (p) => p.username.toLowerCase() === req.params.username.toLowerCase()
    );

    if (!target) {
      return res.status(404).json({ error: 'Profile not found.' });
    }

    const posts = db.posts.filter((p) => p.userId === target.id);
    res.json({
      profile: target,
      posts,
      isFollowing: false,
    });
  });

  app.put('/api/social/profile', (req: Request, res: Response) => {
    const db = loadSocialDb();
    const user = db.profiles[0]; // Active session profile
    if (!user) return res.status(404).json({ error: 'No user session.' });

    Object.assign(user, req.body, { updatedAt: new Date().toISOString() });
    saveSocialDb(db);
    res.json({ success: true, user });
  });

  app.post('/api/social/users/:id/follow', (req: Request, res: Response) => {
    const db = loadSocialDb();
    const target = db.profiles.find((p) => p.id === req.params.id);
    if (!target) return res.status(404).json({ error: 'User not found' });

    const currentId = db.profiles[0]?.id;
    const existingIndex = db.follows.findIndex(
      (f) => f.followerId === currentId && f.followingId === target.id
    );

    if (existingIndex !== -1) {
      db.follows.splice(existingIndex, 1);
      target.followersCount = Math.max(0, target.followersCount - 1);
      saveSocialDb(db);
      return res.json({ following: false });
    } else {
      db.follows.push({
        followerId: currentId,
        followingId: target.id,
        createdAt: new Date().toISOString(),
      });
      target.followersCount += 1;
      saveSocialDb(db);
      return res.json({ following: true });
    }
  });

  // 3. Posts & Feed
  app.get('/api/social/posts', (req: Request, res: Response) => {
    const db = loadSocialDb();
    const filter = req.query.filter as string || 'for_you';
    let posts = [...db.posts];

    if (filter === 'latest') {
      posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      posts.sort((a, b) => (b.likesCount + b.commentsCount) - (a.likesCount + a.commentsCount));
    }

    res.json({ posts });
  });

  app.post('/api/social/posts', (req: Request, res: Response) => {
    const db = loadSocialDb();
    const author = db.profiles[0]; // Current user

    const newPost = {
      id: `post_${Date.now()}`,
      userId: author.id,
      username: author.username,
      userDisplayName: author.displayName,
      userAvatarUrl: author.avatarUrl,
      isVerified: author.isVerified,
      content: req.body.content || '',
      media: req.body.media || [],
      location: req.body.location || '',
      hashtags: req.body.hashtags || [],
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      savesCount: 0,
      isLiked: false,
      isSaved: false,
      createdAt: new Date().toISOString(),
      visibility: 'public',
    };

    db.posts.unshift(newPost);
    author.postsCount = (author.postsCount || 0) + 1;
    saveSocialDb(db);

    res.status(201).json({ success: true, post: newPost });
  });

  app.delete('/api/social/posts/:id', (req: Request, res: Response) => {
    const db = loadSocialDb();
    const idx = db.posts.findIndex((p) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Post not found.' });

    db.posts.splice(idx, 1);
    saveSocialDb(db);
    res.json({ success: true });
  });

  app.post('/api/social/posts/:id/like', (req: Request, res: Response) => {
    const db = loadSocialDb();
    const post = db.posts.find((p) => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found.' });

    post.isLiked = !post.isLiked;
    post.likesCount += post.isLiked ? 1 : -1;
    saveSocialDb(db);
    res.json({ success: true, isLiked: post.isLiked, likesCount: post.likesCount });
  });

  app.post('/api/social/posts/:id/save', (req: Request, res: Response) => {
    const db = loadSocialDb();
    const post = db.posts.find((p) => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found.' });

    post.isSaved = !post.isSaved;
    post.savesCount += post.isSaved ? 1 : -1;
    saveSocialDb(db);
    res.json({ success: true, isSaved: post.isSaved });
  });

  // Comments
  app.get('/api/social/posts/:id/comments', (req: Request, res: Response) => {
    const db = loadSocialDb();
    const comments = db.comments.filter((c) => c.postId === req.params.id);
    res.json({ comments });
  });

  app.post('/api/social/posts/:id/comments', (req: Request, res: Response) => {
    const db = loadSocialDb();
    const author = db.profiles[0];
    const post = db.posts.find((p) => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const newComment = {
      id: `comm_${Date.now()}`,
      postId: post.id,
      userId: author.id,
      username: author.username,
      userDisplayName: author.displayName,
      userAvatarUrl: author.avatarUrl,
      content: req.body.content,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      replies: [],
    };

    db.comments.push(newComment);
    post.commentsCount = (post.commentsCount || 0) + 1;
    saveSocialDb(db);
    res.status(201).json({ success: true, comment: newComment });
  });

  // 4. Stories
  app.get('/api/social/stories', (_req: Request, res: Response) => {
    const db = loadSocialDb();
    const now = Date.now();
    // Exclude expired stories (> 24 hours)
    const activeStories = db.stories.filter((s) => {
      const exp = new Date(s.expiresAt).getTime();
      return exp > now;
    });
    res.json({ stories: activeStories });
  });

  app.post('/api/social/stories', (req: Request, res: Response) => {
    const db = loadSocialDb();
    const author = db.profiles[0];
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const newStory = {
      id: `story_${Date.now()}`,
      userId: author.id,
      username: author.username,
      userDisplayName: author.displayName,
      userAvatarUrl: author.avatarUrl,
      mediaUrl: req.body.mediaUrl,
      mediaType: req.body.mediaType || 'image',
      caption: req.body.caption || '',
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      viewsCount: 1,
    };

    db.stories.unshift(newStory);
    saveSocialDb(db);
    res.status(201).json({ success: true, story: newStory });
  });

  // 5. Reels
  app.get('/api/social/reels', (_req: Request, res: Response) => {
    const db = loadSocialDb();
    res.json({ reels: db.reels || [] });
  });

  app.post('/api/social/reels/:id/like', (req: Request, res: Response) => {
    const db = loadSocialDb();
    const reel = db.reels.find((r) => r.id === req.params.id);
    if (!reel) return res.status(404).json({ error: 'Reel not found' });

    reel.isLiked = !reel.isLiked;
    reel.likesCount += reel.isLiked ? 1 : -1;
    saveSocialDb(db);
    res.json({ success: true, isLiked: reel.isLiked, likesCount: reel.likesCount });
  });

  // 6. Explore & Search
  app.get('/api/social/explore', (_req: Request, res: Response) => {
    const db = loadSocialDb();
    const trendingTags = ['IndianRailways', 'Varanasi', 'KashmirDiaries', 'VandeBharat', 'GoaMonsoon', 'Backpacking'];
    const suggestedUsers = db.profiles.slice(1, 6);
    res.json({
      posts: db.posts,
      trendingTags,
      suggestedUsers,
    });
  });

  app.get('/api/social/search', (req: Request, res: Response) => {
    const db = loadSocialDb();
    const q = String(req.query.q || '').toLowerCase();
    const users = db.profiles.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.displayName.toLowerCase().includes(q) ||
        (u.bio && u.bio.toLowerCase().includes(q))
    );
    const posts = db.posts.filter(
      (p) =>
        p.content.toLowerCase().includes(q) ||
        p.hashtags.some((t: string) => t.toLowerCase().includes(q))
    );
    res.json({ users, posts });
  });

  // 7. Messages
  app.get('/api/social/messages/conversations', (_req: Request, res: Response) => {
    const db = loadSocialDb();
    res.json({ conversations: db.conversations || [] });
  });

  app.get('/api/social/messages/:id', (req: Request, res: Response) => {
    const db = loadSocialDb();
    const msgs = db.messages.filter((m) => m.conversationId === req.params.id);
    res.json({ messages: msgs });
  });

  app.post('/api/social/messages/:id', (req: Request, res: Response) => {
    const db = loadSocialDb();
    const author = db.profiles[0];
    const newMsg = {
      id: `msg_${Date.now()}`,
      conversationId: req.params.id,
      senderId: author.id,
      content: req.body.content,
      createdAt: new Date().toISOString(),
      isRead: true,
    };

    db.messages.push(newMsg);
    const conv = db.conversations.find((c) => c.id === req.params.id);
    if (conv) {
      conv.lastMessage = {
        content: req.body.content,
        senderId: author.id,
        createdAt: newMsg.createdAt,
      };
      conv.updatedAt = newMsg.createdAt;
    }

    saveSocialDb(db);
    res.status(201).json({ success: true, message: newMsg });
  });

  app.post('/api/social/messages/start', (req: Request, res: Response) => {
    const db = loadSocialDb();
    const me = db.profiles[0];
    const target = db.profiles.find((p) => p.id === req.body.targetUserId);
    if (!target) return res.status(404).json({ error: 'User not found' });

    let conv = db.conversations.find((c) =>
      c.participants.some((p: any) => p.userId === me.id) &&
      c.participants.some((p: any) => p.userId === target.id)
    );

    if (!conv) {
      conv = {
        id: `conv_${Date.now()}`,
        participants: [
          {
            userId: me.id,
            username: me.username,
            displayName: me.displayName,
            avatarUrl: me.avatarUrl,
            isOnline: true,
          },
          {
            userId: target.id,
            username: target.username,
            displayName: target.displayName,
            avatarUrl: target.avatarUrl,
            isOnline: true,
          },
        ],
        lastMessage: {
          content: req.body.initialMessage || 'Started conversation',
          senderId: me.id,
          createdAt: new Date().toISOString(),
        },
        unreadCount: 0,
        updatedAt: new Date().toISOString(),
      };
      db.conversations.unshift(conv);

      db.messages.push({
        id: `msg_${Date.now()}`,
        conversationId: conv.id,
        senderId: me.id,
        content: req.body.initialMessage || 'Started conversation',
        createdAt: new Date().toISOString(),
        isRead: true,
      });

      saveSocialDb(db);
    }

    res.json({ success: true, conversation: conv });
  });

  // 8. Notifications
  app.get('/api/social/notifications', (_req: Request, res: Response) => {
    const db = loadSocialDb();
    res.json({ notifications: db.notifications || [] });
  });

  app.post('/api/social/notifications/read-all', (_req: Request, res: Response) => {
    const db = loadSocialDb();
    db.notifications.forEach((n) => {
      n.isRead = true;
    });
    saveSocialDb(db);
    res.json({ success: true });
  });

  // 9. Reports & Moderation
  app.post('/api/social/reports', (req: Request, res: Response) => {
    const db = loadSocialDb();
    const reporter = db.profiles[0];
    const newReport = {
      id: `rep_${Date.now()}`,
      reporterId: reporter.id,
      reporterUsername: reporter.username,
      targetType: req.body.targetType,
      targetId: req.body.targetId,
      targetAuthorId: 'usr_target',
      targetAuthorUsername: 'reported_user',
      reason: req.body.reason,
      description: req.body.description || '',
      status: 'pending',
      actionTaken: 'none',
      createdAt: new Date().toISOString(),
    };

    db.reports.unshift(newReport);
    saveSocialDb(db);
    res.status(201).json({ success: true, report: newReport });
  });

  // Admin: Stats
  app.get('/api/social/admin/stats', (_req: Request, res: Response) => {
    const db = loadSocialDb();
    const activeUsers = db.profiles.filter((p) => p.status === 'active').length;
    const suspendedUsers = db.profiles.filter((p) => p.status === 'suspended').length;
    const pendingReports = db.reports.filter((r) => r.status === 'pending').length;
    const resolvedReports = db.reports.filter((r) => r.status === 'resolved' || r.status === 'dismissed').length;

    res.json({
      stats: {
        totalUsers: db.profiles.length,
        activeUsers,
        suspendedUsers,
        totalPosts: db.posts.length,
        totalComments: db.comments.length,
        totalStories: db.stories.length,
        pendingReports,
        resolvedReports,
        totalReels: db.reels?.length || 0,
      },
    });
  });

  // Admin: Users
  app.get('/api/social/admin/users', (req: Request, res: Response) => {
    const db = loadSocialDb();
    const q = String(req.query.q || '').toLowerCase();
    let users = db.profiles;
    if (q) {
      users = users.filter(
        (u) =>
          u.username.toLowerCase().includes(q) ||
          u.displayName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }
    res.json({ users });
  });

  // Admin: User status
  app.post('/api/social/admin/users/:id/status', (req: Request, res: Response) => {
    const db = loadSocialDb();
    const target = db.profiles.find((p) => p.id === req.params.id);
    if (!target) return res.status(404).json({ error: 'User not found' });

    const { status, reason } = req.body;
    target.status = status;

    // Log action
    db.moderationActions.unshift({
      id: `mod_${Date.now()}`,
      adminId: 'usr_super_01',
      adminUsername: 'aazam_official',
      action: status === 'suspended' ? 'suspend_user' : 'restore_user',
      targetType: 'user',
      targetId: target.id,
      targetSummary: `User @${target.username} (${target.displayName}) set to ${status}`,
      reason: reason || 'Enforced by administrator',
      createdAt: new Date().toISOString(),
    });

    db.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      adminId: 'usr_super_01',
      adminUsername: 'aazam_official',
      action: status === 'suspended' ? 'USER_SUSPENDED' : 'USER_RESTORED',
      resource: `/users/${target.username}`,
      details: `Status set to ${status}. Reason: ${reason || 'N/A'}`,
      ipAddress: req.ip || '127.0.0.1',
      timestamp: new Date().toISOString(),
    });

    saveSocialDb(db);
    res.json({ success: true, user: target });
  });

  // Admin: Reports
  app.get('/api/social/admin/reports', (req: Request, res: Response) => {
    const db = loadSocialDb();
    const status = req.query.status as string;
    let list = db.reports;
    if (status && status !== 'all') {
      list = list.filter((r) => r.status === status);
    }
    res.json({ reports: list });
  });

  // Admin: Resolve report
  app.post('/api/social/admin/reports/:id/resolve', (req: Request, res: Response) => {
    const db = loadSocialDb();
    const rep = db.reports.find((r) => r.id === req.params.id);
    if (!rep) return res.status(404).json({ error: 'Report not found' });

    const { actionTaken, moderationNotes } = req.body;
    rep.status = actionTaken === 'dismissed' ? 'dismissed' : 'resolved';
    rep.actionTaken = actionTaken;
    rep.moderationNotes = moderationNotes;
    rep.resolvedAt = new Date().toISOString();
    rep.resolvedBy = 'aazam_official';

    // If removing content, delete the post if target is post
    if (actionTaken === 'removed_content' && rep.targetType === 'post') {
      const pIdx = db.posts.findIndex((p) => p.id === rep.targetId);
      if (pIdx !== -1) db.posts.splice(pIdx, 1);
    }

    db.moderationActions.unshift({
      id: `mod_${Date.now()}`,
      adminId: 'usr_super_01',
      adminUsername: 'aazam_official',
      action: actionTaken === 'dismissed' ? 'dismiss_report' : 'delete_post',
      targetType: 'report',
      targetId: rep.id,
      targetSummary: `Report on ${rep.targetType} marked as ${actionTaken}`,
      reason: moderationNotes || 'Actioned by moderator',
      createdAt: new Date().toISOString(),
    });

    saveSocialDb(db);
    res.json({ success: true, report: rep });
  });

  // Admin: Moderation history
  app.get('/api/social/admin/moderation-actions', (_req: Request, res: Response) => {
    const db = loadSocialDb();
    res.json({ actions: db.moderationActions || [] });
  });

  // Admin: Audit logs
  app.get('/api/social/admin/audit-logs', (_req: Request, res: Response) => {
    const db = loadSocialDb();
    res.json({ logs: db.auditLogs || [] });
  });

  // Admin: Roles
  app.get('/api/social/admin/roles', (_req: Request, res: Response) => {
    const db = loadSocialDb();
    const admins = db.profiles.filter((p) => p.role === 'admin' || p.role === 'super_admin');
    res.json({ admins });
  });
}
