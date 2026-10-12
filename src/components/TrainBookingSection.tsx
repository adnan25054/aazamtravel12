import React, { useState } from 'react';
import { submitEnquiry } from '../api';
import { Enquiry } from '../types';
import { StationAutocomplete } from './StationAutocomplete';
import { 
  Train, 
  Calendar, 
  Users, 
  MapPin, 
  Phone, 
  User, 
  AlertCircle, 
  ArrowRightLeft, 
  CheckCircle2, 
  Clock, 
  Send, 
  Info,
  Loader2
} from 'lucide-react';

interface TrainBookingSectionProps {
  agencyPhone: string;
  agencyWhatsApp: string;
  onEnquirySuccess: (data: { enquiry: Enquiry; whatsappUrl: string }) => void;
}

const COMMON_STATIONS = [
  'New Delhi (NDLS)',
  'Mumbai CSMT (CSMT)',
  'Indore Junction (INDB)',
  'Pune Junction (PUNE)',
  'Howrah Junction (HWH)',
  'Ahmedabad (ADI)',
  'Varanasi (BSB)',
  'Kanpur Central (CNB)',
  'Bengaluru (SBC)',
  'Chennai Central (MAS)',
  'Darbhanga (DBG)',
  'Shri Mata Vaishno Devi Katra (SVDK)',
];

const TRAIN_CLASSES = [
  { value: 'All Classes', label: 'All Classes' },
  { value: '3A - AC 3 Tier', label: '3A - AC 3 Tier' },
  { value: '2A - AC 2 Tier', label: '2A - AC 2 Tier' },
  { value: '1A - AC First Class', label: '1A - AC First Class' },
  { value: 'SL - Sleeper Class', label: 'SL - Sleeper Class' },
  { value: '3E - AC 3 Economy', label: '3E - AC 3 Economy' },
  { value: 'CC - AC Chair Car', label: 'CC - AC Chair Car' },
  { value: '2S - Second Sitting', label: '2S - Second Sitting' },
];

