import React, { useState, useEffect } from 'react';
import { 
  checkAdminSession, 
  fetchPackages, 
  fetchServices, 
  fetchSettings, 
  logoutAdmin 
} from './api';
import { 
  AdminUser, 
  Enquiry, 
  ServiceItem, 
  ServiceType, 
  TourPackage, 
  WebsiteSettings 
} from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BookingHubSection } from './components/BookingHubSection';
import { TrainPage, ActiveTrainTab } from './components/TrainPage';
import { ServicesSection } from './components/ServicesSection';
import { StationSearchBar } from './components/StationSearchBar';
import { WhyChooseUs } from './components/WhyChooseUs';
import { TourPackagesSection } from './components/TourPackagesSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { Logo } from './components/Logo';
import { WhatsAppSuccessModal } from './components/WhatsAppSuccessModal';
import { PolicyModals } from './components/PolicyModals';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { 
  MessageSquare, 
  Loader2, 
  ShieldCheck, 
  Train,
  Activity,
  FileCheck,
  Building,
  CalendarDays,
  ArrowRight
} from 'lucide-react';

const DEFAULT_SETTINGS: WebsiteSettings = {
  businessName: 'Aazam Travel Agency',
  category: 'Online Travel Agent',
  tagline: 'Your Trusted Pan-India Travel & Train Booking Partner',
  location: 'Pan-India Online Booking Service',
  address: 'Online Travel Operations Desk (Serving All India)',
  phone: '+91 94215 56220',
  whatsapp: '+91 94215 56220',
  email: 'saazamshaikh@gmail.com',
  heroHeadline: '100% Online Train, Flight & Holiday Booking Across India',
  heroSubheadline:
    'Book confirmed train tickets (General & Tatkal for all Indian Railway stations), domestic flights, intercity buses, and holiday packages 100% online with instant WhatsApp confirmation.',
  announcement: '⚡ Pan-India Online IRCTC Train Ticket Reservation & Tatkal Booking Available for All Routes!',
  announcementActive: true,
  officeHours: 'Monday to Sunday: 8:00 AM – 10:00 PM (Online Support)',
  verifiedClaims: [
    '100% Online booking — order from anywhere in India without office visits.',
    'All-India IRCTC train tickets for every station and route.',
    'Instant E-Ticket confirmation via WhatsApp & Email.',
    'Fast & secure online payments via UPI, Google Pay & PhonePe.',
    'Dedicated customer support throughout your journey.',
    'Easy, prompt WhatsApp enquiries with zero paperwork.',
  ],
};

const FALLBACK_SERVICES: ServiceItem[] = [
  {
    id: 'srv-train',
    key: 'train',
    title: 'Train Ticket Booking (IRCTC)',
    shortDesc: '100% Online General, Tatkal, Sleeper & AC Class train ticket reservations for all routes across India.',
    fullDesc: 'Order your train tickets online from anywhere in India. We assist with General Quota, urgent Tatkal bookings, Senior Citizen & Ladies quota, PNR status tracking, and instant e-ticket delivery via WhatsApp.',
    features: ['All Indian Railway Stations Covered', 'General & Tatkal Quota Assistance', '1A, 2A, 3A, 3E, CC & Sleeper Classes', 'Instant E-Ticket on WhatsApp'],
    icon: 'Train',
  },
  {
    id: 'srv-flight',
    key: 'flight',
    title: 'Domestic & International Flights',
    shortDesc: 'Competitive airfare booking for one-way, round-trip, and urgent travel with instant e-tickets.',
    fullDesc: 'Fly effortlessly across India and abroad. We compare fares across all major airlines to offer convenient timings, web check-in support, and transparent pricing.',
    features: ['All Major Domestic Airlines', 'One-Way & Round-Trip Fares', 'Web Check-In & Boarding Pass Support', 'Baggage & Seat Selection Guidance'],
    icon: 'Plane',
  },
  {
    id: 'srv-bus',
    key: 'bus',
    title: 'AC Sleeper & Intercity Bus Booking',
    shortDesc: 'Comfortable Volvo, AC Sleeper, and luxury coach reservations across major Indian cities.',
    fullDesc: 'Daily intercity bus connections for all major routes across India. Choose your preferred lower or upper sleeper berth with verified operators.',
    features: ['AC Sleeper & Volvo Multi-Axle', 'Safe & Verified Bus Operators', 'Flexible Boarding Points', 'Instant Seat Confirmation'],
    icon: 'Bus',
  },
  {
    id: 'srv-hotel',
    key: 'hotel',
    title: 'Hotel & Stays Reservation',
    shortDesc: 'Verified budget, family, and luxury hotels near railway stations, airports, and tourist hubs.',
    fullDesc: 'Handpicked accommodations tailored to your budget and family requirements across pilgrimage towns, business cities, and holiday resorts.',
    features: ['Budget, 3-Star, 4-Star & Luxury Stays', 'Family & Couple Friendly Verified Hotels', 'Near Station / Temple / Airport Options', 'Flexible Check-in & Meal Plans'],
    icon: 'Building2',
  },
  {
    id: 'srv-tour',
    key: 'tour',
    title: 'Domestic & Family Holiday Packages',
    shortDesc: 'All-inclusive customized tour packages for Kashmir, Himachal, Goa, Kerala, Rajasthan & more.',
    fullDesc: 'Complete end-to-end holiday planning including train/flight tickets, hotel stays, sightseeing cab transfers, and meals.',
    features: ['Customized Family & Group Itineraries', 'Complete Transport + Hotel + Sightseeing', 'Dedicated Tour Coordinator', 'Transparent Package Pricing'],
    icon: 'Compass',
  },
];

