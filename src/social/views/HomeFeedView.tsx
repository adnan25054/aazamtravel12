import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Users, 
  Clock, 
  PlusSquare, 
  TrendingUp, 
  Compass, 
  CheckCircle2, 
  UserPlus, 
  UserCheck 
} from 'lucide-react';
import { SocialPost, SocialStory, SocialProfile } from '../types';
import { PostCard } from '../components/PostCard';
import { StoryBar } from '../components/StoryBar';
import { StoryViewerModal } from '../components/StoryViewerModal';
import { CreateStoryModal } from '../components/CreateStoryModal';
import { useSocialAuth } from '../context/SocialAuthContext';
import { socialApi } from '../lib/supabase';

interface HomeFeedViewProps {
  onOpenCreatePost: () => void;
  onOpenReport: (targetType: 'post' | 'profile', targetId: string, authorId: string, authorUsername: string, previewText: string) => void;
  onNavigateProfile: (username: string) => void;
  onNavigateExplore: () => void;
}

export const HomeFeedView: React.FC<HomeFeedViewProps> = ({
  onOpenCreatePost,
  onOpenReport,
  onNavigateProfile,
  onNavigateExplore,
}) => {
  const { currentUser } = useSocialAuth();
  const [feedFilter, setFeedFilter] = useState<'for_you' | 'following' | 'latest'>('for_you');
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [stories, setStories] = useState<SocialStory[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<SocialProfile[]>([]);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  // Story modals
  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);
  const [showCreateStory, setShowCreateStory] = useState(false);

  const fetchFeedData = async () => {
    try {
      const [feedRes, storiesRes, exploreRes] = await Promise.all([
        socialApi.getFeed(feedFilter),
        socialApi.getStories(),
        socialApi.getExplore(),
      ]);

      setPosts(feedRes.posts || []);
      setStories(storiesRes.stories || []);
      setSuggestedUsers(exploreRes.suggestedUsers || []);

      // Build initial following status map
      const fMap: Record<string, boolean> = {};
      if (exploreRes.suggestedUsers) {
        exploreRes.suggestedUsers.forEach((u: SocialProfile) => {
          fMap[u.id] = false;
        });
      }
      setFollowingMap(fMap);
    } catch (err) {
      console.error('Failed to load feed data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedData();
  }, [feedFilter]);

  const handleToggleFollow = async (userId: string) => {
    const isCurrentlyFollowing = Boolean(followingMap[userId]);
    setFollowingMap((prev) => ({ ...prev, [userId]: !isCurrentlyFollowing }));
    try {
      await socialApi.toggleFollow(userId);
    } catch (err) {
      setFollowingMap((prev) => ({ ...prev, [userId]: isCurrentlyFollowing }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main Feed Column (8 cols on desktop) */}
      <div className="lg:col-span-8 space-y-5">
        {/* 1. Stories Carousel */}
        <StoryBar
          stories={stories}
          onSelectStory={(idx) => setActiveStoryIdx(idx)}
          onOpenCreateStory={() => setShowCreateStory(true)}
        />

        {/* 2. Feed Filter Selector Tabs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 flex items-center justify-between text-xs font-bold shadow-xs">
          <button
            type="button"
            onClick={() => setFeedFilter('for_you')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              feedFilter === 'for_you'
                ? 'bg-[#0B2545] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>For You</span>
          </button>

          <button
            type="button"
            onClick={() => setFeedFilter('following')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              feedFilter === 'following'
                ? 'bg-[#0B2545] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-orange-400" />
            <span>Following</span>
          </button>

          <button
            type="button"
            onClick={() => setFeedFilter('latest')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              feedFilter === 'latest'
                ? 'bg-[#0B2545] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-orange-400" />
            <span>Latest</span>
          </button>
        </div>

        {/* 3. Quick Create Post Banner */}
        <div
          onClick={onOpenCreatePost}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xs flex items-center gap-3 cursor-pointer hover:border-orange-500/50 transition-all group"
        >
          <img
            src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80'}
            alt="My Avatar"
            className="w-10 h-10 rounded-full object-cover border border-orange-500/30"
          />
          <div className="flex-1 bg-slate-50 dark:bg-slate-800/70 text-slate-400 dark:text-slate-400 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium">
            Where are you traveling today? Share your thoughts, photos, or tips...
          </div>
          <button
            type="button"
            className="p-2.5 rounded-2xl bg-orange-500 group-hover:bg-orange-600 text-white transition-colors"
          >
            <PlusSquare className="w-5 h-5" />
          </button>
        </div>

        {/* 4. Posts List */}
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-8 h-8 mx-auto border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500">Loading travel community feed...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <Compass className="w-12 h-12 mx-auto text-orange-500" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              No posts in this feed yet
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Follow more travelers or publish the first post about your favorite destinations!
            </p>
            <button
              type="button"
              onClick={onOpenCreatePost}
              className="px-5 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-500/20"
            >
              Create Post
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onPostUpdated={fetchFeedData}
                onOpenReport={onOpenReport}
                onNavigateProfile={onNavigateProfile}
              />
            ))}
          </div>
        )}
      </div>

      {/* Suggested Creators & Trending Hashtags Sidebar (4 cols on desktop) */}
      <div className="hidden lg:block lg:col-span-4 space-y-5">
        {/* Suggested Travelers Box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-500" />
              <span>Suggested Travelers</span>
            </h4>
            <button
              type="button"
              onClick={onNavigateExplore}
              className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline"
            >
              See All
            </button>
          </div>

          <div className="space-y-3">
            {suggestedUsers.slice(0, 4).map((u) => {
              const isFollowing = Boolean(followingMap[u.id]);
              return (
                <div key={u.id} className="flex items-center justify-between gap-3">
                  <div
                    onClick={() => onNavigateProfile(u.username)}
                    className="flex items-center gap-2.5 cursor-pointer truncate group"
                  >
                    <img
                      src={u.avatarUrl}
                      alt={u.displayName}
                      className="w-9 h-9 rounded-full object-cover border border-orange-500/20 group-hover:border-orange-500 transition-colors"
                    />
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors truncate">
                        {u.displayName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        @{u.username}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleFollow(u.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isFollowing
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        : 'bg-orange-500 hover:bg-orange-600 text-white shadow-xs'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trending Hashtags Box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#133E68] dark:text-sky-400" />
            <span>Trending Destinations</span>
          </h4>

          <div className="space-y-2 text-xs">
            {[
              { tag: 'VandeBharatExpress', count: '14.2k posts' },
              { tag: 'KashmirDiaries', count: '9.8k posts' },
              { tag: 'VaranasiGhats', count: '7.4k posts' },
              { tag: 'GoaMonsoon', count: '5.1k posts' },
              { tag: 'IndianRailways', count: '18.9k posts' },
            ].map((item) => (
              <div
                key={item.tag}
                onClick={onNavigateExplore}
                className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    #{item.tag}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {item.count}
                  </div>
                </div>
                <span className="text-orange-500 font-bold">›</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Viewer Modal */}
      {activeStoryIdx !== null && (
        <StoryViewerModal
          stories={stories}
          initialIndex={activeStoryIdx}
          onClose={() => setActiveStoryIdx(null)}
        />
      )}

      {/* Create Story Modal */}
      {showCreateStory && (
        <CreateStoryModal
          onClose={() => setShowCreateStory(false)}
          onStoryCreated={fetchFeedData}
        />
      )}
    </div>
  );
};
