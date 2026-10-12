import React, { useState, useEffect } from 'react';
import { submitEnquiry } from '../api';
import { Enquiry, PassengerDetail, ServiceType } from '../types';
import { StationAutocomplete } from './StationAutocomplete';
import { 
  Train, 
  Plane, 
  Bus,
  Building2, 
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
  Loader2,
  Plus,
  Trash2,
  ShieldCheck,
  Sparkles,
  BedDouble,
  Compass,
  Luggage,
  Coffee,
  Armchair
} from 'lucide-react';

interface BookingHubSectionProps {
  agencyPhone: string;
  agencyWhatsApp: string;
  activeServiceTab?: ServiceType;
  onTabChange?: (tab: ServiceType) => void;
  onEnquirySuccess: (data: { enquiry: Enquiry; whatsappUrl: string }) => void;
}

const COMMON_TRAIN_STATIONS = [
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

const TRAIN_QUOTAS = [
  'General Quota (GN)',
  'Tatkal Quota (CK)',
  'Premium Tatkal (PT)',
  'Ladies Quota (LD)',
  'Senior Citizen / Lower Berth (SS)',
];

const COMMON_AIRPORTS = [
  'Nagpur (NAG) - Dr. Babasaheb Ambedkar',
  'Mumbai (BOM) - Chhatrapati Shivaji Maharaj',
  'Pune (PNQ) - Pune Airport',
  'New Delhi (DEL) - Indira Gandhi International',
  'Hyderabad (HYD) - Rajiv Gandhi International',
  'Bengaluru (BLR) - Kempegowda',
  'Goa (GOI / GOX)',
  'Dubai (DXB) - International',
  'Jeddah (JED) - King Abdulaziz',
  'Riyadh (RUH) - King Khalid',
];

const FLIGHT_CLASSES = [
  'Economy Class',
  'Premium Economy',
  'Business Class',
  'First Class',
];

const FLIGHT_FARE_TYPES = [
  'Regular Fare',
  'Senior Citizen Special',
  'Student Fare (Extra Baggage)',
  'Armed Forces / Govt Personnel',
];

const COMMON_HOTEL_CITIES = [
  'Makkah (Saudi Arabia) - Near Haram',
  'Madinah (Saudi Arabia) - Near Markaziah',
  'Shirdi (Maharashtra) - Near Sai Temple',
  'Goa (North / South Beaches)',
  'Kashmir (Srinagar / Gulmarg)',
  'Mumbai (Near Airport / Marine Drive)',
  'Pune (Shivaji Nagar / Hinjewadi)',
  'Jaipur / Udaipur (Heritage Resorts)',
  'Delhi (Aerocity / Connaught Place)',
  'Shegaon (Gajanan Maharaj Mandir)',
];

const HOTEL_CATEGORIES = [
  '3-Star Comfortable Hotel',
  '4-Star Premium Hotel',
  '5-Star Luxury Resort',
  'Budget Friendly Hotel',
  'Pilgrim Shrines Walking Distance',
];

const MEAL_PLANS = [
  'CP - Breakfast Included',
  'EP - Room Only',
  'MAP - Breakfast + Dinner',
  'AP - All Meals (Breakfast, Lunch, Dinner)',
];

const COMMON_BUS_CITIES = [
  'Delhi (ISBT Kashmiri Gate / Anand Vihar)',
  'Mumbai (Dadar / Borivali / Thane / Vashi)',
  'Pune (Shivaji Nagar / Hinjewadi / Swargate)',
  'Indore (Sarwate / Vijay Nagar / Navlakha)',
  'Bengaluru (Majestic / Madiwala / Anand Rao)',
  'Hyderabad (KPHB / Lakdikapul / Ameerpet)',
  'Ahmedabad (Paldi / Geeta Mandir / Iscon)',
  'Jaipur (Sindhi Camp / Transport Nagar)',
  'Nagpur (Dharampeth / Chatrapati Sq / Ganeshpeth)',
  'Surat (Ring Road / Kamrej / Varachha)',
  'Nashik (Dwarka / Mumbai Naka)',
  'Shirdi (Sai Baba Temple)',
  'Lucknow (Alambagh / Charbagh)',
  'Varanasi (Cantt Bus Station)',
];

const BUS_TYPES = [
  'AC Sleeper (2+1)',
  'Non-AC Sleeper (2+1)',
  'AC Seater (Volvo / Multi-Axle / Scania)',
  'BharatBenz Luxury Sleeper',
  'Non-AC Pushback Seater',
  'Any Comfortable Bus',
];

const BUS_OPERATORS = [
  'Any Top Rated Operator',
  'VRL Travels',
  'SRS Travels',
  'IntrCity SmartBus',
  'Zingbus',
  'Hans Travels',
  'Prasanna Purple',
  'Paulo Travels',
  'Royal Chintamani Travels',
  'State Transport (Shivshahi / Airavat / Volvo)',
];

const BUS_BOARDING_POINTS = [
  'City Central / Main Bus Stand',
  'Highway Express Bypass / Ring Road',
  'Railway Station Square',
  'Airport Transit Hub',
  'Major Metro Station / Junction',
  'Other / Boarding point near my location',
];

const BUS_DEPARTURE_TIMES = [
  'Evening / Night (7:00 PM - 11:00 PM)',
  'Late Night (11:00 PM - 2:00 AM)',
  'Morning (6:00 AM - 12:00 PM)',
  'Afternoon (12:00 PM - 6:00 PM)',
  'Any Flexible Time',
];

const BUS_BERTH_OPTIONS = [
  'No Preference',
  'Lower Single Berth (Window)',
  'Upper Single Berth (Window)',
  'Lower Double Berth (Couple/Family)',
  'Upper Double Berth',
  'Front Row Seater',
  'Window Seater',
];

export const BookingHubSection: React.FC<BookingHubSectionProps> = ({
  agencyPhone,
  agencyWhatsApp,
  activeServiceTab = 'train',
  onTabChange,
  onEnquirySuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'train' | 'flight' | 'bus' | 'hotel'>(
    (activeServiceTab === 'flight' || activeServiceTab === 'bus' || activeServiceTab === 'hotel') ? activeServiceTab : 'train'
  );

  useEffect(() => {
    if (activeServiceTab === 'train' || activeServiceTab === 'flight' || activeServiceTab === 'bus' || activeServiceTab === 'hotel') {
      setActiveTab(activeServiceTab);
    }
  }, [activeServiceTab]);

  const handleTabSwitch = (tab: 'train' | 'flight' | 'bus' | 'hotel') => {
    setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  // Common Contact Fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Primary Passenger preferences
  const [primaryAge, setPrimaryAge] = useState('');
  const [primaryGender, setPrimaryGender] = useState<'Male' | 'Female' | 'Transgender'>('Male');
  const [primaryBerth, setPrimaryBerth] = useState('No Preference');
  const [primarySeat, setPrimarySeat] = useState('No Preference');
  const [primaryMeal, setPrimaryMeal] = useState('No Meal');
  const [primarySenior, setPrimarySenior] = useState(false);

  // Other Passengers dynamic list
  const [otherPassengers, setOtherPassengers] = useState<PassengerDetail[]>([]);

  // Train specific fields
  const [trainOrigin, setTrainOrigin] = useState('New Delhi (NDLS)');
  const [trainDestination, setTrainDestination] = useState('');
  const [trainDate, setTrainDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [trainReturnDate, setTrainReturnDate] = useState('');
  const [trainClass, setTrainClass] = useState('3A - AC 3 Tier');
  const [trainQuota, setTrainQuota] = useState('General Quota (GN)');

  // Flight specific fields
  const [flightOrigin, setFlightOrigin] = useState('Nagpur (NAG) - Dr. Babasaheb Ambedkar');
  const [flightDestination, setFlightDestination] = useState('');
  const [flightTripType, setFlightTripType] = useState<'oneway' | 'roundtrip'>('oneway');
  const [flightDate, setFlightDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [flightReturnDate, setFlightReturnDate] = useState('');
  const [flightClass, setFlightClass] = useState('Economy Class');
  const [flightFareType, setFlightFareType] = useState('Regular Fare');

  // Bus specific fields
  const [busOrigin, setBusOrigin] = useState('Indore (Sarwate / Vijay Nagar)');
  const [busDestination, setBusDestination] = useState('');
  const [busDate, setBusDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [busReturnDate, setBusReturnDate] = useState('');
  const [busRoundTrip, setBusRoundTrip] = useState(false);
  const [busType, setBusType] = useState('AC Sleeper (2+1)');
  const [busOperator, setBusOperator] = useState('Any Top Rated Operator');
  const [busBoardingPoint, setBusBoardingPoint] = useState('City Central / Main Bus Stand');
  const [busDepartureTime, setBusDepartureTime] = useState('Evening / Night (7:00 PM - 11:00 PM)');
  const [busSeatPreference, setBusSeatPreference] = useState('Lower Single Berth (Window)');

  // Hotel specific fields
  const [hotelCity, setHotelCity] = useState('');
  const [hotelCheckIn, setHotelCheckIn] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [hotelCheckOut, setHotelCheckOut] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [hotelRooms, setHotelRooms] = useState(1);
  const [hotelCategory, setHotelCategory] = useState('3-Star Comfortable Hotel');
  const [hotelMealPlan, setHotelMealPlan] = useState('CP - Breakfast Included');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add Other Passenger Handler
  const handleAddOtherPassenger = () => {
    const newPassengerNumber = otherPassengers.length + 2;
    const newPassenger: PassengerDetail = {
      id: `pax-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: '',
      age: '',
      gender: 'Male',
      berthPreference: 'No Preference',
      seatPreference: 'No Preference',
      mealPreference: 'No Meal',
      seniorCitizen: false,
    };
    setOtherPassengers([...otherPassengers, newPassenger]);
  };

  // Remove Other Passenger Handler
  const handleRemoveOtherPassenger = (id: string) => {
    setOtherPassengers(otherPassengers.filter((p) => p.id !== id));
  };

  // Update specific Other Passenger
  const handleUpdateOtherPassenger = (id: string, field: keyof PassengerDetail, value: any) => {
    setOtherPassengers(
      otherPassengers.map((p) => {
        if (p.id === id) {
          return { ...p, [field]: value };
        }
        return p;
      })
    );
  };

  // Swap Stations/Airports/Cities
  const swapTrainStations = () => {
    const temp = trainOrigin;
    setTrainOrigin(trainDestination || 'New Delhi (NDLS)');
    setTrainDestination(temp);
  };

  const swapFlightAirports = () => {
    const temp = flightOrigin;
    setFlightOrigin(flightDestination || 'Mumbai (BOM) - Chhatrapati Shivaji Maharaj');
    setFlightDestination(temp);
  };

  const swapBusCities = () => {
    const temp = busOrigin;
    setBusOrigin(busDestination || 'Indore (Sarwate / Vijay Nagar)');
    setBusDestination(temp);
  };

  // Total passengers count
  const totalPassengersCount = 1 + otherPassengers.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim()) {
      setError('Please provide Primary Passenger / Contact Name.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 10) {
      setError('Please provide a valid 10-digit mobile number for WhatsApp assistance.');
      return;
    }

    // Prepare Passenger Manifest: Primary + Other Passengers
    const passengerManifest: PassengerDetail[] = [
      {
        id: 'primary-pax',
        name: customerName.trim(),
        age: primaryAge.trim() || '30',
        gender: primaryGender,
        berthPreference: activeTab === 'train' ? primaryBerth : (activeTab === 'bus' ? busSeatPreference : undefined),
        seatPreference: activeTab === 'flight' ? primarySeat : (activeTab === 'bus' ? busSeatPreference : undefined),
        mealPreference: primaryMeal,
        seniorCitizen: primarySenior,
      },
      ...otherPassengers.map((p) => ({
        ...p,
        name: p.name.trim() || 'Co-Passenger',
      })),
    ];

    let origin = '';
    let destination = '';
    let travelDate = '';
    let returnDate = '';
    let preferredClass = '';
    let quota = '';
    let rooms = 1;

    if (activeTab === 'train') {
      if (!trainOrigin.trim()) {
        setError('Please enter Origin Station.');
        return;
      }
      if (!trainDestination.trim()) {
        setError('Please enter Destination Station.');
        return;
      }
      if (!trainDate) {
        setError('Please select travel date.');
        return;
      }
      origin = trainOrigin;
      destination = trainDestination;
      travelDate = trainDate;
      returnDate = trainReturnDate;
      preferredClass = trainClass;
      quota = trainQuota;
    } else if (activeTab === 'bus') {
      if (!busOrigin.trim()) {
        setError('Please enter Departure / Boarding City.');
        return;
      }
      if (!busDestination.trim()) {
        setError('Please enter Destination City.');
        return;
      }
      if (!busDate) {
        setError('Please select Bus Journey Date.');
        return;
      }
      origin = `${busOrigin.trim()}${busBoardingPoint ? ` (Boarding: ${busBoardingPoint})` : ''}`;
      destination = busDestination.trim();
      travelDate = busDate;
      returnDate = busRoundTrip ? busReturnDate : '';
      preferredClass = `${busType} • ${busOperator} • ${busDepartureTime}`;
    } else if (activeTab === 'flight') {
      if (!flightOrigin.trim()) {
        setError('Please enter Departure Airport.');
        return;
      }
      if (!flightDestination.trim()) {
        setError('Please enter Arrival Airport.');
        return;
      }
      if (!flightDate) {
        setError('Please select departure flight date.');
        return;
      }
      origin = flightOrigin;
      destination = flightDestination;
      travelDate = flightDate;
      returnDate = flightTripType === 'roundtrip' ? flightReturnDate : '';
      preferredClass = `${flightClass} (${flightFareType})`;
    } else if (activeTab === 'hotel') {
      if (!hotelCity.trim()) {
        setError('Please specify Hotel Destination City or Shrines.');
        return;
      }
      if (!hotelCheckIn) {
        setError('Please select Check-in Date.');
        return;
      }
      origin = hotelCity;
      destination = `${hotelCategory} (${hotelMealPlan})`;
      travelDate = hotelCheckIn;
      returnDate = hotelCheckOut;
      preferredClass = hotelCategory;
      rooms = hotelRooms;
    }

    setLoading(true);

    try {
      const response = await submitEnquiry({
        serviceType: activeTab,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        origin,
        destination,
        travelDate,
        returnDate: returnDate || undefined,
        passengers: totalPassengersCount,
        passengerList: passengerManifest,
        preferredClass,
        quota: activeTab === 'train' ? quota : undefined,
        tripType: activeTab === 'flight' ? flightTripType : undefined,
        rooms: activeTab === 'hotel' ? rooms : undefined,
        hotelCategory: activeTab === 'hotel' ? hotelCategory : undefined,
        mealPlan: activeTab === 'hotel' ? hotelMealPlan : undefined,
        specialRequests: specialRequests.trim() || undefined,
      });

      if (response && response.success) {
        onEnquirySuccess({
          enquiry: response.enquiry,
          whatsappUrl: response.whatsappUrl,
        });
      } else {
        setError('Unable to submit enquiry. Please try again or WhatsApp us directly.');
      }
    } catch (err: any) {
      setError(err?.message || 'Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="train-booking" className="relative py-12 sm:py-16 bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Header Banner with Official Logo */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-3 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>⚡ Pan-India Online Booking Desk · 100% Digital Order</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-[#0B2545] tracking-tight">
            Book Train, Bus, Flight & Hotel Tickets
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 font-normal">
            Direct reservation assistance with real-time seat availability, Tatkal priority, and multiple passenger management.
          </p>
        </div>

        {/* Master Booking Container */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/90 overflow-hidden">
          
          {/* Top Service Tabs (Train, Bus, Flight, Hotel) */}
          <div className="bg-[#07192F] p-2 sm:p-3 flex flex-wrap items-center justify-center gap-2 border-b border-blue-950">
            <button
              type="button"
              onClick={() => handleTabSwitch('train')}
              className={`flex-1 min-w-[130px] sm:min-w-[160px] flex items-center justify-center gap-2 py-3 px-3 sm:px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'train'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Train className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span>Train Booking</span>
              <span className="hidden lg:inline text-[10px] px-1.5 py-0.5 rounded-sm bg-black/20 text-amber-200">IRCTC Desk</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSwitch('bus')}
              className={`flex-1 min-w-[130px] sm:min-w-[160px] flex items-center justify-center gap-2 py-3 px-3 sm:px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'bus'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Bus className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span>Bus Booking</span>
              <span className="hidden lg:inline text-[10px] px-1.5 py-0.5 rounded-sm bg-black/20 text-indigo-200">AC Sleeper</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSwitch('flight')}
              className={`flex-1 min-w-[130px] sm:min-w-[160px] flex items-center justify-center gap-2 py-3 px-3 sm:px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'flight'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30 scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Plane className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span>Flight Booking</span>
              <span className="hidden lg:inline text-[10px] px-1.5 py-0.5 rounded-sm bg-black/20 text-sky-200">Domestic & Intl</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSwitch('hotel')}
              className={`flex-1 min-w-[130px] sm:min-w-[160px] flex items-center justify-center gap-2 py-3 px-3 sm:px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'hotel'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span>Hotel Booking</span>
              <span className="hidden lg:inline text-[10px] px-1.5 py-0.5 rounded-sm bg-black/20 text-emerald-200">Best Rates</span>
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-8">
            
            {/* Error Banner */}
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {/* TAB 1: TRAIN BOOKING FIELDS */}
            {activeTab === 'train' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider">
                    <Train className="w-4 h-4" />
                    <span>Indian Railways Ticket Reservation & Tatkal Support</span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    IRCTC Authorized Partner · Pan-India Online Desk
                  </div>
                </div>

                {/* Stations Row */}
                <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
                  <div className="md:col-span-5">
                    <StationAutocomplete
                      label="From Station (Boarding Point)"
                      value={trainOrigin}
                      onChange={(val) => setTrainOrigin(val)}
                      placeholder="e.g. New Delhi (NDLS), Indore (INDB)"
                      icon="origin"
                      required
                      showPopularChips
                    />
                  </div>

                  <div className="md:col-span-1 flex justify-center py-1">
                    <button
                      type="button"
                      onClick={swapTrainStations}
                      className="p-2.5 rounded-full bg-slate-100 hover:bg-orange-100 text-slate-600 hover:text-orange-600 transition-colors shadow-xs"
                      title="Swap Stations"
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="md:col-span-5">
                    <StationAutocomplete
                      label="To Station (Destination)"
                      value={trainDestination}
                      onChange={(val) => setTrainDestination(val)}
                      placeholder="e.g. Mumbai CSMT, Pune Jn, Howrah"
                      icon="destination"
                      required
                      showPopularChips
                    />
                  </div>
                </div>

                {/* Quick Station Select Chips */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-[11px] font-bold text-slate-400 mr-1">Popular:</span>
                  {COMMON_TRAIN_STATIONS.map((station) => (
                    <button
                      key={station}
                      type="button"
                      onClick={() => {
                        if (trainOrigin === station) return;
                        setTrainDestination(station);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-orange-50 hover:text-orange-700 text-slate-600 transition-colors border border-slate-200"
                    >
                      {station.split(' ')[0]}
                    </button>
                  ))}
                </div>

                {/* Train Dates, Class & Quota Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Date of Journey *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="date"
                        value={trainDate}
                        onChange={(e) => setTrainDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-semibold text-slate-800 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Return Date (Optional)
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="date"
                        value={trainReturnDate}
                        onChange={(e) => setTrainReturnDate(e.target.value)}
                        min={trainDate || new Date().toISOString().split('T')[0]}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-semibold text-slate-800 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Preferred Travel Class
                    </label>
                    <select
                      value={trainClass}
                      onChange={(e) => setTrainClass(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-semibold text-slate-800 bg-white"
                    >
                      {TRAIN_CLASSES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      IRCTC Quota
                    </label>
                    <select
                      value={trainQuota}
                      onChange={(e) => setTrainQuota(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-semibold text-slate-800 bg-white"
                    >
                      {TRAIN_QUOTAS.map((q) => (
                        <option key={q} value={q}>
                          {q}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: FLIGHT BOOKING FIELDS ("fight Booking") */}
            {activeTab === 'flight' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2 text-xs font-bold text-sky-600 uppercase tracking-wider">
                      <Plane className="w-4 h-4" />
                      <span>Domestic & International Air Tickets</span>
                    </span>
                    {/* Trip Type Selector */}
                    <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setFlightTripType('oneway')}
                        className={`px-3 py-1 rounded-md transition-all ${
                          flightTripType === 'oneway' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        One Way
                      </button>
                      <button
                        type="button"
                        onClick={() => setFlightTripType('roundtrip')}
                        className={`px-3 py-1 rounded-md transition-all ${
                          flightTripType === 'roundtrip' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        Round Trip
                      </button>
                    </div>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    IndiGo · Air India · Akasa · Saudia · Emirates
                  </div>
                </div>

                {/* Airports Row */}
                <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
                  <div className="md:col-span-5">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Flying From (Origin Airport) *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-sky-500" />
                      <input
                        type="text"
                        value={flightOrigin}
                        onChange={(e) => setFlightOrigin(e.target.value)}
                        placeholder="e.g. Nagpur (NAG) / Mumbai (BOM)"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm font-semibold text-slate-800 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="md:col-span-1 flex justify-center py-1">
                    <button
                      type="button"
                      onClick={swapFlightAirports}
                      className="p-2.5 rounded-full bg-slate-100 hover:bg-sky-100 text-slate-600 hover:text-sky-600 transition-colors shadow-xs"
                      title="Swap Airports"
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="md:col-span-5">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Flying To (Destination Airport) *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-blue-600" />
                      <input
                        type="text"
                        value={flightDestination}
                        onChange={(e) => setFlightDestination(e.target.value)}
                        placeholder="e.g. New Delhi (DEL) / Dubai (DXB) / Jeddah"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm font-semibold text-slate-800 bg-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Popular Flight Routes */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-[11px] font-bold text-slate-400 mr-1">Direct / Quick:</span>
                  {COMMON_AIRPORTS.slice(0, 7).map((airport) => (
                    <button
                      key={airport}
                      type="button"
                      onClick={() => {
                        if (flightOrigin === airport) return;
                        setFlightDestination(airport);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 transition-colors border border-slate-200"
                    >
                      {airport.split(' - ')[0]}
                    </button>
                  ))}
                </div>

                {/* Flight Dates & Cabin Class */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Departure Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="date"
                        value={flightDate}
                        onChange={(e) => setFlightDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm font-semibold text-slate-800 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Return Date {flightTripType === 'roundtrip' ? '*' : '(Optional)'}
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="date"
                        value={flightReturnDate}
                        onChange={(e) => setFlightReturnDate(e.target.value)}
                        min={flightDate || new Date().toISOString().split('T')[0]}
                        disabled={flightTripType !== 'roundtrip'}
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm font-semibold text-slate-800 ${
                          flightTripType !== 'roundtrip' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Cabin Class
                    </label>
                    <select
                      value={flightClass}
                      onChange={(e) => setFlightClass(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm font-semibold text-slate-800 bg-white"
                    >
                      {FLIGHT_CLASSES.map((fc) => (
                        <option key={fc} value={fc}>
                          {fc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Concession / Fare Category
                    </label>
                    <select
                      value={flightFareType}
                      onChange={(e) => setFlightFareType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm font-semibold text-slate-800 bg-white"
                    >
                      {FLIGHT_FARE_TYPES.map((ft) => (
                        <option key={ft} value={ft}>
                          {ft}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: BUS TICKET BOOKING FIELDS */}
            {activeTab === 'bus' && (
              <div className="space-y-6 animate-in fade-in">
                {/* Header Sub-bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-800 uppercase tracking-wider">
                    <Bus className="w-4 h-4 text-indigo-600" />
                    <span>Luxury AC Sleeper, Volvo & Seater Bus Booking Desk</span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    Royal Chintamani · VRL · Paulo · Prasanna Purple · Shivshahi
                  </div>
                </div>

                {/* Cities Row with Swap Button */}
                <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
                  <div className="md:col-span-5">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      From (Origin / Boarding City) *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-indigo-500" />
                      <input
                        type="text"
                        value={busOrigin}
                        onChange={(e) => setBusOrigin(e.target.value)}
                        placeholder="e.g. Indore, Delhi, Mumbai, Pune, Bengaluru"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-semibold text-slate-800 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="md:col-span-1 flex justify-center py-1">
                    <button
                      type="button"
                      onClick={swapBusCities}
                      className="p-2.5 rounded-full bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-600 transition-colors shadow-xs"
                      title="Swap Cities"
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="md:col-span-5">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      To (Destination City / Drop Point) *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-purple-600" />
                      <input
                        type="text"
                        value={busDestination}
                        onChange={(e) => setBusDestination(e.target.value)}
                        placeholder="e.g. Bhopal, Jaipur, Pune, Ahmedabad, Hyderabad"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-semibold text-slate-800 bg-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Popular Route Quick Chips */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-[11px] font-bold text-slate-400 mr-1">Direct Bus Routes:</span>
                  {[
                    { from: 'Delhi (Kashmiri Gate)', to: 'Jaipur (Sindhi Camp)' },
                    { from: 'Mumbai (Borivali)', to: 'Pune (Shivaji Nagar)' },
                    { from: 'Indore (Sarwate)', to: 'Bhopal (ISBT)' },
                    { from: 'Bengaluru (Majestic)', to: 'Hyderabad (KPHB)' },
                    { from: 'Indore (Vijay Nagar)', to: 'Ujjain (Nanakheda)' },
                    { from: 'Pune (Swargate)', to: 'Goa (Panaji)' },
                    { from: 'Ahmedabad (Paldi)', to: 'Surat (Ring Road)' },
                    { from: 'Nagpur (Chatrapati Sq)', to: 'Hyderabad (Lakdikapul)' },
                  ].map((route, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setBusOrigin(route.from);
                        setBusDestination(route.to);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 transition-colors border border-slate-200"
                    >
                      {route.from.split(' ')[0]} → {route.to.split(' ')[0]}
                    </button>
                  ))}
                </div>

                {/* Dates & Coach Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Journey Date */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Date of Journey *
                      </label>
                      <div className="flex items-center gap-1 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setBusDate(new Date().toISOString().split('T')[0])}
                          className="text-indigo-600 hover:underline font-bold"
                        >
                          Today
                        </button>
                        <span>·</span>
                        <button
                          type="button"
                          onClick={() => {
                            const d = new Date();
                            d.setDate(d.getDate() + 1);
                            setBusDate(d.toISOString().split('T')[0]);
                          }}
                          className="text-indigo-600 hover:underline font-bold"
                        >
                          Tomorrow
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="date"
                        value={busDate}
                        onChange={(e) => setBusDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-semibold text-slate-800 bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Return Date (Optional) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Return Date (Optional)
                      </label>
                      <label className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={busRoundTrip}
                          onChange={(e) => setBusRoundTrip(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Round Trip</span>
                      </label>
                    </div>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="date"
                        value={busReturnDate}
                        onChange={(e) => {
                          setBusReturnDate(e.target.value);
                          if (!busRoundTrip) setBusRoundTrip(true);
                        }}
                        min={busDate || new Date().toISOString().split('T')[0]}
                        disabled={!busRoundTrip}
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-semibold text-slate-800 ${
                          !busRoundTrip ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Bus Coach Type */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Bus / Coach Category
                    </label>
                    <select
                      value={busType}
                      onChange={(e) => setBusType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-semibold text-slate-800 bg-white"
                    >
                      {BUS_TYPES.map((bt) => (
                        <option key={bt} value={bt}>
                          {bt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Preferred Operator */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Preferred Bus Operator
                    </label>
                    <select
                      value={busOperator}
                      onChange={(e) => setBusOperator(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-semibold text-slate-800 bg-white"
                    >
                      {BUS_OPERATORS.map((op) => (
                        <option key={op} value={op}>
                          {op}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Boarding Point & Departure Time Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Boarding Point */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Preferred Pickup / Boarding Point
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <select
                        value={busBoardingPoint}
                        onChange={(e) => setBusBoardingPoint(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-semibold text-slate-800 bg-white"
                      >
                        {BUS_BOARDING_POINTS.map((pt) => (
                          <option key={pt} value={pt}>
                            {pt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Preferred Departure Time */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Preferred Departure Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <select
                        value={busDepartureTime}
                        onChange={(e) => setBusDepartureTime(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-semibold text-slate-800 bg-white"
                      >
                        {BUS_DEPARTURE_TIMES.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Preferred Seat / Berth Type */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Seat / Berth Preference
                    </label>
                    <div className="relative">
                      <Armchair className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <select
                        value={busSeatPreference}
                        onChange={(e) => setBusSeatPreference(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-semibold text-slate-800 bg-white"
                      >
                        {BUS_BERTH_OPTIONS.map((sb) => (
                          <option key={sb} value={sb}>
                            {sb}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: HOTEL BOOKING FIELDS */}
            {activeTab === 'hotel' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    <Building2 className="w-4 h-4" />
                    <span>Domestic, International & Pilgrimage Hotel Reservations</span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    Family Hotels · Haram Walk Stays · Verified Stays
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Destination City / Location / Shrines *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-emerald-600" />
                      <input
                        type="text"
                        value={hotelCity}
                        onChange={(e) => setHotelCity(e.target.value)}
                        placeholder="e.g. Makkah, Madinah, Goa, Shirdi, Kashmir, Mumbai"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-semibold text-slate-800 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Hotel Star Category / Property Type
                    </label>
                    <select
                      value={hotelCategory}
                      onChange={(e) => setHotelCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-semibold text-slate-800 bg-white"
                    >
                      {HOTEL_CATEGORIES.map((hc) => (
                        <option key={hc} value={hc}>
                          {hc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Popular Hotel Destinations */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-[11px] font-bold text-slate-400 mr-1">Popular Stays:</span>
                  {COMMON_HOTEL_CITIES.slice(0, 6).map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => setHotelCity(city.split(' - ')[0])}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition-colors border border-slate-200"
                    >
                      {city.split(' (')[0]}
                    </button>
                  ))}
                </div>

                {/* Hotel Dates & Rooms */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Check-in Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="date"
                        value={hotelCheckIn}
                        onChange={(e) => setHotelCheckIn(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-semibold text-slate-800 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Check-out Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="date"
                        value={hotelCheckOut}
                        onChange={(e) => setHotelCheckOut(e.target.value)}
                        min={hotelCheckIn || new Date().toISOString().split('T')[0]}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-semibold text-slate-800 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Number of Rooms
                    </label>
                    <div className="relative">
                      <BedDouble className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <select
                        value={hotelRooms}
                        onChange={(e) => setHotelRooms(Number(e.target.value))}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-semibold text-slate-800 bg-white"
                      >
                        <option value={1}>1 Room</option>
                        <option value={2}>2 Rooms</option>
                        <option value={3}>3 Rooms</option>
                        <option value={4}>4+ Rooms (Group)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Meal Plan Preference
                  </label>
                  <select
                    value={hotelMealPlan}
                    onChange={(e) => setHotelMealPlan(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-semibold text-slate-800 bg-white"
                  >
                    {MEAL_PLANS.map((mp) => (
                      <option key={mp} value={mp}>
                        {mp}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* PASSENGER DETAILS & "OTHER PASSENGER" SECTION */}
            {/* ========================================================= */}
            <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-black text-sm">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#0B2545] tracking-tight">
                      Passenger Details & Co-Travelers
                    </h3>
                    <p className="text-xs text-slate-500">
                      Add details for yourself and other passengers (as per Govt ID / Aadhaar card)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                    Total: {totalPassengersCount} {totalPassengersCount === 1 ? 'Passenger' : 'Passengers'}
                  </span>

                  {/* "+ Add Other Passenger" Button */}
                  <button
                    type="button"
                    onClick={handleAddOtherPassenger}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-all hover:scale-105 active:scale-95"
                    title="Add another passenger / co-traveler"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Other Passenger</span>
                  </button>
                </div>
              </div>

              {/* CARD 1: PRIMARY PASSENGER */}
              <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200 mb-4 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider bg-orange-100 text-orange-800 border border-orange-200">
                      Passenger 1 · Primary Traveler & Contact
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    (Contact Person for Ticket & Updates)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="As on Aadhaar / Passport"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-xs sm:text-sm font-semibold text-slate-800 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Age & Gender *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        min="1"
                        max="110"
                        value={primaryAge}
                        onChange={(e) => setPrimaryAge(e.target.value)}
                        placeholder="Age"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-xs sm:text-sm font-semibold text-slate-800 bg-white"
                      />
                      <select
                        value={primaryGender}
                        onChange={(e) => setPrimaryGender(e.target.value as any)}
                        className="w-full px-2 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-xs sm:text-sm font-semibold text-slate-800 bg-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Transgender">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Seat / Berth Preference */}
                  {activeTab === 'train' ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Berth Preference
                      </label>
                      <select
                        value={primaryBerth}
                        onChange={(e) => setPrimaryBerth(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-xs sm:text-sm font-semibold text-slate-800 bg-white"
                      >
                        <option value="No Preference">No Preference</option>
                        <option value="Lower Berth">Lower Berth</option>
                        <option value="Middle Berth">Middle Berth</option>
                        <option value="Upper Berth">Upper Berth</option>
                        <option value="Side Lower">Side Lower (SL)</option>
                        <option value="Side Upper">Side Upper (SU)</option>
                        <option value="Window Seat">Window Seat</option>
                      </select>
                    </div>
                  ) : activeTab === 'bus' ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Berth / Seat Preference
                      </label>
                      <select
                        value={busSeatPreference}
                        onChange={(e) => setBusSeatPreference(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs sm:text-sm font-semibold text-slate-800 bg-white"
                      >
                        {BUS_BERTH_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : activeTab === 'flight' ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Seat Preference
                      </label>
                      <select
                        value={primarySeat}
                        onChange={(e) => setPrimarySeat(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-xs sm:text-sm font-semibold text-slate-800 bg-white"
                      >
                        <option value="No Preference">No Preference</option>
                        <option value="Window Seat">Window Seat</option>
                        <option value="Aisle Seat">Aisle Seat</option>
                        <option value="Extra Legroom">Extra Legroom</option>
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Bed Preference
                      </label>
                      <select
                        value={primaryBerth}
                        onChange={(e) => setPrimaryBerth(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs sm:text-sm font-semibold text-slate-800 bg-white"
                      >
                        <option value="King Bed">1 Large King Bed</option>
                        <option value="Twin Beds">2 Twin / Single Beds</option>
                        <option value="Extra Bed">Require Extra Bed / Rollaway</option>
                      </select>
                    </div>
                  )}

                  {/* Food / Senior Citizen Option */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Food / Concession
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={primaryMeal}
                        onChange={(e) => setPrimaryMeal(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-xs sm:text-sm font-semibold text-slate-800 bg-white"
                      >
                        <option value="No Meal">No Meal</option>
                        <option value="Veg Meal">Veg Meal</option>
                        <option value="Non-Veg Meal">Non-Veg Meal</option>
                        <option value="Jain Meal">Jain Meal</option>
                      </select>
                      {activeTab === 'train' && (
                        <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={primarySenior}
                            onChange={(e) => setPrimarySenior(e.target.checked)}
                            className="rounded text-orange-600 focus:ring-orange-500"
                          />
                          <span>Sr. Cit</span>
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* DYNAMIC "OTHER PASSENGERS" CARDS */}
              {otherPassengers.map((pax, index) => {
                const paxIndex = index + 2;
                return (
                  <div
                    key={pax.id}
                    className="bg-blue-50/40 rounded-2xl p-4 sm:p-5 border border-blue-200/80 mb-4 transition-all animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                          Passenger {paxIndex} · Co-Traveler
                        </span>
                        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                          (Other Passenger)
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveOtherPassenger(pax.id)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
                        title="Remove this passenger"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={pax.name}
                          onChange={(e) => handleUpdateOtherPassenger(pax.id, 'name', e.target.value)}
                          placeholder="As on Govt ID"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm font-semibold text-slate-800 bg-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Age & Gender *
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            min="1"
                            max="110"
                            value={pax.age}
                            onChange={(e) => handleUpdateOtherPassenger(pax.id, 'age', e.target.value)}
                            placeholder="Age"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm font-semibold text-slate-800 bg-white"
                            required
                          />
                          <select
                            value={pax.gender}
                            onChange={(e) => handleUpdateOtherPassenger(pax.id, 'gender', e.target.value)}
                            className="w-full px-2 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm font-semibold text-slate-800 bg-white"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Transgender">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* Berth / Seat / Bed for Other Passenger */}
                      {activeTab === 'train' ? (
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Berth Preference
                          </label>
                          <select
                            value={pax.berthPreference || 'No Preference'}
                            onChange={(e) => handleUpdateOtherPassenger(pax.id, 'berthPreference', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm font-semibold text-slate-800 bg-white"
                          >
                            <option value="No Preference">No Preference</option>
                            <option value="Lower Berth">Lower Berth</option>
                            <option value="Middle Berth">Middle Berth</option>
                            <option value="Upper Berth">Upper Berth</option>
                            <option value="Side Lower">Side Lower (SL)</option>
                            <option value="Side Upper">Side Upper (SU)</option>
                            <option value="Window Seat">Window Seat</option>
                          </select>
                        </div>
                      ) : activeTab === 'bus' ? (
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Berth / Seat Preference
                          </label>
                          <select
                            value={pax.berthPreference || 'No Preference'}
                            onChange={(e) => handleUpdateOtherPassenger(pax.id, 'berthPreference', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs sm:text-sm font-semibold text-slate-800 bg-white"
                          >
                            {BUS_BERTH_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : activeTab === 'flight' ? (
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Seat Preference
                          </label>
                          <select
                            value={pax.seatPreference || 'No Preference'}
                            onChange={(e) => handleUpdateOtherPassenger(pax.id, 'seatPreference', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm font-semibold text-slate-800 bg-white"
                          >
                            <option value="No Preference">No Preference</option>
                            <option value="Window Seat">Window Seat</option>
                            <option value="Aisle Seat">Aisle Seat</option>
                            <option value="Middle Seat">Middle Seat</option>
                          </select>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Bed Preference
                          </label>
                          <select
                            value={pax.berthPreference || 'Sharing'}
                            onChange={(e) => handleUpdateOtherPassenger(pax.id, 'berthPreference', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm font-semibold text-slate-800 bg-white"
                          >
                            <option value="Sharing Bed">Sharing Existing Bed</option>
                            <option value="Extra Bed">Extra Bed Needed</option>
                            <option value="Twin Bed">Twin Separate Bed</option>
                          </select>
                        </div>
                      )}

                      {/* Meal / Concession */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Food / Concession
                        </label>
                        <div className="flex items-center gap-2">
                          <select
                            value={pax.mealPreference || 'No Meal'}
                            onChange={(e) => handleUpdateOtherPassenger(pax.id, 'mealPreference', e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm font-semibold text-slate-800 bg-white"
                          >
                            <option value="No Meal">No Meal</option>
                            <option value="Veg Meal">Veg Meal</option>
                            <option value="Non-Veg Meal">Non-Veg Meal</option>
                            <option value="Jain Meal">Jain Meal</option>
                          </select>
                          {activeTab === 'train' && (
                            <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={Boolean(pax.seniorCitizen)}
                                onChange={(e) => handleUpdateOtherPassenger(pax.id, 'seniorCitizen', e.target.checked)}
                                className="rounded text-blue-600 focus:ring-blue-500"
                              />
                              <span>Sr. Cit</span>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Quick Add Passenger Trigger Bar */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/70 border border-slate-200 text-xs text-slate-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <Info className="w-4 h-4 text-orange-500" />
                  Traveling with family or group? You can add as many co-passengers as needed.
                </span>
                <button
                  type="button"
                  onClick={handleAddOtherPassenger}
                  className="font-bold text-orange-600 hover:text-orange-700 underline text-xs"
                >
                  + Add Another Passenger
                </button>
              </div>
            </div>

            {/* ========================================================= */}
            {/* CONTACT & SUBMISSION ROW */}
            {/* ========================================================= */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    WhatsApp / Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-emerald-600" />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-semibold text-slate-800 bg-white"
                      required
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Instant confirmation and tickets will be shared here.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="For GST invoice / e-ticket copy"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-semibold text-slate-800 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Special Requests / Tatkal Timing / Notes
                  </label>
                  <input
                    type="text"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g. Need lower berth for parents / Wheelchair / Tatkal urgency"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-semibold text-slate-800 bg-white"
                  />
                </div>
              </div>

              {/* Submit Button & Direct WhatsApp Guarantee */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <div className="flex -space-x-1">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <span>
                    24/7 Pan-India Online Booking Support · Instant E-Ticket Delivery · Call: <strong>{agencyPhone}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-black text-sm text-white bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-xl shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing Booking Request...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>
                          Submit Booking for {totalPassengersCount} {totalPassengersCount === 1 ? 'Passenger' : 'Passengers'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

          </form>

        </div>

      </div>
    </section>
  );
};
