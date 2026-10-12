import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Eye, Clock } from 'lucide-react';
import { SocialStory } from '../types';

interface StoryViewerModalProps {
  stories: SocialStory[];
  initialIndex: number;
  onClose: () => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  initialIndex,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);

  const currentStory = stories[currentIndex];

  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((c) => c + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, stories.length, onClose]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((c) => c + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((c) => c - 1);
      setProgress(0);
    }
  };

  if (!currentStory) return null;

  // Calculate hours remaining before 24-hr expiry
  const expiresDate = new Date(currentStory.expiresAt).getTime();
  const hoursLeft = Math.max(1, Math.round((expiresDate - Date.now()) / (1000 * 60 * 60)));

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none">
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
        title="Close story"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Nav Prev */}
      {currentIndex > 0 && (
        <button
          type="button"
          onClick={handlePrev}
          className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Nav Next */}
      {currentIndex < stories.length - 1 && (
        <button
          type="button"
          onClick={handleNext}
          className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Story Box (9:16 aspect ratio container) */}
      <div className="relative w-full max-w-md h-[88vh] max-h-[780px] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-white/10">
        {/* Top Progress Bars */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1.5">
          {stories.map((s, idx) => (
            <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all duration-100"
                style={{
                  width:
                    idx < currentIndex
                      ? '100%'
                      : idx === currentIndex
                      ? `${progress}%`
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Header */}
        <div className="relative z-30 p-5 pt-7 flex items-center justify-between text-white bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-3">
            <img
              src={currentStory.userAvatarUrl}
              alt={currentStory.userDisplayName}
              className="w-10 h-10 rounded-full object-cover border-2 border-orange-500"
            />
            <div>
              <div className="text-sm font-bold leading-tight">{currentStory.userDisplayName}</div>
              <div className="text-xs text-slate-300">@{currentStory.username}</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-orange-400 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-orange-500/20">
            <Clock className="w-3.5 h-3.5" />
            <span>{hoursLeft}h left</span>
          </div>
        </div>

        {/* Story Media (Image or Video) */}
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
          {currentStory.mediaType === 'video' ? (
            <video
              src={currentStory.mediaUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={currentStory.mediaUrl}
              alt={currentStory.caption || 'Story'}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Click zones for mobile tapping */}
        <div className="absolute inset-0 z-20 flex">
          <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev} />
          <div className="w-2/3 h-full cursor-pointer" onClick={handleNext} />
        </div>

        {/* Story Footer / Caption */}
        <div className="relative z-30 p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white space-y-2 pointer-events-auto">
          {currentStory.caption && (
            <p className="text-sm font-medium drop-shadow-md leading-snug">
              {currentStory.caption}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-orange-400" />
              <span>{currentStory.viewsCount} views</span>
            </div>
            <span className="text-[11px] opacity-75">Expires in 24 hours</span>
          </div>
        </div>
      </div>
    </div>
  );
};