const FALLBACK_PACKAGES: TourPackage[] = [
  {
    id: 'pkg-1',
    title: 'Vaishno Devi & Jammu Yatra',
    category: 'Religious',
    duration: '4 Days / 3 Nights',
    destination: 'Katra & Jammu',
    highlights: ['Return Train/Flight Assistance', 'Katra Hotel Stay near Ban Ganga', 'Yatra Parchi Registration Assistance'],
    inclusions: ['Hotel', 'Transfers', 'Breakfast', 'Ticket Assistance'],
    startingPrice: '₹6,499 / person',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80',
    featured: true,
    description: 'Complete pilgrimage package with train ticket reservation to Shri Mata Vaishno Devi Katra (SVDK) and comfortable family stay.',
  },
  {
    id: 'pkg-2',
    title: 'Royal Rajasthan Heritage Tour',
    category: 'Family',
    duration: '6 Days / 5 Nights',
    destination: 'Jaipur · Udaipur · Jodhpur',
    highlights: ['Amber Fort & City Palace', 'Lake Pichola Boat Ride', 'Private AC Sedan/SUV Transfers'],
    inclusions: ['3-Star Hotels', 'Breakfast & Dinner', 'Sightseeing Cab', 'Station Pickup'],
    startingPrice: '₹13,999 / person',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80',
    featured: true,
    description: 'Explore the forts, palaces, and vibrant culture of Jaipur, Jodhpur, and Udaipur with seamless rail and road connectivity.',
  },
  {
    id: 'pkg-3',
    title: 'Scenic Kashmir Paradise Escape',
    category: 'Holiday',
    duration: '5 Days / 4 Nights',
    destination: 'Srinagar · Gulmarg · Pahalgam',
    highlights: ['Dal Lake Shikara Ride', 'Deluxe Houseboat Stay', 'Gulmarg & Pahalgam Excursion'],
    inclusions: ['Hotels & Houseboat', 'MAP Meal Plan', 'Private Cab', 'Travel Support'],
    startingPrice: '₹15,499 / person',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=900&q=80',
    featured: true,
    description: 'Experience the snow-capped peaks and valleys of Kashmir with complete travel and accommodation support.',
  },
];

function resolveRouteState(pathname: string): {
  page: 'home' | 'train';
  trainTab: ActiveTrainTab;
  routePath: string;
} {
  const p = pathname.toLowerCase().replace(/\/+$/, '') || '/';
  if (p === '/live-train-status') {
    return { page: 'train', trainTab: 'live-status', routePath: '/live-train-status' };
  }
  if (p === '/pnr-status' || p === '/pnr-check' || p === '/pnr') {
    return { page: 'train', trainTab: 'pnr-status', routePath: '/pnr-status' };
  }
  if (p === '/live-station') {
    return { page: 'train', trainTab: 'live-station', routePath: '/live-station' };
  }
  if (p === '/train-timetable' || p === '/timetable') {
    return { page: 'train', trainTab: 'schedule', routePath: '/train-timetable' };
  }
  if (p === '/train' || p === '/trains' || p.startsWith('/train/')) {
    return { page: 'train', trainTab: 'booking', routePath: '/train' };
  }
  return { page: 'home', trainTab: 'booking', routePath: '/' };
}

