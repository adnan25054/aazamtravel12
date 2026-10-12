import React, { useState } from 'react';
import { X, Image, Upload, Sparkles } from 'lucide-react';
import { socialApi } from '../lib/supabase';

interface CreateStoryModalProps {
  onClose: () => void;
  onStoryCreated: () => void;
}

const PRESET_STORY_IMAGES = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=80',
];

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
  onClose,
  onStoryCreated,
}) => {
  const [mediaUrl, setMediaUrl] = useState(PRESET_STORY_IMAGES[0]);
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl.trim()) {
      setError('Please provide a valid image or video URL.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await socialApi.createStory(mediaUrl.trim(), caption.trim());
      onStoryCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to publish story');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add to Story</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Disappears automatically after 24 hours
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs rounded-xl border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Media Preview Box */}
          <div className="relative aspect-[9/12] max-h-60 rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-200 dark:border-slate-800">
            {mediaUrl ? (
              <img
                src={mediaUrl}
                alt="Story preview"
                className="w-full h-full object-cover"
                onError={() => setError('Unable to load image preview from that URL.')}
              />
            ) : (
              <div className="text-center text-slate-400 text-xs">No media selected</div>
            )}
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-[10px] text-white">
              24h Expiry
            </div>
          </div>

          {/* Quick preset selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Choose Preset or Custom URL:
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {PRESET_STORY_IMAGES.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setMediaUrl(img)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    mediaUrl === img ? 'border-orange-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <input
              type="url"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="Or paste custom image/video URL..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Caption Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Caption (Optional):
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Sunrise trek in Manali! 🏔️"
              maxLength={120}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold shadow-md shadow-orange-500/20 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Publishing...' : 'Share to Story'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
