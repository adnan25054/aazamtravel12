import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Globe, 
  Calendar, 
  CheckCircle2, 
  Edit3, 
  Grid, 
  Bookmark, 
  Film, 
  UserPlus, 
  UserCheck, 
  MessageSquare,
  Shield,
  Lock,
  Flag,
  Share2
} from 'lucide-react';
import { SocialProfile, SocialPost } from '../types';
import { PostCard } from '../components/PostCard';
import { useSocialAuth } from '../context/SocialAuthContext';
import { socialApi } from '../lib/supabase';

interface ProfileViewProps {
  username: string;
  onOpenReport?: (targetType: 'post' | 'profile', targetId: string, authorId: string, authorUsername: string, previewText: string) => void;
  onStartChat?: (userId: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  username,
  onOpenReport,
  onStartChat,
}) => {
  const { currentUser, updateProfile } = useSocialAuth();
  const [profile, setProfile] = useState<SocialProfile | null>(null);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'saved'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit profile form states
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const isMyProfile = currentUser?.username === username;

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const res = await socialApi.getProfile(username);
      if (res.profile) {
        setProfile(res.profile);
        setPosts(res.posts || []);
        setIsFollowing(Boolean(res.isFollowing));
        setFollowersCount(res.profile.followersCount || 0);

        // Prep edit fields
        setDisplayName(res.profile.displayName);
        setBio(res.profile.bio || '');
        setLocation(res.profile.location || '');
        setWebsite(res.profile.website || '');
        setAvatarUrl(res.profile.avatarUrl || '');
        setCoverUrl(res.profile.coverUrl || '');
        setIsPrivate(Boolean(res.profile.isPrivate));
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [username]);

  const handleToggleFollow = async () => {
    if (!profile) return;
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    setFollowersCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

    try {
      await socialApi.toggleFollow(profile.id);
    } catch (err) {
      setIsFollowing(!nextState);
      setFollowersCount((prev) => (!nextState ? prev + 1 : Math.max(0, prev - 1)));
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile({
        displayName,
        bio,
        location,
        website,
        avatarUrl,
        coverUrl,
        isPrivate,
      });
      setShowEditModal(false);
      fetchProfileData();
    } catch (err) {
      alert('Failed to save profile: ' + err);
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 mx-auto border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500">Loading @{username} profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-3">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Profile not found</h3>
        <p className="text-xs text-slate-500">The user @{username} may have changed their username or account is unavailable.</p>
      </div>
    );
  }

  const mediaPosts = posts.filter((p) => p.media && p.media.length > 0);

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-6">
      {/* 1. Profile Banner & Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden relative">
        {/* Cover Image */}
        <div className="h-44 sm:h-56 w-full bg-gradient-to-r from-[#0B2545] via-[#133E68] to-[#1E3A8A] relative overflow-hidden">
          {profile.coverUrl ? (
            <img
              src={profile.coverUrl}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-navy-900 to-sky-900 opacity-90" />
          )}
        </div>

        {/* Profile Info Row */}
        <div className="p-4 sm:p-6 relative pt-0 sm:pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            {/* Avatar with status border */}
            <div className="relative inline-block">
              <img
                src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80'}
                alt={profile.displayName}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white dark:border-slate-900 shadow-xl"
              />
              {profile.status === 'suspended' && (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                  Suspended
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {isMyProfile ? (
                <button
                  type="button"
                  onClick={() => setShowEditModal(true)}
                  className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold flex items-center gap-2 transition-colors border border-slate-200 dark:border-slate-700"
                >
                  <Edit3 className="w-4 h-4 text-orange-500" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleToggleFollow}
                    className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs ${
                      isFollowing
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-4 h-4" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>

                  {onStartChat && (
                    <button
                      type="button"
                      onClick={() => onStartChat(profile.id)}
                      className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Send Message"
                    >
                      <MessageSquare className="w-4 h-4 text-sky-500" />
                    </button>
                  )}

                  {onOpenReport && (
                    <button
                      type="button"
                      onClick={() => onOpenReport('profile', profile.id, profile.id, profile.username, profile.displayName)}
                      className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-600 transition-colors"
                      title="Report Account"
                    >
                      <Flag className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* User Names & Bio */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {profile.displayName}
                </h1>
                {profile.isVerified && (
                  <CheckCircle2 className="w-5 h-5 text-orange-500 fill-orange-500/10" />
                )}
                {profile.role === 'super_admin' && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                    Super Admin
                  </span>
                )}
                {profile.isPrivate && (
                  <span title="Private Account">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </span>
                )}
              </div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                @{profile.username}
              </div>
            </div>

            {profile.bio && (
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 max-w-2xl leading-relaxed whitespace-pre-line">
                {profile.bio}
              </p>
            )}

            {/* Metadata (Location, Website, Joined date) */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
              {profile.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-500" />
                  <span>{profile.location}</span>
                </div>
              )}

              {profile.website && (
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-sky-500" />
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 dark:text-orange-400 hover:underline"
                  >
                    {profile.website.replace('https://', '').replace('http://', '')}
                  </a>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  Joined{' '}
                  {new Date(profile.createdAt).toLocaleDateString([], {
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Counts: Posts, Followers, Following */}
            <div className="flex items-center gap-6 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm">
              <div>
                <strong className="text-slate-900 dark:text-white font-bold">{posts.length}</strong>{' '}
                <span className="text-slate-500 dark:text-slate-400">Posts</span>
              </div>
              <div>
                <strong className="text-slate-900 dark:text-white font-bold">{followersCount}</strong>{' '}
                <span className="text-slate-500 dark:text-slate-400">Followers</span>
              </div>
              <div>
                <strong className="text-slate-900 dark:text-white font-bold">{profile.followingCount}</strong>{' '}
                <span className="text-slate-500 dark:text-slate-400">Following</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Profile Tabs (Posts, Media, Saved) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 flex items-center justify-around text-xs font-bold shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'posts'
              ? 'bg-[#0B2545] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Grid className="w-4 h-4 text-orange-400" />
          <span>Posts ({posts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('media')}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'media'
              ? 'bg-[#0B2545] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Film className="w-4 h-4 text-orange-400" />
          <span>Photos & Video ({mediaPosts.length})</span>
        </button>

        {isMyProfile && (
          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'saved'
                ? 'bg-[#0B2545] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4 text-orange-400" />
            <span>Saved Bookmarks</span>
          </button>
        )}
      </div>

      {/* 3. Tab Contents */}
      {activeTab === 'posts' && (
        <div className="space-y-5">
          {posts.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-xs text-slate-500">
              No posts shared yet by @{profile.username}.
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onPostUpdated={fetchProfileData}
                onOpenReport={onOpenReport}
              />
            ))
          )}
        </div>
      )}

      {activeTab === 'media' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {mediaPosts.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-xs text-slate-500">
              No photo or video posts yet.
            </div>
          ) : (
            mediaPosts.map((p) => (
              <div
                key={p.id}
                className="relative aspect-square rounded-2xl overflow-hidden bg-black group border border-slate-200 dark:border-slate-800"
              >
                <img
                  src={p.media[0]?.url}
                  alt={p.content}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-2">
          <Bookmark className="w-10 h-10 mx-auto text-orange-500" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Saved Travel Posts
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Your saved bookmarks are stored safely and private to your account.
          </p>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              Edit Your Profile
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Display Name:
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bio / Travel Motto:
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell other travelers about your adventures..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Location:
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Mumbai, Maharashtra"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Website / Portfolio:
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Profile Avatar URL:
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Cover Banner URL:
                </label>
                <input
                  type="url"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="text-orange-500 rounded"
                />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Private account (only followers can view posts)
                </span>
              </label>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold"
                >
                  {savingProfile ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
