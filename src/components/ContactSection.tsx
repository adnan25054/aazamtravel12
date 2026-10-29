import React, { useState, useEffect } from 'react';
import { submitEnquiry } from '../api';
import { Enquiry, ServiceType, WebsiteSettings } from '../types';
import { StationAutocomplete } from './StationAutocomplete';
import { OFFICIAL_LOGO_URL } from './Logo';
import { 
  Phone, 
  MessageSquare, 
  MapPin, 
  Mail, 
  Clock, 
  Send, 
  Calendar, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  HelpCircle
} from 'lucide-react';

interface ContactSectionProps {
  settings: WebsiteSettings;
  preselectedService?: ServiceType;
  onEnquirySuccess: (data: { enquiry: Enquiry; whatsappUrl: string }) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  settings,
  preselectedService,
  onEnquirySuccess,
}) => {
  const [serviceType, setServiceType] = useState<ServiceType>('train');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [passengers, setPassengers] = useState(1);
  const [preferredClass, setPreferredClass] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedService) {
      setServiceType(preselectedService);
    }
  }, [preselectedService]);

  const cleanPhone = settings.phone.replace(/[^0-9]/g, '');
  const cleanWhatsApp = settings.whatsapp.replace(/[^0-9]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 10) {
      setError('Please provide a valid contact number (at least 10 digits).');
      return;
    }
    if (!origin.trim()) {
      setError('Departure origin is required.');
      return;
    }
    if (!destination.trim()) {
      setError('Destination is required.');
      return;
    }
    if (!travelDate) {
      setError('Travel date is required.');
      return;
    }

    setLoading(true);
    try {
      const response = await submitEnquiry({
        serviceType,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        origin: origin.trim(),
        destination: destination.trim(),
        travelDate,
        passengers: Number(passengers),
        preferredClass: preferredClass.trim() || undefined,
        specialRequests: specialRequests.trim() || undefined,
      });

      onEnquirySuccess({
        enquiry: response.enquiry,
        whatsappUrl: response.whatsappUrl,
      });
    } catch (err: any) {
      setError(err.message || 'Error submitting enquiry. Please try again or WhatsApp directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
            Pan-India Online Booking & Digital Travel Desk
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2545] tracking-tight">
            Contact & Book Online with Aazam Travel Agency
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Order your tickets online from any city or state across India. We verify reservations instantly and dispatch confirmed E-Tickets straight to your WhatsApp & Email.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Business Information & Direct Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0B2545] text-white rounded-2xl p-7 shadow-lg">
              <div className="flex items-center gap-3.5 mb-5 pb-5 border-b border-white/10">
                <div className="bg-white p-1.5 rounded-2xl shrink-0 ring-2 ring-amber-400/50">
                  <img
                    src={OFFICIAL_LOGO_URL}
                    alt="Aazam Travel Agency Official Logo"
                    className="h-14 w-auto object-contain rounded-xl shadow-xs"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold leading-tight">Aazam Travel Agency</h3>
                  <p className="text-xs text-orange-300 font-semibold mt-0.5">
                    Pan-India Online Travel Agent · Serving All India
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-200">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-white">Operations & Online Desk</span>
                    <span className="text-xs text-slate-300 leading-relaxed">
                      {settings.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-white">Phone Support</span>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="text-xs text-orange-300 hover:text-white transition-colors block"
                    >
                      {settings.phone} (Tap to Call)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-white">WhatsApp Assistance</span>
                    <a
                      href={`https://wa.me/${cleanWhatsApp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-300 hover:text-white transition-colors block"
                    >
                      {settings.whatsapp} (Chat Now)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-white">Business Hours</span>
                    <span className="text-xs text-slate-300">
                      {settings.officeHours}
                    </span>
                  </div>
                </div>

                {settings.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-white">Email</span>
                      <a
                        href={`mailto:${settings.email}`}
                        className="text-xs text-slate-300 hover:text-white transition-colors"
                      >
                        {settings.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Quick Actions */}
              <div className="mt-8 pt-6 border-t border-slate-700/80 grid grid-cols-2 gap-3">
                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                    'Hello Aazam Travel Agency, I want to book travel tickets.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Chat</span>
                </a>
                <a
                  href={`tel:${cleanPhone}`}
                  className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Directly</span>
                </a>
              </div>
            </div>

            {/* Service Notice Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Booking Process & Confirmation</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Online submissions create a priority reservation request with our 24/7 Pan-India online booking desk. Fares, train berths, and seats are verified through official systems and confirmed with you on WhatsApp.
              </p>
            </div>
          </div>

          {/* Right Column: Universal Booking Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-lg">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-[#0B2545]">
                  Book Your Journey
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Fill in your journey requirements. Submitting validates your request and generates a prefilled message for our WhatsApp booking desk.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name & Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Rahul Patil"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. +91 94215 56220"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm text-slate-800"
                    />
                  </div>
                </div>

                {/* Service Type Selection */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Service Type *
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value as ServiceType)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm text-slate-800 bg-white"
                  >
                    <option value="train">Train Ticket Booking (IRCTC Assistance)</option>
                    <option value="flight">Flight Ticket Booking (Domestic / International)</option>
                    <option value="bus">Bus Ticket Booking (AC Sleeper / Seater)</option>
                    <option value="hotel">Hotel Reservations</option>
                    <option value="tour">Holiday Tour Package</option>
                    <option value="religious">Religious Tour (Umrah / Pilgrimage)</option>
                  </select>
                </div>

                {/* Journey Origin & Destination */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <StationAutocomplete
                      label="Journey Origin (From)"
                      value={origin}
                      onChange={(val) => setOrigin(val)}
                      placeholder="e.g. New Delhi (NDLS), Indore (INDB)"
                      icon="origin"
                      required
                      showPopularChips
                    />
                  </div>

                  <div className="space-y-1.5">
                    <StationAutocomplete
                      label="Destination (To)"
                      value={destination}
                      onChange={(val) => setDestination(val)}
                      placeholder="e.g. Mumbai CSMT, Pune Jn, Srinagar"
                      icon="destination"
                      required
                      showPopularChips
                    />
                  </div>
                </div>

                {/* Travel Date & Number of Passengers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Travel Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="date"
                        required
                        value={travelDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Number of Passengers *
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={passengers}
                        onChange={(e) => setPassengers(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Preferred Class or Category */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Preferred Class / Accommodation Type
                  </label>
                  <input
                    type="text"
                    value={preferredClass}
                    onChange={(e) => setPreferredClass(e.target.value)}
                    placeholder="e.g. 3A AC, Sleeper, Deluxe Room, Economy Flight"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm text-slate-800"
                  />
                </div>

                {/* Additional Requirements */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Additional Requirements / Special Notes
                  </label>
                  <textarea
                    rows={3}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Provide train name preference, hotel location requirements, senior citizen lower berth requests, etc."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm text-slate-800"
                  />
                </div>

                {/* WhatsApp Handover Notice */}
                <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    When you submit, your booking request will be registered and WhatsApp will open with your details prefilled for +91 94215 56220 to complete your reservation.
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl font-bold text-sm bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 transition-all hover:translate-y-[-1px] disabled:opacity-75"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Validating & Registering Booking...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit & Book via WhatsApp</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
