import React, { useState } from 'react';
import { TourPackage } from '../types';
import { 
  Compass, 
  Clock, 
  MapPin, 
  Check, 
  MessageSquare, 
  X, 
  Phone,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface TourPackagesSectionProps {
  packages: TourPackage[];
  agencyWhatsApp: string;
  agencyPhone: string;
  onBookPackage: (pkg: TourPackage) => void;
}

export const TourPackagesSection: React.FC<TourPackagesSectionProps> = ({
  packages,
  agencyWhatsApp,
  agencyPhone,
  onBookPackage,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePackageModal, setActivePackageModal] = useState<TourPackage | null>(null);

  const cleanWhatsApp = agencyWhatsApp.replace(/[^0-9]/g, '');

  const categories = ['All', 'Domestic', 'Religious', 'Holiday'];

  const filteredPackages = selectedCategory === 'All'
    ? packages
    : packages.filter((p) => p.category === selectedCategory);

  const handleOpenWhatsApp = (pkg: TourPackage) => {
    const text = encodeURIComponent(
      `Hello Aazam Travel Agency, I want to book the "${pkg.title}" (${pkg.duration}, ${pkg.destination}). Please share the latest pricing and booking details for our group.`
    );
    window.open(`https://wa.me/${cleanWhatsApp}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="packages" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
              Holiday & Pilgrimage Specials
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2545] tracking-tight">
              Featured Tour & Pilgrimage Packages
            </h2>
            <p className="mt-2 text-base text-slate-600 max-w-2xl">
              Carefully curated travel experiences with comfortable stays, train & flight bookings, and 24/7 dedicated online support for families and pilgrims across India.
            </p>
          </div>

          {/* Category Filter Tabs (Zero-pill button segmented controls) */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200 self-start md:self-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  selectedCategory === cat
                    ? 'bg-white text-[#0B2545] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg hover:border-slate-300 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image Banner */}
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  
                  {/* Category unboxed tag */}
                  <div className="absolute top-3 left-3 bg-[#0B2545]/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                    {pkg.category}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="flex items-center gap-1 font-medium drop-shadow-xs">
                      <Clock className="w-3.5 h-3.5 text-orange-400" />
                      {pkg.duration}
                    </span>
                    <span className="font-bold text-orange-300 drop-shadow-xs">
                      {pkg.startingPrice}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span className="truncate">{pkg.destination}</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0B2545] mb-2 leading-snug group-hover:text-orange-600 transition-colors">
                    {pkg.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed font-normal">
                    {pkg.description}
                  </p>

                  {/* Highlights Bullet Summary */}
                  {pkg.highlights && pkg.highlights.length > 0 && (
                    <div className="space-y-1.5 pt-3 border-t border-slate-100">
                      {pkg.highlights.slice(0, 2).map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{h}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0">
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setActivePackageModal(pkg)}
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-[#0B2545] bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => handleOpenWhatsApp(pkg)}
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-600">No packages found in this category.</p>
          </div>
        )}

      </div>

      {/* Package Detail Modal */}
      {activePackageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Header Image */}
            <div className="relative h-60 bg-slate-900">
              <img
                src={activePackageModal.image}
                alt={activePackageModal.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';
                }}
              />
              <button
                onClick={() => setActivePackageModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <div className="text-xs text-orange-300 font-bold uppercase tracking-wider mb-1">
                  {activePackageModal.category} Package · {activePackageModal.duration}
                </div>
                <h3 className="text-2xl font-black">{activePackageModal.title}</h3>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Destination & Starting Price */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-blue-50/70 border border-blue-200/60">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#0B2545]">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span>Destinations: {activePackageModal.destination}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Indicative Price</span>
                  <span className="text-base font-extrabold text-orange-600">{activePackageModal.startingPrice}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2">Package Overview</h4>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {activePackageModal.description}
                </p>
              </div>

              {/* Key Highlights */}
              {activePackageModal.highlights?.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2">Key Highlights</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activePackageModal.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Inclusions */}
              {activePackageModal.inclusions?.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2">What is Included</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activePackageModal.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <Sparkles className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const pkg = activePackageModal;
                    setActivePackageModal(null);
                    onBookPackage(pkg);
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#0B2545] bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
                >
                  Book Package Form
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenWhatsApp(activePackageModal)}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Book via WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
