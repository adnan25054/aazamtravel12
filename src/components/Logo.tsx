import React from 'react';

interface LogoProps {
  className?: string;
  iconClassName?: string;
  isDark?: boolean;
  showSubtitle?: boolean;
  variant?: 'full' | 'icon' | 'badge';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  iconClassName = 'h-13 sm:h-14 w-auto',
  isDark = false,
  showSubtitle = true,
  variant = 'full',
}) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Old Logo Badge */}
      <img
        src="/logo.svg"
        alt="Aazam Travel Agency Official Logo"
        className={`${iconClassName} object-contain shrink-0 drop-shadow-md transition-transform duration-200 hover:scale-105`}
        loading="eager"
        decoding="async"
      />

      {/* Title text alongside logo */}
      {variant !== 'icon' && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span 
              className={`text-sm sm:text-lg font-black tracking-tight leading-none font-['Cabinet_Grotesk',system-ui] ${
                isDark ? 'text-white' : 'text-[#0B2545]'
              }`}
            >
              Aazam <span className={isDark ? 'text-emerald-400' : 'text-[#166534]'}>Travel</span>
            </span>
            <span 
              className={`text-[8px] sm:text-[9px] font-black uppercase px-1 sm:px-1.5 py-0.5 rounded-sm tracking-wider leading-none ${
                isDark 
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                  : 'bg-orange-100 text-orange-700 border border-orange-200'
              }`}
            >
              Agency
            </span>
          </div>

          {showSubtitle && (
            <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5 sm:mt-1">
              <span 
                className={`text-[9px] sm:text-[11px] font-bold tracking-wider uppercase ${
                  isDark ? 'text-orange-400' : 'text-orange-600'
                }`}
              >
                Pan-India Online
              </span>
              <span className={`text-[8px] sm:text-[9px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>•</span>
              <span className={`text-[9px] sm:text-[10px] font-semibold hidden md:inline ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                100% Digital Travel Desk
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
