import React, { useState, useEffect } from 'react';
import { Film } from 'lucide-react';
import { SocialReel } from '../types';
import { ReelPlayer } from '../components/ReelPlayer';
import { socialApi } from '../lib/supabase';

interface ReelsViewProps {
  onNavigateProfile?: (username: string) => void;
}

export const ReelsView: React.FC<ReelsViewProps> = ({ onNavigateProfile }) => {
  const [reels, setReels] = useState<SocialReel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await socialApi.getReels();
        setReels(res.reels || []);
      } catch (err) {
        console.error('Failed to load reels:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReels();
  }, []);

  return (
    <div className="max-w-xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
      {/* Header title */}
      <div className="flex items-center justify-between pb-4 mb-2">
        <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Film className="w-5 h-5 text-orange-500" />
          <span>Travel Reels & Short Videos</span>
        </h2>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Scroll or click arrows
        </span>
      </div>

      {loading ? (
        <div className="h-[70vh] flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500">Loading travel reels...</p>
        </div>
      ) : reels.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-xs text-slate-500">
          No video reels published yet.
        </div>
      ) : (
        <ReelPlayer reels={reels} onNavigateProfile={onNavigateProfile} />
      )}
    </div>
  );
};
