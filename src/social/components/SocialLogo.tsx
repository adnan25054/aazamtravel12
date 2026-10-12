import React from 'react';
import { Compass, Sparkles } from 'lucide-react';

interface SocialLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
  isDark?: boolean;
}

export const SocialLogo: React.FC<SocialLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
  isDark = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Brand Icon Emblem: Deep Navy + Glowing Vibrant Orange Node */}
      <div
        className={`${iconSizes[size]} rounded-2xl bg-gradient-to-tr from-[#0B2545] via-[#133E68] to-[#1E3A8A] flex items-center justify-center text-white shadow-md relative overflow-hidden border border-orange-500/30 group`}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent pointer-events-none" />
        <Compass className="w-5 h-5 text-orange-400 group-hover:rotate-45 transition-transform duration-300" />
        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500 shadow-sm shadow-orange-500 animate-pulse" />
      </div>

      {/* Brand Wordmark & Tagline */}
      <div className="flex flex-col leading-none">
        <div className={`font-black tracking-tight ${textSizes[size]} flex items-center gap-1`}>
          <span className={isDark ? 'text-white' : 'text-[#0B2545] dark:text-white'}>
            Aazam
          </span>
          <span className="text-orange-500 font-extrabold">Social</span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider mt-0.5">
            Connect • Share • Explore
          </span>
        )}
      </div>
    </div>
  );
};