function getPathForTrainTab(tab: ActiveTrainTab): string {
  switch (tab) {
    case 'live-status':
      return '/live-train-status';
    case 'pnr-status':
      return '/pnr-status';
    case 'live-station':
      return '/live-station';
    case 'schedule':
      return '/train-timetable';
    case 'station-search':
      return '/train';
    case 'booking':
    default:
      return '/train';
  }
}

export default function App() {
  const [settings, setSettings] = useState<WebsiteSettings>(DEFAULT_SETTINGS);
  const [services, setServices] = useState<ServiceItem[]>(FALLBACK_SERVICES);
  const [packages, setPackages] = useState<TourPackage[]>(FALLBACK_PACKAGES);
  const [loading, setLoading] = useState(true);

  // Auth & Admin states
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // Interactive modals
  const [policyModal, setPolicyModal] = useState<'privacy' | 'terms' | null>(null);
  const [submittedEnquiryData, setSubmittedEnquiryData] = useState<{
    enquiry: Enquiry;
    whatsappUrl: string;
  } | null>(null);

  const [preselectedContactService, setPreselectedContactService] = useState<ServiceType | undefined>(undefined);
  const [activeBookingTab, setActiveBookingTab] = useState<ServiceType>('train');

  const initialRoute = typeof window !== 'undefined'
    ? resolveRouteState(window.location.pathname)
    : { page: 'home' as const, trainTab: 'booking' as ActiveTrainTab, routePath: '/' };

  const [currentPage, setCurrentPage] = useState<'home' | 'train'>(initialRoute.page);
  const [activeTrainTab, setActiveTrainTab] = useState<ActiveTrainTab>(initialRoute.trainTab);
  const [activeRoute, setActiveRoute] = useState<string>(initialRoute.routePath);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname.toLowerCase();
      if (p === '/bus' || p === '/buses' || p.startsWith('/bus/')) {
        setCurrentPage('home');
        setActiveRoute('/');
        setActiveBookingTab('bus');
        return;
      }
      const next = resolveRouteState(window.location.pathname);
      setCurrentPage(next.page);
      setActiveTrainTab(next.trainTab);
      setActiveRoute(next.routePath);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Check if initially loaded on /bus
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
      if (p === '/bus' || p === '/buses' || p.startsWith('/bus/')) {
        setActiveBookingTab('bus');
        setTimeout(() => {
          const el = document.getElementById('train-booking');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    }
  }, []);

  const navigateToRoute = (targetUrl: string, tabOverride?: ActiveTrainTab) => {
    const resolved = resolveRouteState(targetUrl);
    const finalTab = tabOverride || resolved.trainTab;
    setCurrentPage(resolved.page);
    setActiveTrainTab(finalTab);
    setActiveRoute(resolved.routePath);
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({}, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch initial public data (resilient so Home Page always works even if backend API is slow/down)
  const loadPublicData = async () => {
    try {
      const [sData, srvData, pkgData] = await Promise.all([
        fetchSettings().catch(() => DEFAULT_SETTINGS),
        fetchServices().catch(() => FALLBACK_SERVICES),
        fetchPackages().catch(() => FALLBACK_PACKAGES),
      ]);
      if (sData) setSettings(sData);
      if (Array.isArray(srvData) && srvData.length > 0) setServices(srvData);
      if (Array.isArray(pkgData) && pkgData.length > 0) setPackages(pkgData);
    } catch (err) {
      console.error('Error fetching public agency data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check existing session
  const verifySession = async () => {
    try {
      const session = await checkAdminSession();
      if (session.authenticated && session.user) {
        setIsAdminLoggedIn(true);
        setAdminUser(session.user);
      } else {
        setIsAdminLoggedIn(false);
        setAdminUser(null);
      }
    } catch {
      setIsAdminLoggedIn(false);
      setAdminUser(null);
    }
  };

  useEffect(() => {
    loadPublicData();
    verifySession();
  }, []);

  const handleLogout = async () => {
    await logoutAdmin();
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    setShowAdminDashboard(false);
  };

  const handleScrollToSection = (sectionId: string) => {
    // Dedicated Railway Feature Routes
    if (sectionId === 'live-train-status') {
      navigateToRoute('/live-train-status', 'live-status');
      return;
    }
    if (sectionId === 'pnr-status') {
      navigateToRoute('/pnr-status', 'pnr-status');
      return;
    }
    if (sectionId === 'live-station') {
      navigateToRoute('/live-station', 'live-station');
      return;
    }
    if (sectionId === 'train-timetable') {
      navigateToRoute('/train-timetable', 'schedule');
      return;
    }
    if (sectionId === 'train-booking' || sectionId === 'train') {
      navigateToRoute('/train', 'booking');
      return;
    }

    if (sectionId === 'station-search') {
      if (currentPage !== 'home') {
        navigateToRoute('/');
        setTimeout(() => {
          const el = document.getElementById('all-station-search');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
      } else {
        const el = document.getElementById('all-station-search');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    // If currently on /train or a railway tool page and navigating to a home section
    if (currentPage !== 'home') {
      navigateToRoute('/');
      setTimeout(() => {
        if (sectionId === 'flight-booking') {
          setActiveBookingTab('flight');
          const el = document.getElementById('train-booking');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (sectionId === 'bus-booking' || sectionId === 'services-bus') {
          setActiveBookingTab('bus');
          const el = document.getElementById('train-booking');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (sectionId === 'hotel-booking') {
          setActiveBookingTab('hotel');
          const el = document.getElementById('train-booking');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (sectionId === 'hero') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return;
    }

    // Already on home page
    if (sectionId === 'flight-booking') {
      setActiveBookingTab('flight');
      const el = document.getElementById('train-booking');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (sectionId === 'bus-booking' || sectionId === 'services-bus') {
      setActiveBookingTab('bus');
      const el = document.getElementById('train-booking');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (sectionId === 'hotel-booking') {
      setActiveBookingTab('hotel');
      const el = document.getElementById('train-booking');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectServiceForBooking = (serviceKey: string) => {
    if (serviceKey === 'train') {
      navigateToRoute('/train', 'booking');
    } else if (serviceKey === 'flight' || serviceKey === 'bus' || serviceKey === 'hotel') {
      if (currentPage !== 'home') {
        navigateToRoute('/');
      }
      setActiveBookingTab(serviceKey as ServiceType);
      setTimeout(() => {
        const el = document.getElementById('train-booking');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    } else {
      if (currentPage !== 'home') {
        navigateToRoute('/');
      }
      setPreselectedContactService(serviceKey as ServiceType);
      setTimeout(() => {
        const el = document.getElementById('contact');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }
  };

  const cleanWhatsApp = settings.whatsapp.replace(/[^0-9]/g, '');

  const railwayFeatureCards = [
    {
      id: 'live-train-status',
      route: '/live-train-status',
      tab: 'live-status' as ActiveTrainTab,
      title: 'Live Train Status',
      badge: 'Real-Time Running',
      description: 'Track train running status by 5-digit train number and journey start date: last reported station, delay, next stop, and expected arrival.',
      ctaText: 'Check Live Status',
      icon: Activity,
      accentBg: 'bg-emerald-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'pnr-status',
      route: '/pnr-status',
      tab: 'pnr-status' as ActiveTrainTab,
      title: 'PNR Status Check',
      badge: '10-Digit Enquiry',
      description: 'Validate and check your 10-digit IRCTC PNR status for current seat confirmation, coach/berth status, and chart preparation.',
      ctaText: 'Check PNR Status',
      icon: FileCheck,
      accentBg: 'bg-orange-500',
      badgeBg: 'bg-orange-50 text-orange-700 border-orange-200',
    },
    {
      id: 'live-station',
      route: '/live-station',
      tab: 'live-station' as ActiveTrainTab,
      title: 'Live Station',
      badge: 'Arrivals & Departures',
      description: 'Search by station name or IRCTC code to see upcoming trains in the next 2–8 hours, scheduled vs. expected timings, delays, and platforms.',
      ctaText: 'Open Station Board',
      icon: Building,
      accentBg: 'bg-sky-600',
      badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    {
      id: 'train-timetable',
      route: '/train-timetable',
      tab: 'schedule' as ActiveTrainTab,
      title: 'Train Timetable',
      badge: 'Full Route Schedule',
      description: 'View official scheduled train routes, source & destination, station codes, arrival/departure timings, stop durations, and distances.',
      ctaText: 'View Train Schedule',
      icon: CalendarDays,
      accentBg: 'bg-[#0B2545]',
      badgeBg: 'bg-slate-100 text-[#0B2545] border-slate-300',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-[#0B2545]">
        <div className="p-4 rounded-2xl bg-white shadow-xl border border-slate-200 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          <span className="font-bold text-sm tracking-wide">Loading Aazam Travel Agency...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans selection:bg-orange-500 selection:text-white overflow-x-hidden">
      {/* Header */}
      <Header
        settings={settings}
        currentPage={currentPage}
        activeRoute={activeRoute}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminLogin={() => setShowAdminLogin(true)}
        onOpenAdminDashboard={() => setShowAdminDashboard(true)}
        onNavigateSection={handleScrollToSection}
      />

      {/* Main Content: Dedicated Railway / Train Portal OR Home Landing Page */}
      <main className="flex-1">
        {currentPage === 'train' ? (
          <TrainPage
            agencyPhone={settings.phone}
            agencyWhatsApp={settings.whatsapp}
            initialTab={activeTrainTab}
            onTabRouteChange={(tab) => {
              setActiveTrainTab(tab);
              const nextPath = getPathForTrainTab(tab);
              setActiveRoute(nextPath);
              if (window.location.pathname !== nextPath) {
                window.history.pushState({}, '', nextPath);
              }
            }}
            onEnquirySuccess={(data) => setSubmittedEnquiryData(data)}
            onNavigateHome={() => navigateToRoute('/')}
            onNavigateSection={handleScrollToSection}
          />
        ) : (
          <>
            {/* 1. Hero Section */}
            <Hero
              settings={settings}
              onBookTrainClick={() => navigateToRoute('/train', 'booking')}
              onBookFlightClick={() => {
                setActiveBookingTab('flight');
                handleScrollToSection('flight-booking');
              }}
              onBookHotelClick={() => {
                setActiveBookingTab('hotel');
                handleScrollToSection('hotel-booking');
              }}
              onExploreServicesClick={() => handleScrollToSection('services')}
              onSearchStationsClick={() => handleScrollToSection('station-search')}
            />

            {/* 2. Four Working Railway Feature Cards (Live Train Status, PNR Check, Live Station, Train Timetable) */}
            <section id="railway-tools" className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200/80">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-2">
                      <Train className="w-3.5 h-3.5" />
                      <span>Indian Railways Enquiry & Tracking Tools</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545] tracking-tight">
                      Live Railway Status, PNR Check & Station Timetable
                    </h2>
                    <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                      Direct access to Indian Railways live train running status, 10-digit PNR enquiry, live station arrival/departure boards, and full route timetables.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigateToRoute('/train', 'booking')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B2545] hover:bg-slate-900 text-white font-bold text-xs shadow-sm transition-all self-start md:self-auto"
                  >
                    <Train className="w-4 h-4 text-orange-400" />
                    <span>Open Full Railway Reservation Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {railwayFeatureCards.map((card) => {
                    const IconComponent = card.icon;
                    return (
                      <div
                        key={card.id}
                        onClick={() => navigateToRoute(card.route, card.tab)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            navigateToRoute(card.route, card.tab);
                          }
                        }}
                        className="group bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-orange-300 transition-all duration-200 flex flex-col justify-between cursor-pointer text-left"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-4">
                            <div className={`w-12 h-12 rounded-2xl ${card.accentBg} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                              <IconComponent className="w-6 h-6" />
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${card.badgeBg}`}>
                              {card.badge}
                            </span>
                          </div>

                          <h3 className="text-lg font-black text-[#0B2545] group-hover:text-orange-600 transition-colors mb-2">
                            {card.title}
                          </h3>

                          <p className="text-xs text-slate-600 leading-relaxed mb-5">
                            {card.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0B2545] group-hover:text-orange-600">
                          <span>{card.ctaText}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 3. Unified Travel Booking Engine (Train, Flight, Bus, Hotel & Tour Booking) */}
            <BookingHubSection
              agencyPhone={settings.phone}
              agencyWhatsApp={settings.whatsapp}
              activeServiceTab={activeBookingTab}
              onTabChange={(t) => setActiveBookingTab(t)}
              onEnquirySuccess={(data) => setSubmittedEnquiryData(data)}
            />

            {/* 4. All Station With Code SearchBar Section */}
            <section id="all-station-search" className="py-12 bg-slate-100/70 border-y border-slate-200/80">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <StationSearchBar
                  onSelectStationForBooking={() => {
                    navigateToRoute('/train', 'booking');
                  }}
                  onCheckLiveBoard={() => {
                    navigateToRoute('/live-station', 'live-station');
                  }}
                />
              </div>
            </section>

            {/* 5. Our Services Section (Train, Flight, Bus, Hotel, Tour Packages) */}
            <ServicesSection
              services={services}
              agencyWhatsApp={settings.whatsapp}
              onSelectServiceForBooking={handleSelectServiceForBooking}
            />

            {/* 6. Why Choose Us & How It Works */}
            <WhyChooseUs />

            {/* 7. Tour Packages Section */}
            <TourPackagesSection
              packages={packages}
              agencyWhatsApp={settings.whatsapp}
              agencyPhone={settings.phone}
              onBookPackage={(pkg) => {
                setPreselectedContactService(pkg.category === 'Religious' ? 'religious' : 'tour');
                handleScrollToSection('contact');
              }}
            />

            {/* 8. Universal Contact & Booking Section */}
            <ContactSection
              settings={settings}
              preselectedService={preselectedContactService}
              onEnquirySuccess={(data) => setSubmittedEnquiryData(data)}
            />
          </>
        )}
      </main>

      {/* Footer */}
      {currentPage === 'home' ? (
        <Footer
          settings={settings}
          onOpenPrivacy={() => setPolicyModal('privacy')}
          onOpenTerms={() => setPolicyModal('terms')}
          onOpenAdminLogin={() => {
            if (isAdminLoggedIn) setShowAdminDashboard(true);
            else setShowAdminLogin(true);
          }}
          onNavigateSection={handleScrollToSection}
        />
      ) : (
        <footer className="bg-[#07192F] text-slate-400 py-6 border-t border-slate-800 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Logo iconClassName="h-8 w-auto" isDark={true} showSubtitle={false} />
              <span className="text-[11px] text-slate-400">
                Pan-India 100% Online IRCTC Train & Travel Booking Service
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>© {new Date().getFullYear()} Aazam Travel Agency · All Rights Reserved</span>
              <button
                onClick={() => {
                  if (isAdminLoggedIn) setShowAdminDashboard(true);
                  else setShowAdminLogin(true);
                }}
                className="text-slate-400 hover:text-orange-400 transition-colors"
              >
                Staff Portal
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* Floating Action Buttons (Sticky Quick WhatsApp & Admin) */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3 pointer-events-auto">
        {isAdminLoggedIn && (
          <button
            onClick={() => setShowAdminDashboard(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#0B2545] text-white text-xs font-bold shadow-xl border border-blue-800 hover:bg-blue-900 transition-all hover:scale-105"
            title="Open Admin Dashboard"
          >
            <ShieldCheck className="w-4 h-4 text-orange-400" />
            <span className="hidden sm:inline">Admin Active</span>
          </button>
        )}

        {/* Quick WhatsApp Floating Button (+91 94215 56220) */}
        <a
          href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
            'Hello Aazam Travel Agency, I need assistance with Pan-India online train & travel booking.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-700/30 transition-all hover:scale-105 active:scale-95"
          aria-label="Direct WhatsApp Chat"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="hidden sm:inline">WhatsApp (+91 94215 56220)</span>
        </a>
      </div>

      {/* WhatsApp Modal after Enquiry Submission */}
      {submittedEnquiryData && (
        <WhatsAppSuccessModal
          enquiry={submittedEnquiryData.enquiry}
          whatsappUrl={submittedEnquiryData.whatsappUrl}
          onClose={() => setSubmittedEnquiryData(null)}
        />
      )}

      {/* Privacy Policy & Terms Modal */}
      <PolicyModals
        type={policyModal}
        onClose={() => setPolicyModal(null)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onLoginSuccess={(user) => {
          setIsAdminLoggedIn(true);
          setAdminUser(user);
          setShowAdminDashboard(true);
        }}
      />

      {/* Full Admin Dashboard Modal/Panel */}
      {showAdminDashboard && adminUser && (
        <AdminDashboard
          adminUser={adminUser}
          initialSettings={settings}
          initialServices={services}
          initialPackages={packages}
          onLogout={handleLogout}
          onClose={() => setShowAdminDashboard(false)}
          onRefreshPublicData={loadPublicData}
        />
      )}
    </div>
  );
}

