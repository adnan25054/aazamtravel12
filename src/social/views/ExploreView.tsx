import React, { useState, useEffect } from 'react';
import { Search, Compass, TrendingUp, Users, Heart, MessageCircle, X } from 'lucide-react';
import { SocialPost, SocialProfile } from '../types';
import { socialApi } from '../lib/supabase';

interface ExploreViewProps {
  onNavigateProfile: (username: string) => void;
  onSelectPost: (post: SocialPost) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  onNavigateProfile,
  onSelectPost,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [matchingUsers, setMatchingUsers] = useState<SocialProfile[]>([]);
  const [trendingTags, setTrendingTags] = useState<string[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchExploreData = async () => {
    try {
      const res = await socialApi.getExplore();
      setPosts(res.posts || []);
      setTrendingTags(res.trendingTags || []);
    } catch (err) {
      console.error('Failed to load explore items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExploreData();
  }, []);

  // Handle active search query changes
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setMatchingUsers([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await socialApi.search(q);
        setMatchingUsers(res.users || []);
        if (res.posts) setPosts(res.posts);
      } catch (err) {
        console.error('Search error:', err);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredPosts = activeTag
    ? posts.filter((p) => p.hashtags?.some((t) => t.toLowerCase() === activeTag.toLowerCase()))
    : posts;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* 1. Universal Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search travel creators, places, or topics (e.g. Priya, Varanasi, Kashmir, Railways)..."
          className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. User Search Results (if searching) */}
      {matchingUsers.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-orange-500" />
            <span>Matching Creators ({matchingUsers.length})</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {matchingUsers.map((u) => (
              <div
                key={u.id}
                onClick={() => onNavigateProfile(u.username)}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-orange-50 dark:hover:bg-orange-950/30 border border-slate-200/80 dark:border-slate-700/80 cursor-pointer flex items-center gap-3 transition-colors group"
              >
                <img
                  src={u.avatarUrl}
                  alt={u.displayName}
                  className="w-10 h-10 rounded-full object-cover border border-orange-500/30 group-hover:border-orange-500"
                />
                <div className="truncate flex-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-500 truncate">
                    {u.displayName}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    @{u.username}
                  </div>
                  {u.bio && (
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      {u.bio}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Trending Hashtags Pills */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <TrendingUp className="w-4 h-4 text-[#133E68] dark:text-sky-400" />
          <span>Trending Hashtags:</span>
          {activeTag && (
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              className="text-[11px] text-orange-500 hover:underline ml-2"
            >
              Clear Filter
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {trendingTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTag === tag
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-orange-400'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Explore Media Grid (Photo / Video Wall) */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Compass className="w-4 h-4 text-orange-500" />
          <span>Explore Destinations & Stories</span>
        </h3>

        {loading ? (
          <div className="py-16 text-center space-y-2">
            <div className="w-8 h-8 mx-auto border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500">Discovering world stories...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
            No posts found for this selection.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {filteredPosts.map((post) => {
              const previewImg = post.media?.[0]?.url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80';
              return (
                <div
                  key={post.id}
                  onClick={() => onSelectPost(post)}
                  className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 group cursor-pointer border border-slate-200 dark:border-slate-800 shadow-xs"
                >
                  <img
                    src={previewImg}
                    alt={post.content}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Hover Overlay with Likes & Comments */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-white">
                    <div className="text-right">
                      {post.media?.length > 1 && (
                        <span className="px-2 py-0.5 rounded-md bg-black/60 text-[10px] font-bold">
                          +{post.media.length} photos
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs line-clamp-2 font-medium drop-shadow-sm">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-3 text-xs font-bold pt-1">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 fill-white" />
                          {post.likesCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5 fill-white" />
                          {post.commentsCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
