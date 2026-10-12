import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  submitEnquiry, 
  fetchLiveTrainStatus, 
  searchStationAutocomplete,
  fetchTrainSchedule,
  fetchRailRadarLiveTrain,
  fetchRailRadarLiveStation,
} from '../api';
import { 
  Enquiry, 
  PassengerDetail, 
  LiveTrainStatusResponse, 
  StationAutocompleteItem,
  TrainScheduleResponse,
  RailRadarLiveTrainResponse,
  RailRadarLiveStationResponse,
} from '../types';
import { Logo } from './Logo';
import { TrainStationBoard } from './TrainStationBoard';
import { StationAutocomplete } from './StationAutocomplete';
import { StationSearchBar } from './StationSearchBar';
import { 
  Train, 
  Calendar, 
  Users, 
  MapPin, 
  Phone, 
  AlertCircle, 
  ArrowRightLeft, 
  CheckCircle2, 
  Clock, 
  Send, 
  Loader2, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  ChevronRight, 
  HelpCircle, 
  ArrowRight, 
  MessageSquare, 
  Home,
  Activity,
  FileCheck,
  Search,
  Navigation,
  Compass,
  AlertTriangle,
  Gauge,
  Milestone,
  CalendarDays,
  Layers,
  Filter,
  Radio,
  Eye,
  Check,
  Building,
  Info
} from 'lucide-react';

interface TrainPageProps {
  agencyPhone: string;
  agencyWhatsApp: string;
  onEnquirySuccess: (data: { enquiry: Enquiry; whatsappUrl: string }) => void;
  onNavigateHome: () => void;
  onNavigateSection: (sectionId: string) => void;
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
  'Darbhanga Junction (DBG)',
  'Shri Mata Vaishno Devi Katra (SVDK)',
  'Hazrat Nizamuddin (NZM)',
  'Bhopal Junction (BPL)',
  'Jaipur Junction (JP)',
  'Patna Junction (PNBE)',
  'Vadodara Junction (BRC)',
  'Ujjain Junction (UJN)'
];

const TRAIN_CLASSES = [
  { value: 'All Classes', label: 'All Classes (Best Available)' },
  { value: '3A - AC 3 Tier', label: '3A - AC 3 Tier' },
  { value: '2A - AC 2 Tier', label: '2A - AC 2 Tier' },
  { value: '1A - AC First Class', label: '1A - AC First Class' },
  { value: 'SL - Sleeper Class', label: 'SL - Sleeper Class' },
  { value: '3E - AC 3 Economy', label: '3E - AC 3 Economy' },
  { value: 'CC - AC Chair Car', label: 'CC - AC Chair Car' },
  { value: '2S - Second Sitting', label: '2S - Second Sitting' },
];

const QUOTA_OPTIONS = [
  { value: 'GN - General Quota', label: 'General Quota (GN)' },
  { value: 'TQ - Tatkal Quota', label: 'Tatkal Quota (TQ)' },
  { value: 'PT - Premium Tatkal', label: 'Premium Tatkal (PT)' },
  { value: 'LD - Ladies Quota', label: 'Ladies Quota (LD)' },
  { value: 'SS - Senior Citizen', label: 'Senior Citizen (SS)' },
  { value: 'HP - Divyangjan / PwD', label: 'Divyangjan / PwD (HP)' },
];

const BERTH_OPTIONS = [
  'No Preference',
  'Lower Berth',
  'Middle Berth',
  'Upper Berth',
  'Side Lower',
  'Side Upper',
  'Window Seat (Chair Car)',
  'Aisle Seat (Chair Car)'
];

interface PopularTrain {
  number: string;
  name: string;
  from: string;
  to: string;
  runsOn: string;
  classes: string;
  departure: string;
  arrival: string;
  duration: string;
}

const POPULAR_TRAINS: PopularTrain[] = [
  {
    number: '12919',
    name: 'Malwa SF Express',
    from: 'Indore Junction (INDB)',
    to: 'Shri Mata Vaishno Devi Katra (SVDK)',
    runsOn: 'Daily',
    classes: '1A, 2A, 3A, SL',
    departure: '23:55 (Indore)',
    arrival: '06:35 (Katra)',
    duration: '30h 40m',
  },
  {
    number: '12952',
    name: 'Mumbai Rajdhani Express',
    from: 'New Delhi (NDLS)',
    to: 'Mumbai Central (MMCT)',
    runsOn: 'Daily',
    classes: '1A, 2A, 3A',
    departure: '16:55 (Delhi)',
    arrival: '08:35 (Mumbai)',
    duration: '15h 40m',
  },
  {
    number: '12565',
    name: 'Bihar Sampark Kranti Express',
    from: 'Darbhanga Junction (DBG)',
    to: 'New Delhi (NDLS)',
    runsOn: 'Daily',
    classes: '1A, 2A, 3A, SL',
    departure: '08:25 (Darbhanga)',
    arrival: '05:30 (New Delhi)',
    duration: '21h 05m',
  },
  {
    number: '22436',
    name: 'Vande Bharat Express',
    from: 'New Delhi (NDLS)',
    to: 'Varanasi Junction (BSB)',
    runsOn: 'Tue, Wed, Fri, Sat, Sun',
    classes: 'CC, EC',
    departure: '06:00 (Delhi)',
    arrival: '14:00 (Varanasi)',
    duration: '8h 00m',
  },
  {
    number: '12860',
    name: 'Gitanjali Superfast Express',
    from: 'Howrah Junction (HWH)',
    to: 'Mumbai CSMT (CSMT)',
    runsOn: 'Daily',
    classes: '2A, 3A, SL',
    departure: '14:05 (Howrah)',
    arrival: '21:20 (Mumbai)',
    duration: '31h 15m',
  },
  {
    number: '12626',
    name: 'Kerala Express',
    from: 'New Delhi (NDLS)',
    to: 'Thiruvananthapuram (TVC)',
    runsOn: 'Daily',
    classes: '2A, 3A, SL',
    departure: '20:10 (Delhi)',
    arrival: '22:10 (Trivandrum)',
    duration: '50h 00m',
  },
];

type ActiveTrainTab = 'booking' | 'live-status' | 'live-station' | 'schedule' | 'station-search';

