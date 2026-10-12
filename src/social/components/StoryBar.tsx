import React, { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { SocialStory } from '../types';
import { useSocialAuth } from '../context/SocialAuthContext';

interface StoryBarProps {
  stories: SocialStory[];
  onSelectStory: (storyIndex: number) => void;
  onOpenCreateStory: () => void;
}

export const StoryBar: React.FC<StoryBarProps> = ({
  stories,
  onSelectStory,
  onOpenCreateStory,
}) => {
  const { currentUser } = useSocialAuth();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xs overflow-x-auto no-scrollbar flex items-center gap-4">
      {/* 1. Add Story Pill */}
      <div 
        onClick={onOpenCreateStory}
        className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group"
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-full p-0.5 border-2 border-dashed border-orange-400 group-hover:border-orange-500 transition-colors flex items-center justify-center">
            <img
              src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80'}
              alt="My Avatar"
              className="w-14 h-14 rounded-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900">
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>
        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
          Your Story
        </span>
      </div>

      {/* 2. List of active stories */}
      {stories.map((story, idx) => (
        <div
          key={story.id}
          onClick={() => onSelectStory(idx)}
          className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group"
        >
          <div className="w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 group-hover:scale-105 transition-transform shadow-sm">
            <div className="w-full h-full rounded-full p-0.5 bg-white dark:bg-slate-900">
              <img
                src={story.userAvatarUrl}
                alt={story.userDisplayName}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 max-w-[68px] truncate text-center">
            {story.username}
          </span>
        </div>
      ))}
    </div>
  );
};
