import React from 'react';
import { ServiceItem } from '../types';
import { 
  Train, 
  Plane, 
  Bus, 
  Building2, 
  Compass, 
  MapPin, 
  MessageSquare, 
  ArrowRight,
  Check
} from 'lucide-react';

interface ServicesSectionProps {
  services: ServiceItem[];
  agencyWhatsApp: string;
  onSelectServiceForBooking: (serviceKey: string) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Train,
  Plane,
  Bus,
  Building2,
  Compass,
  MapPin,
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  agencyWhatsApp,
  onSelectServiceForBooking,
}) => {
  const cleanWhatsApp = agencyWhatsApp.replace(/[^0-9]/g, '');

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
            Complete Travel Solutions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2545] tracking-tight">
            Our Pan-India Online Travel Services
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            From seamless Indian Railways train booking assistance to domestic flights, luxury buses, verified hotels, and custom holiday tours.
          </p>
        </div>

        {/* 6 Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((srv) => {
            const IconComponent = ICON_MAP[srv.icon] || Compass;
            const isTrain = srv.key === 'train';

            const whatsappMessage = encodeURIComponent(
              `Hello Aazam Travel Agency, I am interested in ${srv.title} assistance. Please share availability and details.`
            );
            const waUrl = `https://wa.me/${cleanWhatsApp}?text=${whatsappMessage}`;

            return (
              <div
                key={srv.id}
                id={`services-${srv.key}`}
                className={`relative rounded-2xl p-7 transition-all duration-200 flex flex-col justify-between ${
                  isTrain
                    ? 'bg-gradient-to-b from-blue-50/70 to-white border-2 border-orange-400/80 shadow-lg shadow-orange-500/5'
                    : 'bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300'
                }`}
              >
                {isTrain && (
                  <div className="absolute -top-3 right-6 bg-orange-500 text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    Primary Service
                  </div>
                )}

                <div>
                  {/* Icon & Title */}
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`p-3 rounded-xl ${
                        isTrain
                          ? 'bg-[#0B2545] text-white shadow-md'
                          : 'bg-blue-50 text-[#0B2545]'
                      }`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#0B2545] leading-snug">
                        {srv.title}
                      </h3>
                      <span className="text-xs text-slate-600">100% Online Pan-India</span>
                    </div>
                  </div>

                  {/* Short Description */}
                  <p className="text-sm text-slate-600 mb-5 leading-relaxed font-normal">
                    {srv.shortDesc}
                  </p>

                  {/* Key Features Bullet List */}
                  {srv.features && srv.features.length > 0 && (
                    <ul className="space-y-2 mb-6 pt-3 border-t border-slate-100">
                      {srv.features.slice(0, 3).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSelectServiceForBooking(srv.key)}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-[#0B2545] bg-blue-50/80 hover:bg-blue-100 border border-blue-200/70 transition-colors"
                    >
                      <span>Fill Form</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
