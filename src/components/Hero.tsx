import React from 'react';
import { WebsiteSettings } from '../types';
import { OFFICIAL_LOGO_URL } from './Logo';
import { Train, Plane, Building2, MessageSquare, MapPin, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  settings: WebsiteSettings;
  onBookTrainClick: () => void;
  onBookFlightClick: () => void;
  onBookHotelClick: () => void;
  onExploreServicesClick: () => void;
  onSearchStationsClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onBookTrainClick,
  onBookFlightClick,
  onBookHotelClick,
  onExploreServicesClick,
  onSearchStationsClick,
}) => {
  const cleanWhatsApp = settings.whatsapp.replace(/[^0-9]/g, '');

  return (
    <section id="hero" className="relative overflow-hidden bg-[#07192F] text-white">
      {/* Background Graphic with Travel / High-Speed Railway Ambience */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=2000&q=80"
          alt="Railway travel and modern journey"
          className="w-full h-full object-cover object-center opacity-25 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07192F] via-[#0B2545]/90 to-[#07192F]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="max-w-3xl">
          {/* Official Agency Emblem & Pan-India Online Kicker */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="inline-flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-amber-400/30 shadow-lg">
              <img
                src={OFFICIAL_LOGO_URL}
                alt="Aazam Travel Agency Official Logo"
                className="h-14 w-auto object-contain rounded-xl bg-white p-1 drop-shadow-md transition-transform hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-white font-['Cabinet_Grotesk',system-ui] leading-tight">
                  Aazam Travel Agency
                </span>
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                  ⚡ 100% Pan-India Online Booking Desk
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-orange-400 tracking-wide uppercase">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>All Indian Railway Stations Covered</span>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <span>100% Online Booking</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-white mb-6">
            Your Journey Begins with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-300 to-amber-200">
              Aazam Travel Agency
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-xl text-slate-300 leading-relaxed mb-8 max-w-2xl font-normal">
            {settings.heroSubheadline}
          </p>

          {/* Travel Booking Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
            <button
              onClick={onBookTrainClick}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Train className="w-4 h-4" />
              <span>Book Train Tickets</span>
            </button>

            <button
              onClick={onBookFlightClick}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-sky-600 hover:bg-sky-700 text-white shadow-xl shadow-sky-600/25 transition-all hover:scale-105 active:scale-95"
            >
              <Plane className="w-4 h-4" />
              <span>Book Flights</span>
            </button>

            <button
              onClick={onBookHotelClick}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/25 transition-all hover:scale-105 active:scale-95"
            >
              <Building2 className="w-4 h-4" />
              <span>Book Hotels</span>
            </button>

            {onSearchStationsClick && (
              <button
                onClick={onSearchStationsClick}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xl shadow-amber-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <MapPin className="w-4 h-4" />
                <span>Station & Code Search</span>
              </button>
            )}

            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                'Hello Aazam Travel Agency, I want to inquire about travel tickets.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Trust Highlights - 100% Online Order Claims */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-800/80">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Online Order · No Office Visit</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Instant IRCTC E-Ticket on WhatsApp</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>All 7,000+ Stations Across India</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
