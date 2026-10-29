import React, { useState } from 'react';
import { Logo } from './Logo';
import { WebsiteSettings } from '../types';
import { 
  Phone, 
  MessageSquare, 
  Menu, 
  X, 
  Lock, 
  Train, 
  Plane, 
  Bus, 
  Building2, 
  Compass, 
  Clock, 
  MapPin,
  ChevronRight,
  Activity,
  FileCheck,
  Building,
  CalendarDays
} from 'lucide-react';

interface HeaderProps {
  settings: WebsiteSettings;
  currentPage?: 'home' | 'train';
  activeRoute?: string;
  onOpenAdminLogin: () => void;
  isAdminLoggedIn: boolean;
  onOpenAdminDashboard: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  currentPage = 'home',
  activeRoute = '/',
  onOpenAdminLogin,
  isAdminLoggedIn,
  onOpenAdminDashboard,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cleanPhone = settings.phone.replace(/[^0-9]/g, '');
  const cleanWhatsApp = settings.whatsapp.replace(/[^0-9]/g, '');

  const navItems = [
    { label: 'Home', id: 'hero', route: '/' },
    { label: 'Train Booking', id: 'train-booking', route: '/train', icon: Train, highlight: true },
    { label: 'Live Status', id: 'live-train-status', route: '/live-train-status', icon: Activity },
    { label: 'PNR Check', id: 'pnr-status', route: '/pnr-status', icon: FileCheck },
    { label: 'Live Station', id: 'live-station', route: '/live-station', icon: Building },
    { label: 'Timetable', id: 'train-timetable', route: '/train-timetable', icon: CalendarDays },
    { label: 'Flights', id: 'flight-booking', icon: Plane },
    { label: 'Hotels', id: 'hotel-booking', icon: Building2 },
    { label: 'Buses', id: 'bus-booking', icon: Bus },
    { label: 'Packages', id: 'packages', icon: Compass },
    { label: 'Contact', id: 'contact' },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigateSection(id);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Announcement Bar */}
      {settings.announcementActive && settings.announcement && (
        <div className="bg-[#0B2545] text-white px-4 py-2 text-xs md:text-sm">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="font-medium text-slate-100">{settings.announcement}</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-200">
              <span className="hidden md:flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                <span>Pan-India Online Booking</span>
              </span>
              <span className="hidden lg:flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                <span>{settings.officeHours}</span>
              </span>
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-1 text-orange-300 hover:text-white transition-colors"
                title="Tap to Call"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{settings.phone}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('hero')}
            className="flex items-center text-left focus:outline-none shrink-0"
            aria-label="Aazam Travel Agency Home"
          >
            <Logo />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-0.5" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isRouteActive =
                (item.route && activeRoute === item.route) ||
                (item.id === 'hero' && currentPage === 'home' && activeRoute === '/');

              let buttonClass = 'text-slate-700 hover:text-[#0B2545] hover:bg-slate-100/70';
              if (isRouteActive && item.id !== 'hero') {
                buttonClass = 'bg-orange-500 text-white font-bold shadow-xs hover:bg-orange-600';
              } else if (item.highlight) {
                buttonClass = 'text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-semibold';
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-2.5 py-2 text-xs font-semibold transition-colors rounded-lg flex items-center gap-1.5 whitespace-nowrap ${buttonClass}`}
                >
                  {item.icon && <item.icon className="w-3.5 h-3.5 opacity-85" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            {/* WhatsApp Quick Action */}
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                'Hello Aazam Travel Agency, I need assistance with ticket booking.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all hover:shadow active:scale-95"
              title="Chat on WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* Tap to Call */}
            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#0B2545] bg-blue-50 hover:bg-blue-100/80 border border-blue-200 transition-colors"
              title="Call Directly"
            >
              <Phone className="w-3.5 h-3.5 text-[#0B2545]" />
              <span className="hidden 2xl:inline">{settings.phone}</span>
              <span className="2xl:hidden">Call</span>
            </a>

            {/* Primary Book Now CTA */}
            <button
              onClick={() => handleNavClick('train-booking')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#F97316] text-white hover:bg-orange-600 shadow-md shadow-orange-500/20 transition-all hover:shadow-lg active:scale-95"
            >
              <Train className="w-3.5 h-3.5" />
              <span>Book Now</span>
            </button>

            {/* Admin Portal Gateway */}
            <button
              onClick={isAdminLoggedIn ? onOpenAdminDashboard : onOpenAdminLogin}
              className={`p-2.5 rounded-xl border text-xs font-medium transition-colors ${
                isAdminLoggedIn
                  ? 'bg-blue-900 text-white border-blue-800'
                  : 'text-slate-500 hover:text-slate-800 border-slate-200 hover:bg-slate-100'
              }`}
              title={isAdminLoggedIn ? 'Open Admin Dashboard' : 'Admin Login'}
              aria-label="Admin Portal"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile / Tablet menu trigger */}
          <div className="flex items-center gap-2 xl:hidden">
            <a
              href={`https://wa.me/${cleanWhatsApp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-emerald-600 text-white md:hidden"
              aria-label="WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
            <a
              href={`tel:${cleanPhone}`}
              className="p-2 rounded-lg bg-blue-50 text-[#0B2545] border border-blue-200 md:hidden"
              aria-label="Call"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none border border-slate-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl max-h-[85vh] overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isRouteActive =
                (item.route && activeRoute === item.route) ||
                (item.id === 'hero' && currentPage === 'home' && activeRoute === '/');
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isRouteActive && item.id !== 'hero'
                      ? 'text-white bg-orange-500 font-bold shadow-xs'
                      : item.highlight
                      ? 'text-orange-600 bg-orange-50 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon && <item.icon className={`w-4 h-4 ${isRouteActive && item.id !== 'hero' ? 'text-white' : 'text-slate-500'}`} />}
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isRouteActive && item.id !== 'hero' ? 'text-white' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5">
            <button
              onClick={() => handleNavClick('train-booking')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-500 text-white font-bold text-sm shadow-md"
            >
              <Train className="w-4 h-4" />
              <span>Book Train Tickets</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                  'Hello Aazam Travel Agency, I want to make a travel enquiry.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp (+91 94215 56220)</span>
              </a>
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#0B2545] text-white font-semibold text-xs"
              >
                <Phone className="w-4 h-4" />
                <span>Call Now</span>
              </a>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (isAdminLoggedIn) onOpenAdminDashboard();
                else onOpenAdminLogin();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs text-slate-600 border border-slate-200 hover:bg-slate-50 mt-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isAdminLoggedIn ? 'Open Admin Dashboard' : 'Staff / Admin Portal'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