export const TrainBookingSection: React.FC<TrainBookingSectionProps> = ({
  agencyWhatsApp,
  onEnquirySuccess,
}) => {
  const [origin, setOrigin] = useState('New Delhi (NDLS)');
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState(() => {
    // Tomorrow as sensible default
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [passengers, setPassengers] = useState(1);
  const [preferredClass, setPreferredClass] = useState('3A - AC 3 Tier');
  const [quotaPreference, setQuotaPreference] = useState('General Quota');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const swapStations = () => {
    const temp = origin;
    setOrigin(destination || 'New Delhi (NDLS)');
    setDestination(temp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim()) {
      setError('Please provide your full name so our booking team can assist you.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 10) {
      setError('Please provide a valid 10-digit mobile number for WhatsApp assistance.');
      return;
    }
    if (!origin.trim()) {
      setError('Please enter the origin boarding station.');
      return;
    }
    if (!destination.trim()) {
      setError('Please enter the destination station.');
      return;
    }
    if (!travelDate) {
      setError('Please select your journey date.');
      return;
    }

    setLoading(true);
    try {
      const response = await submitEnquiry({
        serviceType: 'train',
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        origin: origin.trim(),
        destination: destination.trim(),
        travelDate,
        passengers: Number(passengers),
        preferredClass: `${preferredClass} (${quotaPreference})`,
        specialRequests: specialRequests.trim() || undefined,
      });

      onEnquirySuccess({
        enquiry: response.enquiry,
        whatsappUrl: response.whatsappUrl,
      });
    } catch (err: any) {
      setError(err.message || 'Unable to submit booking enquiry. Please try again or WhatsApp directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="train-booking" className="py-16 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
            <Train className="w-4 h-4" />
            <span>⚡ Pan-India Online Ticket Booking Desk</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2545] tracking-tight">
            Indian Railways Train Ticket Booking (All India)
          </h2>
          <p className="mt-3 text-base text-slate-600">
            100% Online railway reservation assistance for all 7,000+ stations across India. 
            Submit your journey requirements to receive immediate confirmation and confirmed IRCTC e-tickets delivered straight to WhatsApp.
          </p>
        </div>

        {/* Primary Booking Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden max-w-4xl mx-auto">
          {/* Card Top Banner with Railway Guidance */}
          <div className="bg-gradient-to-r from-[#0B2545] to-[#134074] text-white px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/10 text-orange-400">
                <Train className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">100% Online Railway Ticket Booking</h3>
                <p className="text-xs text-slate-300">Fast online processing · Direct WhatsApp delivery · Zero office visit needed</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-orange-300 bg-white/10 px-3 py-1.5 rounded-lg">
              <Clock className="w-4 h-4 text-orange-400" />
              <span>Tatkal & General Quota (All Routes)</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Online Order Assurance Banner */}
            <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-900 flex items-center gap-2.5">
              <span className="p-1 rounded-md bg-orange-500 text-white font-bold text-[10px] shrink-0">ONLINE ORDER</span>
              <span className="font-medium">
                No physical visit required. Submit journey details below ➔ verify seats on WhatsApp ➔ pay securely via UPI/GPay ➔ receive confirmed IRCTC E-Ticket with PNR.
              </span>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
                <div>
                  <p className="font-semibold">Check required details</p>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Station Origins & Destination */}
            <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
              {/* Origin */}
              <div className="md:col-span-5 space-y-1.5">
                <StationAutocomplete
                  label="From (Origin Station)"
                  value={origin}
                  onChange={(val) => setOrigin(val)}
                  placeholder="e.g. New Delhi (NDLS), Mumbai CSMT"
                  icon="origin"
                  required
                  showPopularChips
                  inputClassName="py-3"
                />
              </div>

              {/* Swap Button */}
              <div className="md:col-span-1 flex justify-center pt-2 md:pt-6">
                <button
                  type="button"
                  onClick={swapStations}
                  className="p-2.5 rounded-full border border-slate-300 hover:border-orange-400 hover:bg-orange-50 text-slate-600 hover:text-orange-600 transition-colors shadow-xs"
                  title="Swap Origin and Destination"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Destination */}
              <div className="md:col-span-5 space-y-1.5">
                <StationAutocomplete
                  label="To (Destination Station)"
                  value={destination}
                  onChange={(val) => setDestination(val)}
                  placeholder="e.g. Mumbai CSMT, Pune Jn, Howrah"
                  icon="destination"
                  required
                  showPopularChips
                  inputClassName="py-3"
                />
              </div>
            </div>

            {/* Quick Stations Selector */}
            <div className="pt-1">
              <span className="text-xs font-medium text-slate-500 mr-2">Popular destinations:</span>
              <div className="inline-flex flex-wrap gap-1.5 mt-1">
                {COMMON_STATIONS.slice(1, 7).map((stn) => (
                  <button
                    key={stn}
                    type="button"
                    onClick={() => setDestination(stn)}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-orange-50 hover:text-orange-700 text-slate-700 border border-slate-200 transition-colors"
                  >
                    {stn.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Journey Date, Passengers, Preferred Class, Quota */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Journey Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={travelDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm text-slate-800 font-medium"
                  />
                </div>
              </div>

              {/* Passengers */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Passengers Count *
                </label>
                <div className="relative">
                  <Users className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={passengers}
                    onChange={(e) => setPassengers(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm text-slate-800 font-medium"
                  />
                </div>
              </div>

              {/* Preferred Class */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Preferred Class *
                </label>
                <select
                  value={preferredClass}
                  onChange={(e) => setPreferredClass(e.target.value)}
                  className="w-full px-3 py-3 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm text-slate-800 font-medium bg-white"
                >
                  {TRAIN_CLASSES.map((cls) => (
                    <option key={cls.value} value={cls.value}>
                      {cls.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quota */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Quota Category
                </label>
                <select
                  value={quotaPreference}
                  onChange={(e) => setQuotaPreference(e.target.value)}
                  className="w-full px-3 py-3 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm text-slate-800 font-medium bg-white"
                >
                  <option value="General Quota">General (GN)</option>
                  <option value="Tatkal Quota">Tatkal (CK)</option>
                  <option value="Premium Tatkal">Premium Tatkal (PT)</option>
                  <option value="Senior Citizen">Senior Citizen (SS)</option>
                  <option value="Ladies Quota">Ladies Quota (LD)</option>
                </select>
              </div>
            </div>

            {/* Passenger Contact Details */}
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span>Passenger Contact Details</span>
                <span className="text-xs text-slate-500 font-normal">(Required to communicate booking status)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Mohd Aazam"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">
                    Phone / WhatsApp Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-emerald-600" />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. +91 94215 56220"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. passenger@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Special Preferences (Berth, train preference) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700">
                Preferred Train or Berth Request (Optional)
              </label>
              <input
                type="text"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g. Prefer 12106 Vidarbha Express or Garib Rath, Lower berth for senior citizen"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm text-slate-800"
              />
            </div>

            {/* Clear Transparent Railway Booking Notice */}
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs sm:text-sm leading-relaxed flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Transparent Service Information:</span> This form registers your railway journey requirements directly with Aazam Travel Agency for 100% online reservation across all Indian railway stations. Actual ticket issuance and seat reservation are subject to authorized Indian Railways / IRCTC availability and official quota rules. Submitting will register your booking request and generate a direct WhatsApp message to our desk.
              </div>
            </div>

            {/* Submit & WhatsApp Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Pan-India Online WhatsApp Desk: +91 94215 56220</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 transition-all hover:translate-y-[-1px] disabled:opacity-70 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Booking Request...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit & Book via WhatsApp</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
