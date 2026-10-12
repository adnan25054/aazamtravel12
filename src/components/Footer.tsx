import React from 'react';
import { Logo } from './Logo';
import { WebsiteSettings } from '../types';
import { 
  Phone, 
  MessageSquare, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Lock,
  ArrowUp
} from 'lucide-react';

interface FooterProps {
  settings: WebsiteSettings;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenAdminLogin: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenPrivacy,
  onOpenTerms,
  onOpenAdminLogin,
  onNavigateSection,
}) => {
  const cleanPhone = settings.phone.replace(/[^0-9]/g, '');
  const cleanWhatsApp = settings.whatsapp.replace(/[^0-9]/g, '');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#07192F] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Column 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo isDark={true} />
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mt-3">
              Aazam Travel Agency is your trusted Pan-India online destination for train ticket booking, flight ticket booking, bus ticket booking, hotel reservations, and complete customized travel packages across India.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={`https://wa.me/${cleanWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Desk</span>
              </a>
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-orange-400 text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Directly</span>
              </a>
            </div>
          </div>

          {/* Column 3: Travel Services */}
          <div>
            <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-4">
              Our Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigateSection('train-booking')}
                  className="hover:text-orange-400 transition-colors text-left"
                >
                  Train Ticket Booking (IRCTC)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('services-flight')}
                  className="hover:text-orange-400 transition-colors text-left"
                >
                  Flight Ticket Booking
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('services-bus')}
                  className="hover:text-orange-400 transition-colors text-left"
                >
                  Bus Ticket Booking (AC Sleeper)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('services-hotel')}
                  className="hover:text-orange-400 transition-colors text-left"
                >
                  Hotel Reservations
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('packages')}
                  className="hover:text-orange-400 transition-colors text-left"
                >
                  Tour Packages
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('services-religious')}
                  className="hover:text-orange-400 transition-colors text-left"
                >
                  Religious Tours & Pilgrimages
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Links & Legal */}
          <div>
            <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-4">
              Agency & Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigateSection('hero')}
                  className="hover:text-white transition-colors"
                >
                  Home Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact Office
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTerms}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Terms & Conditions</span>
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={onOpenAdminLogin}
                  className="text-xs text-slate-400 hover:text-orange-400 flex items-center gap-1.5 transition-colors"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin / Staff Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Office Location & Hours */}
          <div>
            <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-4">
              Online Travel Desk
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {settings.address}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <a href={`tel:${cleanPhone}`} className="hover:text-white">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>{settings.officeHours}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Scroll to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} <strong>Aazam Travel Agency</strong>. All rights reserved. Pan-India Online Booking & Digital Travel Desk.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-slate-400">
              Pan-India IRCTC Train Booking Assistance Desk
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Scroll to Top"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
