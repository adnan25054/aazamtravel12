import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Volume2, 
  VolumeX, 
  ChevronUp, 
  ChevronDown, 
  Music, 
  UserPlus, 
  Check, 
  Copy 
} from 'lucide-react';
import { SocialReel } from '../types';
import { useSocialAuth } from '../context/SocialAuthContext';
import { socialApi } from '../lib/supabase';

interface ReelPlayerProps {
  reels: SocialReel[];
  onNavigateProfile?: (username: string) => void;
}

export const ReelPlayer: React.FC<ReelPlayerProps> = ({
  reels,
  onNavigateProfile,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [likesMap, setLikesMap] = useState<Record<string, { count: number; isLiked: boolean }>>(() => {
    const map: Record<string, { count: number; isLiked: boolean }> = {};
    reels.forEach((r) => {
      map[r.id] = { count: r.likesCount, isLiked: Boolean(r.isLiked) };
    });
    return map;
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const currentReel = reels[activeIndex];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [activeIndex]);

  const handleNext = () => {
    if (activeIndex < reels.length - 1) {
      setActiveIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex((i) => i - 1);
    }
  };

  const handleToggleLike = async (reelId: string) => {
    const current = likesMap[reelId] || { count: 0, isLiked: false };
    const nextState = !current.isLiked;
    const nextCount = nextState ? current.count + 1 : Math.max(0, current.count - 1);

    setLikesMap((prev) => ({
      ...prev,
      [reelId]: { count: nextCount, isLiked: nextState },
    }));

    try {
      await socialApi.toggleReelLike(reelId);
    } catch (err) {
      // Revert if error
      setLikesMap((prev) => ({
        ...prev,
        [reelId]: current,
      }));
    }
  };

  const handleShare = (reelId: string) => {
    const url = `${window.location.origin}/social/reels?id=${reelId}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
      setCopiedId(reelId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  if (!currentReel) {
    return (
      <div className="h-[75vh] flex items-center justify-center text-slate-500">
        No reels available at the moment.
      </div>
    );
  }

  const reelLikeState = likesMap[currentReel.id] || { count: currentReel.likesCount, isLiked: false };

  return (
    <div className="relative w-full max-w-sm sm:max-w-md mx-auto h-[84vh] max-h-[760px] bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 select-none flex items-center justify-center">
      {/* Video element with muted autoplay */}
      <video
        ref={videoRef}
        src={currentReel.videoUrl}
        autoPlay
        playsInline
        loop
        muted={isMuted}
        className="w-full h-full object-cover"
        onClick={() => setIsMuted((m) => !m)}
      />

      {/* Mute/Unmute Float Indicator */}
      <button
        type="button"
        onClick={() => setIsMuted((m) => !m)}
        className="absolute top-4 left-4 z-20 p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors"
        title={isMuted ? 'Unmute Video' : 'Mute Video'}
      >
        {isMuted ? <VolumeX className="w-5 h-5 text-slate-300" /> : <Volume2 className="w-5 h-5 text-orange-400" />}
      </button>

      {/* Vertical Navigation Controls (Prev & Next Reel) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        {activeIndex > 0 && (
          <button
            type="button"
            onClick={handlePrev}
            className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors"
            title="Previous Reel"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        )}
        {activeIndex < reels.length - 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors"
            title="Next Reel"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Right Side Action Bar: Likes, Comments, Share */}
      <div className="absolute right-4 bottom-20 z-20 flex flex-col items-center gap-5 text-white">
        {/* Like */}
        <button
          type="button"
          onClick={() => handleToggleLike(currentReel.id)}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="p-3 rounded-full bg-black/40 backdrop-blur-md group-hover:bg-black/60 transition-colors active:scale-125">
            <Heart className={`w-6 h-6 ${reelLikeState.isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </div>
          <span className="text-xs font-bold drop-shadow-md">{reelLikeState.count}</span>
        </button>

        {/* Comments */}
        <div className="flex flex-col items-center gap-1">
          <div className="p-3 rounded-full bg-black/40 backdrop-blur-md">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-bold drop-shadow-md">{currentReel.commentsCount}</span>
        </div>

        {/* Share */}
        <button
          type="button"
          onClick={() => handleShare(currentReel.id)}
          className="flex flex-col items-center gap-1"
          title="Share Reel"
        >
          <div className="p-3 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition-colors">
            {copiedId === currentReel.id ? (
              <Check className="w-6 h-6 text-emerald-400" />
            ) : (
              <Share2 className="w-6 h-6 text-white" />
            )}
          </div>
          <span className="text-xs font-bold drop-shadow-md">
            {copiedId === currentReel.id ? 'Copied' : currentReel.sharesCount}
          </span>
        </button>
      </div>

      {/* Bottom Overlay: Creator info, caption, audio track */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white space-y-2 pointer-events-auto pr-20">
        <div 
          onClick={() => onNavigateProfile && onNavigateProfile(currentReel.username)}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <img
            src={currentReel.userAvatarUrl}
            alt={currentReel.userDisplayName}
            className="w-10 h-10 rounded-full object-cover border-2 border-orange-500 group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors leading-tight">
              {currentReel.userDisplayName}
            </div>
            <div className="text-xs text-slate-300">@{currentReel.username}</div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-100 drop-shadow-md line-clamp-2 leading-snug">
          {currentReel.caption}
        </p>

        {currentReel.audioTrack && (
          <div className="flex items-center gap-2 text-[11px] text-orange-400 font-medium">
            <Music className="w-3.5 h-3.5 animate-bounce" />
            <span className="truncate">{currentReel.audioTrack}</span>
          </div>
        )}
      </div>
    </div>
  );
};