export const TrainPage: React.FC<TrainPageProps> = ({
  agencyPhone,
  agencyWhatsApp,
  onEnquirySuccess,
  onNavigateHome,
}) => {
  // Top level active tool tab: Booking | Live Status | Live Station | Timetable
  const [activeTab, setActiveTab] = useState<ActiveTrainTab>('booking');

  // ==========================================
  // Booking Form State
  // ==========================================
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip'>('oneway');
  const [origin, setOrigin] = useState('New Delhi (NDLS)');
  const [destination, setDestination] = useState('');
  
  const [travelDate, setTravelDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });

  const [preferredClass, setPreferredClass] = useState('All Classes');
  const [quota, setQuota] = useState('GN - General Quota');
  const [preferredTrain, setPreferredTrain] = useState('');

  // Primary Passenger
  const [primaryName, setPrimaryName] = useState('');
  const [primaryAge, setPrimaryAge] = useState('');
  const [primaryGender, setPrimaryGender] = useState<'Male' | 'Female' | 'Transgender'>('Male');
  const [primaryBerth, setPrimaryBerth] = useState('No Preference');
  const [primarySeniorCitizen, setPrimarySeniorCitizen] = useState(false);

  // Other Passengers
  const [otherPassengers, setOtherPassengers] = useState<PassengerDetail[]>([]);

  // Customer Contact
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Station Autocomplete Suggestions
  const [originSuggestions, setOriginSuggestions] = useState<StationAutocompleteItem[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<StationAutocompleteItem[]>([]);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  const originRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  // Booking UI state
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // ==========================================
  // Live Train Status State
  // ==========================================
  const [liveTrainNumber, setLiveTrainNumber] = useState('12565');
  const [liveDate, setLiveDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [liveStatusLoading, setLiveStatusLoading] = useState(false);
  const [liveStatusError, setLiveStatusError] = useState<string | null>(null);
  const [liveStatusData, setLiveStatusData] = useState<LiveTrainStatusResponse | null>(null);

  // Station Board & Coach Selection State
  const [stationBoardFilter, setStationBoardFilter] = useState<'all' | 'departures' | 'arrivals' | 'ontime' | 'delayed'>('all');
  const [selectedBerth, setSelectedBerth] = useState<{ number: number; type: string; name: string } | null>(null);

  // ==========================================
  // Train Schedule & Timetable State (RailRadar API)
  // ==========================================
  const [scheduleTrainNumber, setScheduleTrainNumber] = useState('12919');
  const [scheduleHaltsOnly, setScheduleHaltsOnly] = useState(true);
  const [scheduleFilterText, setScheduleFilterText] = useState('');
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [scheduleData, setScheduleData] = useState<TrainScheduleResponse | null>(null);

  // ==========================================
  // RailRadar Live GPS Train Tracker State
  // ==========================================
  const [railRadarTrainNumber, setRailRadarTrainNumber] = useState('12919');
  const [railRadarLiveLoading, setRailRadarLiveLoading] = useState(false);
  const [railRadarLiveError, setRailRadarLiveError] = useState<string | null>(null);
  const [railRadarLiveData, setRailRadarLiveData] = useState<RailRadarLiveTrainResponse | null>(null);

  // ==========================================
  // RailRadar Live Station Board State
  // ==========================================
  const [stationBoardCode, setStationBoardCode] = useState('INDB');
  const [stationBoardHours, setStationBoardHours] = useState(4);
  const [stationBoardLoading, setStationBoardLoading] = useState(false);
  const [stationBoardError, setStationBoardError] = useState<string | null>(null);
  const [stationBoardData, setStationBoardData] = useState<RailRadarLiveStationResponse | null>(null);


  const cleanPhone = agencyPhone.replace(/[^0-9]/g, '');
  const cleanWhatsApp = agencyWhatsApp.replace(/[^0-9]/g, '');
  const totalPassengersCount = 1 + otherPassengers.length;

  // Station Autocomplete Debounced Search
  useEffect(() => {
    if (!origin || origin.length < 2) {
      setOriginSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const results = await searchStationAutocomplete(origin);
        setOriginSuggestions(results);
      } catch {
        setOriginSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [origin]);

  useEffect(() => {
    if (!destination || destination.length < 2) {
      setDestinationSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const results = await searchStationAutocomplete(destination);
        setDestinationSuggestions(results);
      } catch {
        setDestinationSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [destination]);

  // Click outside to close station suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (originRef.current && !originRef.current.contains(e.target as Node)) {
        setShowOriginDropdown(false);
      }
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setShowDestDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwapStations = () => {
    const temp = origin;
    setOrigin(destination || 'New Delhi (NDLS)');
    setDestination(temp);
  };

  const handleSetQuickDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    setTravelDate(d.toISOString().split('T')[0]);
  };

  const handleAddOtherPassenger = () => {
    if (otherPassengers.length >= 5) {
      alert('IRCTC allows a maximum of 6 passengers per single booking form.');
      return;
    }
    const newPassenger: PassengerDetail = {
      id: `pax-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: '',
      age: '',
      gender: 'Male',
      berthPreference: 'No Preference',
      seniorCitizen: false,
    };
    setOtherPassengers([...otherPassengers, newPassenger]);
  };

  const handleRemoveOtherPassenger = (id: string) => {
    setOtherPassengers(otherPassengers.filter((p) => p.id !== id));
  };

  const handleUpdateOtherPassenger = (
    id: string,
    field: keyof PassengerDetail,
    value: any
  ) => {
    setOtherPassengers(
      otherPassengers.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSelectPopularTrain = (t: PopularTrain) => {
    setOrigin(t.from);
    setDestination(t.to);
    setPreferredTrain(`${t.number} - ${t.name}`);
    setActiveTab('booking');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  // Submit Booking Form
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    if (!origin.trim() || !destination.trim()) {
      setBookingError('Please provide both Boarding Station and Destination Station.');
      return;
    }

    if (!primaryName.trim()) {
      setBookingError('Please provide Passenger 1 (Primary Passenger) Name.');
      return;
    }

    if (!primaryAge.trim() || isNaN(Number(primaryAge)) || Number(primaryAge) < 1) {
      setBookingError('Please provide a valid Age for Passenger 1.');
      return;
    }

    for (let i = 0; i < otherPassengers.length; i++) {
      const p = otherPassengers[i];
      if (!p.name.trim()) {
        setBookingError(`Please enter the full name for Passenger ${i + 2}.`);
        return;
      }
      if (!p.age.trim() || isNaN(Number(p.age)) || Number(p.age) < 1) {
        setBookingError(`Please enter a valid age for Passenger ${i + 2}.`);
        return;
      }
    }

    if (!customerPhone.trim() || customerPhone.replace(/[^0-9]/g, '').length < 10) {
      setBookingError('Please enter a valid 10-digit WhatsApp phone number.');
      return;
    }

    setBookingLoading(true);

    try {
      const allPassengers: PassengerDetail[] = [
        {
          id: 'pax-primary',
          name: primaryName.trim(),
          age: primaryAge.trim(),
          gender: primaryGender,
          berthPreference: primaryBerth,
          seniorCitizen: primarySeniorCitizen,
        },
        ...otherPassengers.map((p) => ({
          ...p,
          name: p.name.trim(),
          age: p.age.trim(),
        })),
      ];

      const payload: Partial<Enquiry> = {
        serviceType: 'train',
        customerName: primaryName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        origin: origin.trim(),
        destination: destination.trim(),
        travelDate,
        returnDate: tripType === 'roundtrip' ? returnDate : undefined,
        passengers: totalPassengersCount,
        passengerList: allPassengers,
        preferredClass,
        quota,
        tripType,
        specialRequests: [
          preferredTrain ? `Preferred Train: ${preferredTrain}` : '',
          specialRequests ? `Notes: ${specialRequests}` : '',
        ]
          .filter(Boolean)
          .join(' | ') || undefined,
      };

      const result = await submitEnquiry(payload);
      onEnquirySuccess(result);
    } catch (err: any) {
      console.error('Error submitting train booking:', err);
      setBookingError(err.message || 'Failed to submit train booking request. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  // Check Live Train Status
  const handleCheckLiveStatus = async (trainNo?: string) => {
    const targetTrain = trainNo || liveTrainNumber;
    if (!targetTrain || !targetTrain.trim()) {
      setLiveStatusError('Please enter a 5-digit Train Number (e.g. 12565, 12140).');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (liveDate > todayStr) {
      setLiveStatusError('Live train status is not available for future dates. Live running status only applies to trains running today or recent days.');
      return;
    }

    setLiveStatusLoading(true);
    setLiveStatusError(null);

    // Format YYYYMMDD
    const dateFormatted = liveDate.replace(/-/g, '');

    try {
      const res = await fetchLiveTrainStatus(targetTrain.trim(), dateFormatted);
      setLiveStatusData(res);
    } catch (err: any) {
      console.error('Error checking live train status:', err);
      setLiveStatusError(err.message || 'Could not fetch live train status. Please verify train number.');
    } finally {
      setLiveStatusLoading(false);
    }
  };


  // Check Train Schedule & Timetable (RailRadar API)
  const handleCheckSchedule = async (numToUse?: string, haltsOnlyOverride?: boolean) => {
    const target = (numToUse || scheduleTrainNumber).trim().replace(/[^0-9]/g, '');
    if (!target || target.length < 4) {
      setScheduleError('Please enter a valid 5-digit Indian Railways train number (e.g. 12919 or 12140).');
      return;
    }

    setScheduleLoading(true);
    setScheduleError(null);

    const useHalts = haltsOnlyOverride !== undefined ? haltsOnlyOverride : scheduleHaltsOnly;

    try {
      const res = await fetchTrainSchedule(target, useHalts);
      if (res && res.success) {
        setScheduleData(res);
      } else {
        setScheduleError(res.error || 'Could not retrieve timetable for this train.');
      }
    } catch (err: any) {
      console.error('Error fetching train schedule:', err);
      setScheduleError(err.message || 'Could not retrieve train timetable. Please verify train number.');
    } finally {
      setScheduleLoading(false);
    }
  };

  // RailRadar Live Train GPS Status Handler (GET /v1/trains/{number}/live)
  const handleCheckRailRadarLiveTrain = async (numToUse?: string) => {
    const target = (numToUse || railRadarTrainNumber).trim().replace(/[^0-9]/g, '');
    if (!target) {
      setRailRadarLiveError('Please enter a valid train number (e.g. 12919 or 12952).');
      return;
    }
    setRailRadarLiveLoading(true);
    setRailRadarLiveError(null);
    try {
      const res = await fetchRailRadarLiveTrain(target);
      if (res && res.success) {
        setRailRadarLiveData(res);
      } else {
        setRailRadarLiveError(res.error || 'Could not retrieve live GPS tracking data.');
      }
    } catch (err: any) {
      console.error('Error fetching RailRadar live train:', err);
      setRailRadarLiveError(err.message || 'Could not connect to RailRadar live tracker.');
    } finally {
      setRailRadarLiveLoading(false);
    }
  };

  // RailRadar Live Station Board Handler (GET /v1/stations/{code}/live?hours=4)
  const handleCheckStationBoard = async (stnCode?: string, hoursOverride?: number) => {
    const target = (stnCode || stationBoardCode).trim().toUpperCase();
    if (!target) {
      setStationBoardError('Please enter a station code (e.g. INDB, NDLS, CSMT).');
      return;
    }
    const hrs = hoursOverride !== undefined ? hoursOverride : stationBoardHours;
    setStationBoardLoading(true);
    setStationBoardError(null);
    try {
      const res = await fetchRailRadarLiveStation(target, hrs);
      if (res && res.success) {
        setStationBoardData(res);
      } else {
        setStationBoardError(res.error || 'Could not retrieve live station board.');
      }
    } catch (err: any) {
      console.error('Error fetching RailRadar station board:', err);
      setStationBoardError(err.message || 'Could not connect to RailRadar station board.');
    } finally {
      setStationBoardLoading(false);
    }
  };


  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Breadcrumb Navigation with Official Agency Logo */}
      <nav aria-label="Breadcrumb" className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2 hover:opacity-90 transition-opacity"
              title="Return to Home"
            >
              <Logo iconClassName="h-8 sm:h-9 w-auto" />
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden md:inline" />
            <div className="hidden md:flex items-center gap-1.5 text-slate-500 font-medium">
              <span className="font-bold text-slate-700">
                Official Train Ticket Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>100% Online IRCTC Desk · Pan-India</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B2545] via-[#133E68] to-[#1B4965] text-white py-10 lg:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-3xl">
              {/* Brand Header with Official Logo */}
              <div className="flex items-start sm:items-center gap-4 mb-4">
                <img
                  src="/logo.svg"
                  alt="Aazam Travel Agency Official Logo"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0 drop-shadow-xl rounded-2xl bg-white/10 p-2 border border-white/20"
                />
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/40 text-orange-300 text-xs font-bold mb-1 backdrop-blur-sm">
                    <Train className="w-3.5 h-3.5 text-orange-400" />
                    <span>Aazam Travel Agency · Pan-India Online Booking</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                    IRCTC Train Ticket Reservation, Live Status & Timetable Desk
                  </h1>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-6">
                Official online railway portal for travelers across India: 
                instant ticket reservation with <strong>multi-passenger manifests</strong>, 
                real-time <strong>Live Train Running Status (GPS)</strong>, <strong>Live Station Arrivals Board</strong>, and 
                complete <strong>Train Schedules & Route Timetables</strong> via RailRadar API.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15">
                  <span className="text-[10px] text-orange-300 font-bold uppercase tracking-wider block">Tatkal Timings</span>
                  <span className="text-sm font-black text-white">10 AM AC · 11 AM SL</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15">
                  <span className="text-[10px] text-orange-300 font-bold uppercase tracking-wider block">Online Coverage</span>
                  <span className="text-sm font-black text-white">All 7,000+ Stations</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15">
                  <span className="text-[10px] text-orange-300 font-bold uppercase tracking-wider block">Official APIs</span>
                  <span className="text-sm font-black text-white">RailRadar & IndianRail</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15">
                  <span className="text-[10px] text-orange-300 font-bold uppercase tracking-wider block">Desk Helpline</span>
                  <a href={`tel:${cleanPhone}`} className="text-sm font-black text-orange-300 hover:text-white transition-colors">
                    {agencyPhone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Interactive Tabs: Booking | Live Train Status | PNR Check */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden">
          
          {/* Tab Navigation Header */}
          <div className="bg-slate-900 border-b border-slate-800 p-2 sm:p-3 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setActiveTab('booking')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'booking'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Train className="w-4 h-4" />
                <span>1. Book Tickets (Online)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('live-status');
                  if (!railRadarLiveData) handleCheckRailRadarLiveTrain('12919');
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'live-status'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>2. Live GPS Tracker</span>
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-500 text-white text-[9px] font-black uppercase">
                  RailRadar
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('live-station');
                  if (!stationBoardData) handleCheckStationBoard('INDB', 4);
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'live-station'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>3. Station Live Board</span>
                <span className="px-1.5 py-0.5 rounded-md bg-sky-500 text-white text-[9px] font-black uppercase">
                  RailRadar
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('schedule');
                  if (!scheduleData) handleCheckSchedule('12919');
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'schedule'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                <span>4. Timetable</span>
                <span className="px-1.5 py-0.5 rounded-md bg-indigo-500 text-white text-[9px] font-black uppercase">
                  RailRadar
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('station-search')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'station-search'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Search className="w-4 h-4" />
                <span>5. All Stations & Codes</span>
                <span className="px-1.5 py-0.5 rounded-md bg-amber-500 text-white text-[9px] font-black uppercase">
                  Directory
                </span>
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-2 text-[11px] font-medium text-slate-400 pr-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>24/7 Online Desk: Pan-India</span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* TAB 1: TRAIN BOOKING FORM WITH MULTI-PASSENGER */}
          {/* ========================================================= */}
          {activeTab === 'booking' && (
            <div>
              {/* Sub-header Bar with Official Logo */}
              <div className="bg-gradient-to-r from-slate-900 via-[#0B2545] to-[#133E68] p-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/logo.svg"
                    alt="Aazam Travel Agency Official Logo"
                    className="w-12 h-12 rounded-xl object-contain bg-white/10 p-1.5 border border-white/20 shrink-0 drop-shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white">IRCTC Railway Reservation Engine</h2>
                      <span className="px-2 py-0.5 rounded bg-emerald-500 text-white text-[10px] font-black uppercase">
                        Pan-India Online
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      100% Online railway reservation service across all stations in India with WhatsApp E-Ticket delivery.
                    </p>
                  </div>
                </div>

                {/* Trip Type Selector */}
                <div className="inline-flex p-1 bg-white/10 rounded-xl border border-white/20 self-start md:self-auto">
                  <button
                    type="button"
                    onClick={() => setTripType('oneway')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      tripType === 'oneway'
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'text-slate-200 hover:text-white'
                    }`}
                  >
                    One Way
                  </button>
                  <button
                    type="button"
                    onClick={() => setTripType('roundtrip')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      tripType === 'roundtrip'
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'text-slate-200 hover:text-white'
                    }`}
                  >
                    Round Trip
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmitBooking} className="p-6 sm:p-8 space-y-8">
                {bookingError && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-sm animate-shake">
                    <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
                    <div>
                      <span className="font-bold block">Submission Attention Needed:</span>
                      <span className="text-xs">{bookingError}</span>
                    </div>
                  </div>
                )}

                {/* 1. Stations & Autocomplete */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      1. Boarding & Destination Station (Live Autocomplete)
                    </h3>
                    <span className="text-[11px] text-slate-600">Station Code or Name</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-start">
                    {/* Boarding Station (Origin) */}
                    <div className="md:col-span-5 space-y-1.5">
                      <StationAutocomplete
                        label="From (Boarding Station)"
                        value={origin}
                        onChange={(val) => setOrigin(val)}
                        placeholder="Search station name or code (e.g. NDLS, New Delhi, Mumbai, Indore)"
                        icon="origin"
                        required
                        showPopularChips
                        inputClassName="py-3 rounded-2xl"
                      />
                    </div>

                    {/* Swap Button */}
                    <div className="md:col-span-1 flex justify-center py-2 md:py-7">
                      <button
                        type="button"
                        onClick={handleSwapStations}
                        className="p-3 rounded-full bg-slate-100 hover:bg-orange-100 text-slate-600 hover:text-orange-600 border border-slate-200 transition-all hover:rotate-180 duration-300 shadow-xs"
                        title="Swap Boarding and Destination"
                        aria-label="Swap Stations"
                      >
                        <ArrowRightLeft className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Destination Station */}
                    <div className="md:col-span-5 space-y-1.5">
                      <StationAutocomplete
                        label="To (Destination Station)"
                        value={destination}
                        onChange={(val) => setDestination(val)}
                        placeholder="Search destination station or code (e.g. CSMT, Mumbai, Pune, Howrah)"
                        icon="destination"
                        required
                        showPopularChips
                        inputClassName="py-3 rounded-2xl"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Dates, Class & Quota */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-orange-500" />
                      2. Travel Dates, Quota & Class
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Journey Date */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Journey Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={travelDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm text-slate-800 bg-white"
                      />
                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => handleSetQuickDate(0)}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                        >
                          Today
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetQuickDate(1)}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                        >
                          Tomorrow
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetQuickDate(2)}
                          className="text-[10px] px-2 py-0.5 rounded bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold border border-orange-200"
                        >
                          +2 Days
                        </button>
                      </div>
                    </div>

                    {/* Return Date (if roundtrip) */}
                    {tripType === 'roundtrip' && (
                      <div className="space-y-1.5 animate-fadeIn">
                        <label className="block text-xs font-bold text-slate-700">
                          Return Journey Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={returnDate}
                          min={travelDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm text-slate-800 bg-white"
                        />
                        <span className="text-[10px] text-slate-600 block pt-1">
                          Both onward & return ticket booked
                        </span>
                      </div>
                    )}

                    {/* Quota */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Booking Quota *
                      </label>
                      <select
                        value={quota}
                        onChange={(e) => setQuota(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm text-slate-800 bg-white font-medium"
                      >
                        {QUOTA_OPTIONS.map((q) => (
                          <option key={q.value} value={q.value}>
                            {q.label}
                          </option>
                        ))}
                      </select>
                      <span className="text-[10px] text-slate-600 block pt-1">
                        {quota.includes('Tatkal') ? '⚡ 10 AM / 11 AM Priority' : 'Regular 120-day booking window'}
                      </span>
                    </div>

                    {/* Travel Class */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Travel Class Preference *
                      </label>
                      <select
                        value={preferredClass}
                        onChange={(e) => setPreferredClass(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm text-slate-800 bg-white font-medium"
                      >
                        {TRAIN_CLASSES.map((cls) => (
                          <option key={cls.value} value={cls.value}>
                            {cls.label}
                          </option>
                        ))}
                      </select>
                      <span className="text-[10px] text-slate-600 block pt-1">
                        AC 3 Tier & Sleeper most requested
                      </span>
                    </div>

                    {/* Preferred Train */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Preferred Train (Optional)
                      </label>
                      <input
                        type="text"
                        value={preferredTrain}
                        onChange={(e) => setPreferredTrain(e.target.value)}
                        placeholder="e.g. 12140 Sewagram or Vidarbha Exp"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm text-slate-800 bg-white"
                      />
                      <span className="text-[10px] text-slate-600 block pt-1">
                        Or leave blank for best available train
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Multi-Passenger Section ("Other passenger") */}
                <div className="bg-slate-50/80 rounded-2xl p-5 sm:p-6 border border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                        <Users className="w-4 h-4 text-orange-500" />
                        3. Passenger Manifest ({totalPassengersCount} of 6 Total)
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Names must match original Aadhaar card, Voter ID, or Govt ID for IRCTC verification.
                      </p>
                    </div>

                    {/* Add Other Passenger Button */}
                    <button
                      type="button"
                      onClick={handleAddOtherPassenger}
                      disabled={otherPassengers.length >= 5}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add Other Passenger</span>
                    </button>
                  </div>

                  {/* Primary Passenger Card (Passenger 1) */}
                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3 mb-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#0B2545] text-white flex items-center justify-center text-[10px] font-black">
                          1
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          Primary Passenger (Lead Traveler) *
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Ticket Head
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-4 space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 block">
                          Full Name (as per Govt ID) *
                        </label>
                        <input
                          type="text"
                          required
                          value={primaryName}
                          onChange={(e) => setPrimaryName(e.target.value)}
                          placeholder="e.g. Shaikh Aazam"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-orange-500 outline-none text-xs text-slate-800 font-medium"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 block">
                          Age (Years) *
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          max="120"
                          value={primaryAge}
                          onChange={(e) => setPrimaryAge(e.target.value)}
                          placeholder="e.g. 38"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-orange-500 outline-none text-xs text-slate-800"
                        />
                      </div>

                      <div className="sm:col-span-3 space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 block">
                          Gender *
                        </label>
                        <select
                          value={primaryGender}
                          onChange={(e) => setPrimaryGender(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-orange-500 outline-none text-xs text-slate-800 bg-white"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Transgender">Transgender</option>
                        </select>
                      </div>

                      <div className="sm:col-span-3 space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 block">
                          Berth Preference
                        </label>
                        <select
                          value={primaryBerth}
                          onChange={(e) => setPrimaryBerth(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-orange-500 outline-none text-xs text-slate-800 bg-white"
                        >
                          {BERTH_OPTIONS.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-xs">
                      <input
                        type="checkbox"
                        id="primary-senior"
                        checked={primarySeniorCitizen}
                        onChange={(e) => setPrimarySeniorCitizen(e.target.checked)}
                        className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
                      />
                      <label htmlFor="primary-senior" className="text-slate-700 text-xs cursor-pointer">
                        Senior Citizen (Request lower berth preference / IRCTC quota)
                      </label>
                    </div>
                  </div>

                  {/* Dynamic Other Passengers List */}
                  {otherPassengers.map((pax, index) => (
                    <div
                      key={pax.id}
                      className="bg-white rounded-xl p-4 border border-orange-200/80 shadow-xs space-y-3 mb-3 animate-fadeIn"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-black">
                            {index + 2}
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            Other Passenger #{index + 2} *
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveOtherPassenger(pax.id)}
                          className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:bg-rose-50 px-2 py-0.5 rounded transition-colors"
                          title="Remove Passenger"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-4 space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Full Name (as per Govt ID) *
                          </label>
                          <input
                            type="text"
                            required
                            value={pax.name}
                            onChange={(e) =>
                              handleUpdateOtherPassenger(pax.id, 'name', e.target.value)
                            }
                            placeholder="e.g. Passenger Name"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-orange-500 outline-none text-xs text-slate-800 font-medium"
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Age *
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            max="120"
                            value={pax.age}
                            onChange={(e) =>
                              handleUpdateOtherPassenger(pax.id, 'age', e.target.value)
                            }
                            placeholder="Age"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-orange-500 outline-none text-xs text-slate-800"
                          />
                        </div>

                        <div className="sm:col-span-3 space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Gender *
                          </label>
                          <select
                            value={pax.gender}
                            onChange={(e) =>
                              handleUpdateOtherPassenger(pax.id, 'gender', e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-orange-500 outline-none text-xs text-slate-800 bg-white"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Transgender">Transgender</option>
                          </select>
                        </div>

                        <div className="sm:col-span-3 space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Berth Preference
                          </label>
                          <select
                            value={pax.berthPreference || 'No Preference'}
                            onChange={(e) =>
                              handleUpdateOtherPassenger(
                                pax.id,
                                'berthPreference',
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-orange-500 outline-none text-xs text-slate-800 bg-white"
                          >
                            {BERTH_OPTIONS.map((b) => (
                              <option key={b} value={b}>
                                {b}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1 text-xs">
                        <input
                          type="checkbox"
                          id={`senior-${pax.id}`}
                          checked={!!pax.seniorCitizen}
                          onChange={(e) =>
                            handleUpdateOtherPassenger(
                              pax.id,
                              'seniorCitizen',
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
                        />
                        <label
                          htmlFor={`senior-${pax.id}`}
                          className="text-slate-700 text-xs cursor-pointer"
                        >
                          Senior Citizen concession & lower berth request
                        </label>
                      </div>
                    </div>
                  ))}

                  {otherPassengers.length === 0 && (
                    <div className="p-3 bg-white/60 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-600">
                      <span>Traveling with family or colleagues? Click </span>
                      <button
                        type="button"
                        onClick={handleAddOtherPassenger}
                        className="font-bold text-orange-600 underline hover:text-orange-700"
                      >
                        + Add Other Passenger
                      </button>
                      <span> to include additional travelers on this ticket.</span>
                    </div>
                  )}
                </div>

                {/* 4. Customer Contact Details */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-orange-500" />
                      4. Contact & WhatsApp Delivery
                    </h3>
                    <span className="text-[11px] text-slate-600">Ticket e-PDF will be sent here</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        WhatsApp Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="e.g. 9421556220"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm text-slate-800 bg-white"
                      />
                      <span className="text-[10px] text-slate-600 block">
                        Our online booking team will send confirmation & fare quote on this WhatsApp
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="e.g. saazamshaikh@gmail.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm text-slate-800 bg-white"
                      />
                      <span className="text-[10px] text-slate-600 block">
                        For official IRCTC electronic reservation slip (ERS)
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Boarding Point / Special Notes
                      </label>
                      <input
                        type="text"
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="e.g. Boarding at Kota / Vadodara or urgent Tatkal"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm text-slate-800 bg-white"
                      />
                      <span className="text-[10px] text-slate-600 block">
                        Specific coach, nearby berths, or food preference
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submission Section */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-600 space-y-0.5 text-center sm:text-left">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 justify-center sm:justify-start">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>100% Pan-India Online Desk · Instant E-Ticket Delivery</span>
                    </div>
                    <p className="text-[11px]">
                      Submitting will register your request and launch WhatsApp to finalize booking with our agent.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-60 text-white font-black text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
                  >
                    {bookingLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing Train Booking...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit & Open WhatsApp Manifest</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: LIVE TRAIN RUNNING STATUS TRACKER */}
          {/* ========================================================= */}
          {activeTab === 'live-status' && (
            <div className="p-6 sm:p-8 space-y-6">
              {/* Header with Logo */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/logo.svg"
                    alt="Aazam Travel Agency Official Logo"
                    className="w-10 h-10 rounded-xl object-contain bg-slate-100 p-1 border border-slate-200 shrink-0"
                  />
                  <div>
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-emerald-600" />
                      Live Train Running Status & GPS Speed Tracker
                    </h2>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Powered by RailRadar API: Real-time GPS location, actual running speed km/h, bearing, route diversion exceptions & delay monitoring.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-slate-500 font-bold">Quick Trains:</span>
                  {[
                    { num: '12919', label: '12919 Malwa Exp' },
                    { num: '12952', label: '12952 Rajdhani' },
                    { num: '12565', label: '12565 Sampark Kranti' },
                    { num: '22436', label: '22436 Vande Bharat' },
                  ].map((item) => (
                    <button
                      key={item.num}
                      type="button"
                      onClick={() => {
                        setLiveTrainNumber(item.num);
                        setRailRadarTrainNumber(item.num);
                        handleCheckRailRadarLiveTrain(item.num);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Search Form */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
                <div className="w-full sm:w-1/2 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Train Number (5 Digits) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={liveTrainNumber}
                      onChange={(e) => {
                        setLiveTrainNumber(e.target.value);
                        setRailRadarTrainNumber(e.target.value);
                      }}
                      placeholder="e.g. 12919 or 12952"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none text-sm font-bold text-slate-800 bg-white"
                    />
                    <Train className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  </div>
                </div>

                <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2 sm:self-end">
                  <button
                    type="button"
                    disabled={railRadarLiveLoading}
                    onClick={() => handleCheckRailRadarLiveTrain(liveTrainNumber)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    {railRadarLiveLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Tracking GPS...</span>
                      </>
                    ) : (
                      <>
                        <Radio className="w-4 h-4" />
                        <span>Live GPS Status (RailRadar)</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={liveStatusLoading}
                    onClick={() => handleCheckLiveStatus(liveTrainNumber)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 disabled:opacity-60 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    {liveStatusLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4" />
                        <span>Date Schedule</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {liveStatusError && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{liveStatusError}</span>
                </div>
              )}

              {/* Status Results Display */}
              {liveStatusData && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Top Train Banner */}
                  <div className="bg-gradient-to-r from-[#0B2545] to-[#164069] rounded-2xl p-5 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-lg bg-orange-500 text-white font-black text-xs">
                          TRAIN #{liveStatusData.TrainNumber}
                        </span>
                        <span className="text-xs text-slate-300">
                          Journey Start: {liveStatusData.StartDate}
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-white">
                        {liveStatusData.TrainName || `Train #${liveStatusData.TrainNumber}`}
                      </h3>
                      {liveStatusData.CurrentPosition && (
                        <p className="text-xs text-orange-300 font-medium mt-1 flex items-center gap-1.5">
                          <Navigation className="w-3.5 h-3.5" />
                          <span>{liveStatusData.CurrentPosition}</span>
                        </p>
                      )}
                    </div>

                    {/* Current Station Badge */}
                    {liveStatusData.CurrentStation && (
                      <div className="bg-white/10 rounded-xl p-3 border border-white/15 text-right self-stretch md:self-auto">
                        <span className="text-[10px] text-orange-300 uppercase tracking-wider block font-bold">
                          Current / Next Station
                        </span>
                        <span className="text-base font-black text-white block">
                          {liveStatusData.CurrentStation.StationName} ({liveStatusData.CurrentStation.StationCode})
                        </span>
                        <span className={`text-[11px] font-bold inline-block px-2 py-0.5 rounded mt-1 ${
                          liveStatusData.CurrentStation.DelayInArrival === '00 M' || liveStatusData.CurrentStation.DelayInArrival === '-'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-amber-400 text-slate-900'
                        }`}>
                          Delay: {liveStatusData.CurrentStation.DelayInArrival || 'On-Time'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Route Timeline / Stations Table */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                    <div className="bg-slate-100/80 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                        Full Route Schedule & Station Delays
                      </span>
                      <span className="text-xs text-slate-500">
                        {liveStatusData.TrainRoute?.length || 0} Stations on Route
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase text-[10px]">
                          <tr>
                            <th className="px-4 py-3">#</th>
                            <th className="px-4 py-3">Station</th>
                            <th className="px-4 py-3">Code</th>
                            <th className="px-4 py-3">Sch. Arrival</th>
                            <th className="px-4 py-3">Act. Arrival</th>
                            <th className="px-4 py-3">Delay Arr.</th>
                            <th className="px-4 py-3">Sch. Depart</th>
                            <th className="px-4 py-3">Act. Depart</th>
                            <th className="px-4 py-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {liveStatusData.TrainRoute?.map((stn, idx) => {
                            const isCurrent =
                              liveStatusData.CurrentStation?.StationCode === stn.StationCode;
                            const isDelayed =
                              stn.DelayInArrival !== '00 M' &&
                              stn.DelayInArrival !== '-' &&
                              stn.DelayInArrival !== '0 M';

                            return (
                              <tr
                                key={idx}
                                className={`transition-colors ${
                                  isCurrent
                                    ? 'bg-orange-50/80 font-bold'
                                    : idx % 2 === 0
                                    ? 'bg-white'
                                    : 'bg-slate-50/40'
                                }`}
                              >
                                <td className="px-4 py-3 text-slate-500">{stn.SerialNo || idx}</td>
                                <td className="px-4 py-3">
                                  <span className="font-bold text-slate-800">{stn.StationName}</span>
                                  {isCurrent && (
                                    <span className="ml-2 px-1.5 py-0.5 rounded bg-orange-500 text-white text-[9px] uppercase font-black">
                                      CURRENT
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3 font-mono font-bold text-orange-600">
                                  {stn.StationCode}
                                </td>
                                <td className="px-4 py-3 text-slate-600">{stn.ScheduleArrival}</td>
                                <td className="px-4 py-3 font-semibold text-slate-800">
                                  {stn.ActualArrival}
                                </td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                                      isDelayed
                                        ? 'bg-rose-100 text-rose-700'
                                        : 'bg-emerald-50 text-emerald-700'
                                    }`}
                                  >
                                    {stn.DelayInArrival}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-slate-600">{stn.ScheduleDeparture}</td>
                                <td className="px-4 py-3 font-semibold text-slate-800">
                                  {stn.ActualDeparture}
                                </td>
                                <td className="px-4 py-3">
                                  {stn.IsDeparted === 'YES' ? (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                      Departed
                                    </span>
                                  ) : stn.IsDeparted === 'NO' ? (
                                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                                      Upcoming
                                    </span>
                                  ) : (
                                    <span className="text-slate-400">-</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: RAILRADAR LIVE STATION BOARD */}
          {/* ========================================================= */}
          {activeTab === 'live-station' && (
            <TrainStationBoard
              stationBoardCode={stationBoardCode}
              setStationBoardCode={setStationBoardCode}
              stationBoardHours={stationBoardHours}
              setStationBoardHours={setStationBoardHours}
              stationBoardLoading={stationBoardLoading}
              stationBoardError={stationBoardError}
              stationBoardData={stationBoardData}
              onFetchStationBoard={handleCheckStationBoard}
              onTrackLive={(trainNum) => {
                setRailRadarTrainNumber(trainNum);
                setActiveTab('live-status');
                handleCheckRailRadarLiveTrain(trainNum);
              }}
              cleanWhatsApp={cleanWhatsApp}
            />
          )}

          {/* ========================================================= */}
          {/* TAB 4: TRAIN SCHEDULE & ROUTE TIMETABLE (RailRadar API) */}
          {/* ========================================================= */}
          {activeTab === 'schedule' && (
            <div className="p-6 sm:p-8 space-y-6">
              {/* Header with Agency Logo */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/logo.svg"
                    alt="Aazam Travel Agency Official Logo"
                    className="w-10 h-10 rounded-xl object-contain bg-slate-100 p-1 border border-slate-200 shrink-0"
                  />
                  <div>
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-sky-600" />
                      Indian Railways Train Schedule & Route Timetable
                    </h2>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Powered by RailRadar API: Complete stoppage list, platform numbers, timings, run days, speeds & coach composition.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-slate-500 font-bold">Quick Trains:</span>
                  {[
                    { num: '12919', name: 'Malwa SF Exp' },
                    { num: '12952', name: 'Mumbai Rajdhani' },
                    { num: '12565', name: 'Bihar Sampark Kranti' },
                    { num: '22436', name: 'Vande Bharat' },
                    { num: '12860', name: 'Gitanjali Exp' }
                  ].map((t) => (
                    <button
                      key={t.num}
                      type="button"
                      onClick={() => {
                        setScheduleTrainNumber(t.num);
                        handleCheckSchedule(t.num);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs border border-sky-200 transition-colors"
                      title={t.name}
                    >
                      #{t.num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Form Bar */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center gap-3">
                <div className="w-full md:flex-1 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Train Number (5 Digits) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={5}
                      value={scheduleTrainNumber}
                      onChange={(e) => setScheduleTrainNumber(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="e.g. 12919 or 12140"
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 outline-none text-base font-mono font-bold text-slate-800 bg-white"
                    />
                    <Train className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                  </div>
                </div>

                <div className="flex items-center gap-3 self-stretch md:self-end pt-2 md:pt-0">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer bg-white px-3.5 py-2.5 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      checked={scheduleHaltsOnly}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setScheduleHaltsOnly(val);
                        if (scheduleData) {
                          handleCheckSchedule(scheduleTrainNumber, val);
                        }
                      }}
                      className="rounded text-sky-600 focus:ring-sky-500"
                    />
                    <span>Halts Only (Stoppages)</span>
                  </label>

                  <button
                    type="button"
                    disabled={scheduleLoading}
                    onClick={() => handleCheckSchedule()}
                    className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    {scheduleLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Fetching Timetable...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>Get Timetable</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {scheduleError && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{scheduleError}</span>
                </div>
              )}

              {/* Schedule Results Display */}
              {scheduleData && scheduleData.data && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Master Train Information Hero Card */}
                  <div className="bg-gradient-to-r from-slate-900 via-[#0B2545] to-[#133E68] rounded-2xl p-6 text-white shadow-md">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="px-2.5 py-0.5 rounded-md bg-sky-500 text-white text-[11px] font-black uppercase tracking-wider">
                            Train #{scheduleData.data.train.number}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500 text-white text-[10px] font-black uppercase">
                            {scheduleData.data.train.type || 'Superfast Express'}
                          </span>
                          {scheduleData.data.train.category && (
                            <span className="px-2 py-0.5 rounded bg-amber-500/80 text-white text-[10px] font-bold">
                              {scheduleData.data.train.category}
                            </span>
                          )}
                        </div>
                        <h3 className="text-2xl font-black text-white tracking-tight">
                          {scheduleData.data.train.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-sky-200 mt-1 font-medium">
                          <span>{scheduleData.data.train.source.name} ({scheduleData.data.train.source.code})</span>
                          <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
                          <span>{scheduleData.data.train.destination.name} ({scheduleData.data.train.destination.code})</span>
                        </div>
                      </div>

                      {scheduleData.data.train.returnTrain && (
                        <div className="bg-white/10 rounded-2xl p-3 border border-white/15 text-center">
                          <span className="text-[10px] text-slate-300 block font-medium">Return Service</span>
                          <button
                            type="button"
                            onClick={() => {
                              const ret = scheduleData.data.train.returnTrain!;
                              setScheduleTrainNumber(ret);
                              handleCheckSchedule(ret);
                            }}
                            className="mt-0.5 px-3 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-black transition-colors"
                          >
                            #{scheduleData.data.train.returnTrain} Timetable
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
                      <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                        <span className="text-[10px] text-slate-300 block flex items-center gap-1">
                          <Milestone className="w-3 h-3 text-sky-400" /> Total Distance
                        </span>
                        <span className="text-sm font-black text-white">{scheduleData.data.train.distance} km</span>
                      </div>

                      <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                        <span className="text-[10px] text-slate-300 block flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-400" /> Travel Duration
                        </span>
                        <span className="text-sm font-black text-white">
                          {Math.floor((scheduleData.data.train.duration || 0) / 60)}h {(scheduleData.data.train.duration || 0) % 60}m
                        </span>
                      </div>

                      <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                        <span className="text-[10px] text-slate-300 block flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-400" /> Total Halts
                        </span>
                        <span className="text-sm font-black text-white">
                          {scheduleData.data.train.totalHalts || scheduleData.data.route.length} Stoppages
                        </span>
                      </div>

                      <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                        <span className="text-[10px] text-slate-300 block flex items-center gap-1">
                          <Gauge className="w-3 h-3 text-indigo-400" /> Avg Speed
                        </span>
                        <span className="text-sm font-black text-white">{scheduleData.data.train.avgSpeed || '57'} km/h</span>
                      </div>

                      <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                        <span className="text-[10px] text-slate-300 block flex items-center gap-1">
                          <Activity className="w-3 h-3 text-rose-400" /> Max Speed
                        </span>
                        <span className="text-sm font-black text-white">{scheduleData.data.train.maxSpeed || '110'} km/h</span>
                      </div>

                      <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                        <span className="text-[10px] text-slate-300 block flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" /> Pan-India Online
                        </span>
                        <span className="text-sm font-black text-emerald-300">Bookable</span>
                      </div>
                    </div>

                    {/* Operating Days */}
                    <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300 font-bold flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-sky-400" /> Runs On:
                        </span>
                        <div className="flex items-center gap-1">
                          {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => {
                            const runs = scheduleData.data.train.runDays?.map(d => d.toLowerCase()).includes(day);
                            return (
                              <span
                                key={day}
                                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                  runs ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-400 opacity-50'
                                }`}
                              >
                                {day.slice(0, 3)}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setPreferredTrain(`${scheduleData.data.train.number} - ${scheduleData.data.train.name}`);
                            setOrigin(`${scheduleData.data.train.source.name} (${scheduleData.data.train.source.code})`);
                            setDestination(`${scheduleData.data.train.destination.name} (${scheduleData.data.train.destination.code})`);
                            setActiveTab('booking');
                            window.scrollTo({ top: 350, behavior: 'smooth' });
                          }}
                          className="px-4 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Book Tickets on this Train</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Route Stations Timetable Table */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                          <Milestone className="w-4 h-4 text-sky-600" />
                          Complete Route & Stoppage Timetable ({scheduleData.data.route.length} Stations)
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Scheduled arrivals, departures, platform designations, and inter-station distances.
                        </p>
                      </div>

                      <div className="relative w-full sm:w-64">
                        <input
                          type="text"
                          value={scheduleFilterText}
                          onChange={(e) => setScheduleFilterText(e.target.value)}
                          placeholder="Search station or code..."
                          className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white outline-none focus:border-sky-500"
                        />
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                          <tr>
                            <th className="px-3 py-3 w-12 text-center">#</th>
                            <th className="px-4 py-3">Station Name & Code</th>
                            <th className="px-3 py-3 text-center">Platform</th>
                            <th className="px-3 py-3">Arrival</th>
                            <th className="px-3 py-3">Departure</th>
                            <th className="px-3 py-3">Halt</th>
                            <th className="px-3 py-3 text-center">Day</th>
                            <th className="px-3 py-3 text-right">Distance</th>
                            <th className="px-3 py-3 text-right">Next Speed</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {scheduleData.data.route
                            .filter((item) => {
                              if (!scheduleFilterText.trim()) return true;
                              const q = scheduleFilterText.toLowerCase();
                              return (
                                item.station.name.toLowerCase().includes(q) ||
                                item.station.code.toLowerCase().includes(q)
                              );
                            })
                            .map((item, idx) => {
                              const isSource = !item.arrival && idx === 0;
                              const isDest = !item.departure && idx === scheduleData.data.route.length - 1;

                              // Calculate halt duration in minutes if both times present
                              let haltDisplay = '-';
                              if (isSource) haltDisplay = 'Source';
                              else if (isDest) haltDisplay = 'Destination';
                              else if (item.arrival && item.departure) {
                                const [arrH, arrM] = item.arrival.split(':').map(Number);
                                const [depH, depM] = item.departure.split(':').map(Number);
                                let diff = (depH * 60 + depM) - (arrH * 60 + arrM);
                                if (diff < 0) diff += 24 * 60;
                                haltDisplay = `${diff}m`;
                              }

                              return (
                                <tr
                                  key={item.sequence || idx}
                                  className="hover:bg-sky-50/50 transition-colors"
                                >
                                  <td className="px-3 py-3 text-center font-mono text-slate-400">
                                    {item.sequence || idx + 1}
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-slate-900">{item.station.name}</span>
                                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 text-slate-700">
                                        {item.station.code}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-3 py-3 text-center">
                                    {item.platform ? (
                                      <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold text-[10px]">
                                        PF {item.platform}
                                      </span>
                                    ) : (
                                      <span className="text-slate-400">-</span>
                                    )}
                                  </td>
                                  <td className="px-3 py-3 text-slate-700 font-mono">
                                    {item.arrival ? item.arrival : <span className="text-emerald-600 font-bold">Source</span>}
                                  </td>
                                  <td className="px-3 py-3 text-slate-700 font-mono">
                                    {item.departure ? item.departure : <span className="text-rose-600 font-bold">Destination</span>}
                                  </td>
                                  <td className="px-3 py-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      haltDisplay === 'Source' || haltDisplay === 'Destination'
                                        ? 'bg-slate-100 text-slate-600'
                                        : 'bg-emerald-50 text-emerald-700'
                                    }`}>
                                      {haltDisplay}
                                    </span>
                                  </td>
                                  <td className="px-3 py-3 text-center font-semibold text-slate-600">
                                    Day {item.departureDay || item.arrivalDay || 1}
                                  </td>
                                  <td className="px-3 py-3 text-right font-mono text-slate-700">
                                    {item.distance} km
                                  </td>
                                  <td className="px-3 py-3 text-right font-mono text-slate-500">
                                    {item.speedToNextStationKmph ? `${item.speedToNextStationKmph} km/h` : '-'}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Help & Direct WhatsApp Action */}
                  <div className="bg-sky-50 rounded-2xl p-4 border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-800 text-center sm:text-left">
                      <Phone className="w-4 h-4 text-sky-600 shrink-0" />
                      <span>
                        Need instant ticket booking, Tatkal seat allocation, or confirmed seat guidance for <strong>{scheduleData.data.train.number} - {scheduleData.data.train.name}</strong>?
                      </span>
                    </div>
                    <a
                      href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                        `Hello Aazam Travel Agency, I want to enquire about booking tickets on train ${scheduleData.data.train.number} (${scheduleData.data.train.name}) from ${scheduleData.data.train.source.name} to ${scheduleData.data.train.destination.name}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Ticket Desk</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: ALL STATIONS & CODE SEARCHBAR DIRECTORY */}
          {/* ========================================================= */}
          {activeTab === 'station-search' && (
            <div className="p-4 sm:p-6 bg-slate-50/50">
              <StationSearchBar
                onSelectStationForBooking={(stn) => {
                  setOrigin(`${stn.NameEn} (${stn.StationCode})`);
                  setActiveTab('booking');
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                onCheckLiveBoard={(code) => {
                  setStationBoardCode(code);
                  setActiveTab('live-station');
                  handleCheckStationBoard(code, stationBoardHours);
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
              />
            </div>
          )}

        </div>
      </section>

      {/* Back to Home CTA with Official Logo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-6 text-center">
        <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <Logo iconClassName="h-9 w-auto" />
          <div className="h-4 w-px bg-slate-200 hidden sm:block" />
          <span className="text-xs text-slate-600 font-medium">
            Authorized IRCTC Online Railway Reservation Desk · Pan-India Service
          </span>
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B2545] hover:bg-slate-900 text-white font-bold text-xs shadow-xs transition-all hover:scale-105"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
