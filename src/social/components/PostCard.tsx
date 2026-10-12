import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal, 
  MapPin, 
  CheckCircle2, 
  Trash2, 
  Flag, 
  Send, 
  ChevronLeft, 
  ChevronRight,
  Copy,
  Check
} from 'lucide-react';
import { SocialPost, SocialComment } from '../types';
import { useSocialAuth } from '../context/SocialAuthContext';
import { socialApi } from '../lib/supabase';

interface PostCardProps {
  post: SocialPost;
  onPostUpdated?: () => void;
  onOpenReport?: (targetType: 'post' | 'profile', targetId: string, authorId: string, authorUsername: string, previewText: string) => void;
  onNavigateProfile?: (username: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onPostUpdated,
  onOpenReport,
  onNavigateProfile,
}) => {
  const { currentUser, isAdmin } = useSocialAuth();
  const [isLiked, setIsLiked] = useState(Boolean(post.isLiked));
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isSaved, setIsSaved] = useState(Boolean(post.isSaved));
  const [savesCount, setSavesCount] = useState(post.savesCount);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<SocialComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isAuthor = currentUser?.id === post.userId;
  const canDelete = isAuthor || isAdmin;

  const handleToggleLike = async () => {
    // Optimistic UI update
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikesCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

    try {
      await socialApi.toggleLike(post.id);
    } catch (err) {
      // Revert if error
      setIsLiked(!nextState);
      setLikesCount((prev) => (!nextState ? prev + 1 : Math.max(0, prev - 1)));
    }
  };

  const handleToggleSave = async () => {
    const nextState = !isSaved;
    setIsSaved(nextState);
    setSavesCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

    try {
      await socialApi.toggleSave(post.id);
    } catch (err) {
      setIsSaved(!nextState);
      setSavesCount((prev) => (!nextState ? prev + 1 : Math.max(0, prev - 1)));
    }
  };

  const handleLoadComments = async () => {
    if (!showComments) {
      setLoadingComments(true);
      setShowComments(true);
      try {
        const res = await socialApi.getComments(post.id);
        setComments(res.comments || []);
      } catch (err) {
        console.error('Failed to load comments:', err);
      } finally {
        setLoadingComments(false);
      }
    } else {
      setShowComments(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || submittingComment) return;

    setSubmittingComment(true);
    try {
      const res = await socialApi.addComment(post.id, newCommentText.trim());
      if (res.comment) {
        setComments((prev) => [...prev, res.comment]);
        setNewCommentText('');
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await socialApi.deletePost(post.id);
      if (onPostUpdated) onPostUpdated();
    } catch (err) {
      alert('Failed to delete post: ' + err);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/social/post/${post.id}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <article className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden transition-all hover:shadow-md">
      {/* 1. Header: Author & Options */}
      <div className="p-4 sm:p-5 flex items-center justify-between">
        <div 
          onClick={() => onNavigateProfile && onNavigateProfile(post.username)}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img
            src={post.userAvatarUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80'}
            alt={post.userDisplayName}
            className="w-11 h-11 rounded-full object-cover border border-orange-500/20 group-hover:border-orange-500 transition-colors"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">
                {post.userDisplayName}
              </span>
              {post.isVerified && (
                <CheckCircle2 className="w-4 h-4 text-orange-500 fill-orange-500/10" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>@{post.username}</span>
              <span>·</span>
              <span>
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* 3-dots Menu Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu((prev) => !prev)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-10 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-30">
              <button
                type="button"
                onClick={() => {
                  handleShare();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2.5"
              >
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copy Post Link</span>
              </button>

              {onOpenReport && !isAuthor && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenReport('post', post.id, post.userId, post.username, post.content);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2.5"
                >
                  <Flag className="w-4 h-4 text-amber-500" />
                  <span>Report Post</span>
                </button>
              )}

              {canDelete && (
                <button
                  type="button"
                  onClick={() => {
                    handleDeletePost();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2.5 border-t border-slate-100 dark:border-slate-700"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                  <span>Delete Post</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. Post Content & Location */}
      <div className="px-4 sm:px-5 pb-3 space-y-2">
        <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
          {post.content}
        </p>

        {post.location && (
          <div className="flex items-center gap-1.5 text-xs text-orange-600 dark:text-orange-400 font-medium">
            <MapPin className="w-3.5 h-3.5" />
            <span>{post.location}</span>
          </div>
        )}

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.hashtags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold text-[#133E68] dark:text-sky-400 hover:underline cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 3. Media Gallery (Multi-image carousel or video) */}
      {post.media && post.media.length > 0 && (
        <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-slate-950 overflow-hidden">
          {post.media[activeMediaIndex].type === 'video' ? (
            <video
              src={post.media[activeMediaIndex].url}
              controls
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={post.media[activeMediaIndex].url}
              alt="Post media"
              className="w-full h-full object-cover"
            />
          )}

          {/* Carousel Arrows if multiple images */}
          {post.media.length > 1 && (
            <>
              {activeMediaIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveMediaIndex((i) => i - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-xs transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {activeMediaIndex < post.media.length - 1 && (
                <button
                  type="button"
                  onClick={() => setActiveMediaIndex((i) => i + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-xs transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              {/* Dots Indicator */}
              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5">
                {post.media.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === activeMediaIndex ? 'w-5 bg-orange-500' : 'w-1.5 bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* 4. Action Bar (Likes, Comments, Shares, Saves) */}
      <div className="px-4 sm:px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Like Button */}
          <button
            type="button"
            onClick={handleToggleLike}
            className={`flex items-center gap-1.5 text-xs sm:text-sm font-bold transition-transform active:scale-125 ${
              isLiked ? 'text-red-500' : 'text-slate-600 dark:text-slate-400 hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{likesCount}</span>
          </button>

          {/* Comment Button */}
          <button
            type="button"
            onClick={handleLoadComments}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-[#0B2545] dark:hover:text-white"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{post.commentsCount + (comments.length > post.commentsCount ? comments.length - post.commentsCount : 0)}</span>
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-orange-500"
            title="Share Post Link"
          >
            {copiedLink ? (
              <>
                <Check className="w-5 h-5 text-emerald-500" />
                <span className="text-emerald-500">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>

        {/* Save / Bookmark Button */}
        <button
          type="button"
          onClick={handleToggleSave}
          className={`p-1.5 rounded-xl transition-colors ${
            isSaved
              ? 'text-orange-500'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
          title="Save Post"
        >
          <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-orange-500' : ''}`} />
        </button>
      </div>

      {/* 5. Comments Section Expander */}
      {showComments && (
        <div className="px-4 sm:px-5 py-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 space-y-4">
          {loadingComments ? (
            <div className="text-center py-4 text-xs text-slate-400">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-center py-4 text-xs text-slate-500">
              No comments yet. Be the first to share your thoughts!
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {comments.map((c) => (
                <div key={c.id} className="space-y-2">
                  <div className="flex items-start gap-2.5">
                    <img
                      src={c.userAvatarUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80'}
                      alt={c.userDisplayName}
                      className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1 bg-white dark:bg-slate-800 p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                        <span>{c.userDisplayName}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                        {c.content}
                      </p>
                    </div>
                  </div>

                  {/* Replies if any */}
                  {c.replies && c.replies.length > 0 && (
                    <div className="ml-9 space-y-2">
                      {c.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-2">
                          <img
                            src={reply.userAvatarUrl}
                            alt={reply.userDisplayName}
                            className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                          />
                          <div className="flex-1 bg-white/80 dark:bg-slate-800/80 p-2 rounded-xl text-xs border border-slate-200/60 dark:border-slate-700/60">
                            <span className="font-bold text-slate-900 dark:text-white mr-1.5">
                              {reply.userDisplayName}:
                            </span>
                            <span className="text-slate-700 dark:text-slate-300">
                              {reply.content}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add comment input */}
          <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Add a comment or reply..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              disabled={submittingComment || !newCommentText.trim()}
              className="p-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </article>
  );
};
