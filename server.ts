import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  configure as configureRailKit,
  checkPNRStatus as railKitCheckPNRStatus,
  getTrainInfo as railKitGetTrainInfo,
  trackTrain as railKitTrackTrain,
  trackTrainV2 as railKitTrackTrainV2,
  liveAtStation as railKitLiveAtStation,
  stationByCode as railKitStationByCode,
  stationsByName as railKitStationsByName,
} from 'railkit';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

// Data persistence
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'travel_agency.json');

interface AdminUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: 'superadmin' | 'admin';
  createdAt: string;
}

export interface EnquiryNote {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface PassengerDetail {
  id: string;
  name: string;
  age: string;
  gender: 'Male' | 'Female' | 'Transgender';
  berthPreference?: string;
  seatPreference?: string;
  mealPreference?: string;
  seniorCitizen?: boolean;
}

export interface Enquiry {
  id: string;
  serviceType: 'train' | 'flight' | 'bus' | 'hotel' | 'tour' | 'religious';
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  origin: string;
  destination: string;
  travelDate: string;
  returnDate?: string;
  passengers: number;
  passengerList?: PassengerDetail[];
  preferredClass?: string;
  quota?: string;
  tripType?: 'oneway' | 'roundtrip';
  rooms?: number;
  hotelCategory?: string;
  mealPlan?: string;
  specialRequests?: string;
  status: 'New' | 'Contacted' | 'Pending' | 'Confirmed' | 'Cancelled';
  notes: EnquiryNote[];
  createdAt: string;
  updatedAt: string;
}

export interface TourPackage {
  id: string;
  title: string;
  category: 'Domestic' | 'Religious' | 'Holiday' | 'Family';
  duration: string;
  destination: string;
  highlights: string[];
  inclusions: string[];
  startingPrice: string;
  image: string;
  featured: boolean;
  description: string;
}

export interface ServiceItem {
  id: string;
  key: 'train' | 'flight' | 'bus' | 'hotel' | 'tour' | 'religious';
  title: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  icon: string;
}

export interface WebsiteSettings {
  businessName: string;
  category: string;
  tagline: string;
  location: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  heroHeadline: string;
  heroSubheadline: string;
  announcement: string;
  announcementActive: boolean;
  officeHours: string;
  verifiedClaims: string[];
}

interface DatabaseSchema {
  adminUsers: AdminUser[];
  enquiries: Enquiry[];
  tourPackages: TourPackage[];
  services: ServiceItem[];
  settings: WebsiteSettings;
  sessions: { [token: string]: { userId: string; email: string; expiresAt: number } };
}

// Password hashing helpers
function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  const checkHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(checkHash), Buffer.from(hash));
}

// Initial default seed
function getInitialData(): DatabaseSchema {
  const defaultSalt = crypto.randomBytes(16).toString('hex');
  const defaultHash = hashPassword('AazamTravels@2026', defaultSalt);

  return {
    adminUsers: [
      {
        id: 'admin-1',
        name: 'Aazam Shaikh',
        email: 'admin@aazamtravels.com',
        passwordHash: defaultHash,
        salt: defaultSalt,
        role: 'superadmin',
        createdAt: new Date().toISOString(),
      },
    ],
    settings: {
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
    },
    services: [
      {
        id: 'srv-1',
        key: 'train',
        title: 'Train Ticket Booking (Pan-India)',
        shortDesc: '100% Online railway ticket booking assistance across all stations in India.',
        fullDesc:
          'Expert Indian Railways online booking assistance covering all zones and 7,000+ stations across India. Get help with General reservation, Tatkal timing guidance, Premium Tatkal, RAC and waitlist updates, class recommendations, and senior citizen lower berth preferences. Receive your confirmed E-Ticket directly on WhatsApp.',
        features: [
          'Pan-India Indian Railways (IRCTC) ticket booking for all routes',
          'Instant E-Ticket & PNR delivery straight to your WhatsApp',
          'Sleeper, 3A, 2A, 1A, Vande Bharat, Rajdhani & Tejas booking support',
          'Tatkal & Premium Tatkal quick online assistance',
          '100% Online payment via UPI, Google Pay, PhonePe & Net Banking',
        ],
        icon: 'Train',
      },
      {
        id: 'srv-2',
        key: 'flight',
        title: 'Flight Ticket Booking',
        shortDesc: 'Domestic and international flight booking enquiries.',
        fullDesc:
          'Competitive airfares for domestic sectors across India and international flight routes worldwide. We assist with baggage allowances, web check-in, seat preference, and airline schedule comparisons.',
        features: [
          'Domestic connections across Delhi, Mumbai, Bengaluru, Hyderabad & Kolkata',
          'International flights to UAE, Saudi Arabia, Europe & Asia',
          'Baggage allowance guidance and special meals',
          'Web check-in and boarding pass coordination online',
        ],
        icon: 'Plane',
      },
      {
        id: 'srv-3',
        key: 'bus',
        title: 'Bus Ticket Booking',
        shortDesc: 'Intercity AC Sleeper, Volvo, and luxury bus bookings across India.',
        fullDesc:
          'Reliable intercity bus bookings connecting all major cities and states across India. AC Sleeper, Multi-axle Volvo, and seater buses with instant WhatsApp ticket delivery.',
        features: [
          'Daily departures connecting major metropolitan cities and towns',
          'Multi-axle Volvo, BharatBenz & AC Sleeper coaches',
          'Convenient city boarding points with live location tracking',
          'Instant digital m-ticket sent to your phone',
        ],
        icon: 'Bus',
      },
      {
        id: 'srv-4',
        key: 'hotel',
        title: 'Hotel Reservations',
        shortDesc: 'Hotel stays for family, business, and holiday travel.',
        fullDesc:
          'Verified hotel stays tailored to your budget and group requirements. From business hotels near transit hubs to peaceful holiday resorts and pilgrimage dharamshalas across India.',
        features: [
          'Budget-friendly, 3-star, 4-star, and luxury hotels',
          'Family suites, extra beds & meal plans (CP, MAP, AP)',
          'Early check-in requests & verified amenities',
          'Central locations near railway stations & airports',
        ],
        icon: 'Building2',
      },
      {
        id: 'srv-5',
        key: 'tour',
        title: 'Tour Packages',
        shortDesc: 'Customized domestic and international holiday packages.',
        fullDesc:
          'End-to-end holiday planning crafted around your schedule and budget. Includes hotel accommodations, sightseeing cabs, meal options, and transfers for families, couples, and groups.',
        features: [
          'Complete customized itineraries for family & groups',
          'Popular destinations: Kashmir, Kerala, Goa, Rajasthan, Himachal',
          'Dedicated private cab for sightseeing',
          'Full travel support throughout your journey',
        ],
        icon: 'Compass',
      },
      {
        id: 'srv-6',
        key: 'religious',
        title: 'Religious Tours',
        shortDesc: 'Travel arrangements for religious destinations and pilgrimages.',
        fullDesc:
          'Specialized assistance for pilgrimage journeys. We organize seamless travel for Umrah, Ajmer Sharif Ziyarat, Shirdi Sai Baba, Tirupati Balaji, and sacred temple tours across India with sensitive care for elders.',
        features: [
          'Complete Umrah & Ziyarat travel coordination',
          'Shirdi, Trimbakeshwar, Shegaon & Jyotirlinga circuits',
          'Elderly passenger care & wheelchair assistance requests',
          'Hotels within walking distance of sacred shrines',
        ],
        icon: 'MapPin',
      },
    ],
    tourPackages: [
      {
        id: 'pkg-1',
        title: 'Kashmir Valley Paradise Tour',
        category: 'Holiday',
        duration: '6 Nights / 7 Days',
        destination: 'Srinagar, Gulmarg, Pahalgam, Sonamarg',
        highlights: ['Dal Lake Shikara ride', 'Gulmarg Gondola cable car', 'Betaab Valley & Aru Valley excursion', 'Traditional Houseboat stay'],
        inclusions: ['Deluxe hotel & houseboat stay', 'Daily breakfast & dinner', 'Private cab for all transfers & sightseeing', 'Toll, parking & driver allowance'],
        startingPrice: 'Rs. 18,500 per person',
        image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
        featured: true,
        description: 'Experience heaven on earth with our curated Kashmir itinerary designed for families and honeymooners with comfortable stays and scenic private transfers.',
      },
      {
        id: 'pkg-2',
        title: 'Umrah & Madinah Pilgrimage Package',
        category: 'Religious',
        duration: '14 Nights / 15 Days',
        destination: 'Makkah & Madinah (Saudi Arabia)',
        highlights: ['Hotels close to Haram Sharif', 'Complete Ziyarat in Makkah & Madinah', 'Roundtrip airport & intercity transfers', 'Experienced guidance throughout'],
        inclusions: ['Visa assistance & medical insurance', 'Star category hotel stay', 'Daily buffet meals', 'Private AC coach transfers'],
        startingPrice: 'Rs. 78,000 per person',
        image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
        featured: true,
        description: 'Complete peace of mind for your sacred Umrah journey with hotel accommodations near the Holy Mosques and experienced ground coordination.',
      },
      {
        id: 'pkg-3',
        title: 'Goa Coastal Getaway',
        category: 'Holiday',
        duration: '4 Nights / 5 Days',
        destination: 'North & South Goa',
        highlights: ['Calangute, Baga & Anjuna beach access', 'Mandovi river cruise', 'Old Goa churches & spice plantation tour', 'Dudhsagar waterfall trip'],
        inclusions: ['4-star resort stay with swimming pool', 'Daily buffet breakfast', 'Airport/station pickup & drop', 'Sightseeing in private vehicle'],
        startingPrice: 'Rs. 11,500 per person',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
        featured: false,
        description: 'Relax and recharge on the sun-kissed beaches of Goa with resort comforts, water activities, and heritage sights.',
      },
      {
        id: 'pkg-4',
        title: 'Maharashtra Jyotirlinga & Shirdi Pilgrimage',
        category: 'Religious',
        duration: '4 Nights / 5 Days',
        destination: 'Shirdi, Trimbakeshwar, Grishneshwar, Bhimashankar',
        highlights: ['VIP Darshan assistance guidance', 'Special timings for senior citizens', 'Scenic Western Ghats route', 'Visit to Ellora caves & Shani Shingnapur'],
        inclusions: ['AC Deluxe hotel rooms', 'AC private sedan/Innova for entire tour', 'Daily breakfast', 'All toll, state tax & driver charges'],
        startingPrice: 'Rs. 9,800 per person',
        image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80',
        featured: true,
        description: 'A deeply spiritual journey connecting the revered shrines of Maharashtra with pickup options from major hubs.',
      },
      {
        id: 'pkg-5',
        title: 'Royal Rajasthan Heritage Tour',
        category: 'Domestic',
        duration: '5 Nights / 6 Days',
        destination: 'Jaipur, Jodhpur, Udaipur',
        highlights: ['Amber Fort elephant & jeep ride', 'City Palace & Lake Pichola boat ride', 'Mehrangarh Fort exploration', 'Chokhi Dhani cultural village'],
        inclusions: ['Heritage hotel accommodations', 'Daily breakfast & dinner', 'AC vehicle with knowledgeable chauffeur', 'Monument entry guidance'],
        startingPrice: 'Rs. 16,900 per person',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
        featured: false,
        description: 'Discover majestic palaces, desert landscapes, and rich royal heritage with seamless hospitality.',
      },
      {
        id: 'pkg-6',
        title: 'Kerala Backwaters & Munnar Hills',
        category: 'Domestic',
        duration: '5 Nights / 6 Days',
        destination: 'Cochin, Munnar, Thekkady, Alleppey',
        highlights: ['Munnar tea gardens & waterfalls', 'Periyar wildlife boating', 'Alleppey private backwater houseboat', 'Spice plantation walk'],
        inclusions: ['Hill resort & deluxe houseboat', 'All meals on houseboat & breakfast at resorts', 'Private AC car throughout', 'Toll & parking'],
        startingPrice: 'Rs. 15,200 per person',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
        featured: false,
        description: 'Lush greenery, mist-covered hills, and tranquil backwaters in God’s Own Country.',
      },
    ],
    enquiries: [
      {
        id: 'ENQ-1001',
        serviceType: 'train',
        customerName: 'Rajesh Sharma',
        customerPhone: '+91 98223 41029',
        customerEmail: 'rajesh.sharma@example.com',
        origin: 'New Delhi (NDLS)',
        destination: 'Mumbai CSMT (CSMT)',
        travelDate: '2026-10-22',
        passengers: 3,
        preferredClass: '3A - Third AC',
        specialRequests: 'Prefer 12952 Mumbai Rajdhani Express. 1 senior citizen lower berth.',
        status: 'New',
        notes: [
          {
            id: 'n-1',
            text: 'Customer requested 3A berth for family, checked timetable for Rajdhani Express.',
            author: 'Aazam Shaikh',
            createdAt: '2026-10-10T05:30:00.000Z',
          },
        ],
        createdAt: '2026-10-10T05:25:00.000Z',
        updatedAt: '2026-10-10T05:30:00.000Z',
      },
      {
        id: 'ENQ-1002',
        serviceType: 'train',
        customerName: 'Mohd Farooq',
        customerPhone: '+91 94056 12890',
        customerEmail: 'farooq.travel@example.com',
        origin: 'Indore Junction (INDB)',
        destination: 'Shri Mata Vaishno Devi Katra (SVDK)',
        travelDate: '2026-10-25',
        passengers: 2,
        preferredClass: '2A - Second AC',
        specialRequests: 'Pune Nagpur Garib Rath or Maharashtra Express.',
        status: 'Contacted',
        notes: [
          {
            id: 'n-2',
            text: 'Messaged on WhatsApp with train timings and fare details.',
            author: 'Aazam Shaikh',
            createdAt: '2026-10-10T06:15:00.000Z',
          },
        ],
        createdAt: '2026-10-09T14:10:00.000Z',
        updatedAt: '2026-10-10T06:15:00.000Z',
      },
      {
        id: 'ENQ-1003',
        serviceType: 'religious',
        customerName: 'Abdul Rashid',
        customerPhone: '+91 91584 77210',
        customerEmail: 'rashid.travel@example.com',
        origin: 'New Delhi',
        destination: 'Makkah & Madinah',
        travelDate: '2026-11-15',
        passengers: 4,
        preferredClass: 'Economy',
        specialRequests: 'Looking for 15-day Umrah package with elderly parents, hotel within 400m of Haram.',
        status: 'Pending',
        notes: [
          {
            id: 'n-3',
            text: 'Discussed hotel options in Makkah. Awaiting passport copies.',
            author: 'Aazam Shaikh',
            createdAt: '2026-10-09T18:00:00.000Z',
          },
        ],
        createdAt: '2026-10-09T11:45:00.000Z',
        updatedAt: '2026-10-09T18:00:00.000Z',
      },
      {
        id: 'ENQ-1004',
        serviceType: 'flight',
        customerName: 'Priya Deshmukh',
        customerPhone: '+91 97655 88912',
        customerEmail: 'priya.deshmukh@example.com',
        origin: 'Nagpur (NAG)',
        destination: 'New Delhi (DEL)',
        travelDate: '2026-10-30',
        passengers: 1,
        preferredClass: 'Economy',
        specialRequests: 'Morning flight before 11 AM. 15kg check-in baggage needed.',
        status: 'Confirmed',
        notes: [
          {
            id: 'n-4',
            text: 'Flight confirmed with IndiGo 6E-634. E-ticket sent via WhatsApp & email.',
            author: 'Aazam Shaikh',
            createdAt: '2026-10-08T16:20:00.000Z',
          },
        ],
        createdAt: '2026-10-08T09:30:00.000Z',
        updatedAt: '2026-10-08T16:20:00.000Z',
      },
      {
        id: 'ENQ-1005',
        serviceType: 'bus',
        customerName: 'Sanjay Wankhede',
        customerPhone: '+91 98901 23456',
        origin: 'Indore (Sarwate)',
        destination: 'Bhopal (ISBT)',
        travelDate: '2026-10-18',
        passengers: 2,
        preferredClass: 'AC Sleeper',
        specialRequests: 'Lower double sleeper berth preferred in luxury coach.',
        status: 'Confirmed',
        notes: [
          {
            id: 'n-5',
            text: 'Confirmed with Hans Travels AC Sleeper. Boarding at Sarwate Bus Stand.',
            author: 'Aazam Shaikh',
            createdAt: '2026-10-07T19:00:00.000Z',
          },
        ],
        createdAt: '2026-10-07T12:00:00.000Z',
        updatedAt: '2026-10-07T19:00:00.000Z',
      },
      {
        id: 'ENQ-1006',
        serviceType: 'tour',
        customerName: 'Girish Joshi',
        customerPhone: '+91 94228 90123',
        customerEmail: 'girish.joshi@example.com',
        origin: 'Jaipur',
        destination: 'Kashmir Valley',
        travelDate: '2026-11-05',
        passengers: 4,
        preferredClass: 'Deluxe',
        specialRequests: 'Family trip with 2 kids. Houseboat in Dal Lake required.',
        status: 'New',
        notes: [],
        createdAt: '2026-10-10T02:15:00.000Z',
        updatedAt: '2026-10-10T02:15:00.000Z',
      },
    ],
    sessions: {},
  };
}

function loadDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initial = getInitialData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database, creating fresh backup:', err);
    const initial = getInitialData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
}

function saveDatabase(db: DatabaseSchema) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tempPath = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempPath, JSON.stringify(db, null, 2), 'utf-8');
  fs.renameSync(tempPath, DB_FILE);
}

// Authentication middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }
  const token = authHeader.split(' ')[1];
  const db = loadDatabase();
  const session = db.sessions[token];

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized: Session invalid or expired' });
  }

  if (Date.now() > session.expiresAt) {
    delete db.sessions[token];
    saveDatabase(db);
    return res.status(401).json({ error: 'Session expired, please log in again' });
  }

  (req as any).adminUser = session;
  next();
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // ==========================================
  // Public API Endpoints
  // ==========================================

  // 1. Get Website Settings
  app.get('/api/settings', (_req: Request, res: Response) => {
    const db = loadDatabase();
    res.json(db.settings);
  });

  // 2. Get Services
  app.get('/api/services', (_req: Request, res: Response) => {
    const db = loadDatabase();
    res.json(db.services);
  });

  // 3. Get Tour Packages
  app.get('/api/packages', (_req: Request, res: Response) => {
    const db = loadDatabase();
    res.json(db.tourPackages);
  });

  // ==========================================
  // Indian Railways via RailKit API (https://railkit.in/)
  // ==========================================
  const getRailKitApiKey = () =>
    (
      process.env.RAILKIT_API_KEY ||
      process.env.RAILRADAR_API_KEY ||
      process.env.INDIAN_RAIL_API_KEY ||
      ''
    ).trim();

  const ensureRailKitConfigured = (): string => {
    const key = getRailKitApiKey();
    if (key) {
      configureRailKit(key);
    }
    return key;
  };

  function getIstDateParts(dateObj = new Date()): { dd: string; mm: string; yyyy: string; ddmmyyyy: string; isoDate: string; yyyymmdd: string } {
    const ist = new Date(dateObj.getTime() + 5.5 * 3600 * 1000);
    const dd = String(ist.getUTCDate()).padStart(2, '0');
    const mm = String(ist.getUTCMonth() + 1).padStart(2, '0');
    const yyyy = String(ist.getUTCFullYear());
    return {
      dd,
      mm,
      yyyy,
      ddmmyyyy: `${dd}-${mm}-${yyyy}`,
      isoDate: `${yyyy}-${mm}-${dd}`,
      yyyymmdd: `${yyyy}${mm}${dd}`,
    };
  }

  function parseInputDateForRailKit(rawDate?: string) {
    const todayIst = getIstDateParts();
    const cleaned = String(rawDate || '').trim();
    if (!cleaned) {
      return {
        ...todayIst,
        isFuture: false,
      };
    }

    let yyyy = todayIst.yyyy;
    let mm = todayIst.mm;
    let dd = todayIst.dd;

    if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
      [yyyy, mm, dd] = cleaned.split('-');
    } else if (/^\d{2}-\d{2}-\d{4}$/.test(cleaned)) {
      [dd, mm, yyyy] = cleaned.split('-');
    } else if (/^\d{8}$/.test(cleaned)) {
      yyyy = cleaned.slice(0, 4);
      mm = cleaned.slice(4, 6);
      dd = cleaned.slice(6, 8);
    }

    const yyyymmdd = `${yyyy}${mm}${dd}`;
    return {
      dd,
      mm,
      yyyy,
      ddmmyyyy: `${dd}-${mm}-${yyyy}`,
      isoDate: `${yyyy}-${mm}-${dd}`,
      yyyymmdd,
      isFuture: yyyymmdd > todayIst.yyyymmdd,
    };
  }

  function parseRailKitDelayMinutes(rawDelay?: string | number | null): number {
    if (rawDelay === null || rawDelay === undefined) return 0;
    if (typeof rawDelay === 'number') return Math.max(0, Math.round(rawDelay));
    const str = String(rawDelay).trim();
    if (!str || /on\s*time|right\s*time|no\s*delay/i.test(str) || str === '00:00' || str === '0') {
      return 0;
    }
    const hhmm = str.match(/^(\d{1,2}):(\d{2})$/);
    if (hhmm) {
      return parseInt(hhmm[1], 10) * 60 + parseInt(hhmm[2], 10);
    }
    const mins = parseInt(str.replace(/[^0-9]/g, ''), 10);
    return isNaN(mins) ? 0 : mins;
  }

  function formatRailKitDelayDisplay(rawDelay?: string | number | null, forTable = false): string {
    const mins = parseRailKitDelayMinutes(rawDelay);
    if (mins <= 0) {
      return forTable ? '00 M' : 'On Time (00 M)';
    }
    if (forTable) {
      return `${mins} M`;
    }
    if (mins >= 60) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return m > 0 ? `${h}h ${m}m (${mins} M)` : `${h}h (${mins} M)`;
    }
    return `${mins} min (${mins} M)`;
  }

  const FALLBACK_STATIONS = [
    { NameEn: 'NEW DELHI', NameHn: 'नई दिल्ली', StationCode: 'NDLS', Longitude: '77.2200', Latitude: '28.6400' },
    { NameEn: 'MUMBAI CSMT', NameHn: 'मुंबई छत्रपति शिवाजी टर्मिनस', StationCode: 'CSMT', Longitude: '72.8354', Latitude: '18.9400' },
    { NameEn: 'MUMBAI CENTRAL', NameHn: 'मुंबई सेंट्रल', StationCode: 'MMCT', Longitude: '72.8193', Latitude: '18.9712' },
    { NameEn: 'HOWRAH JN', NameHn: 'हावड़ा जं.', StationCode: 'HWH', Longitude: '88.3426', Latitude: '22.5850' },
    { NameEn: 'INDORE JN', NameHn: 'इंदौर जं.', StationCode: 'INDB', Longitude: '75.8600', Latitude: '22.7200' },
    { NameEn: 'PUNE JN', NameHn: 'पुणे जं.', StationCode: 'PUNE', Longitude: '73.8744', Latitude: '18.5284' },
    { NameEn: 'NAGPUR JN', NameHn: 'नागपुर जं.', StationCode: 'NGP', Longitude: '79.0882', Latitude: '21.1500' },
    { NameEn: 'AHMEDABAD JN', NameHn: 'अहमदाबाद जं.', StationCode: 'ADI', Longitude: '72.6009', Latitude: '23.0225' },
    { NameEn: 'BHOPAL JN', NameHn: 'भोपाल जं.', StationCode: 'BPL', Longitude: '77.4126', Latitude: '23.2599' },
    { NameEn: 'VARANASI JN', NameHn: 'वाराणसी जं.', StationCode: 'BSB', Longitude: '82.9863', Latitude: '25.3270' },
    { NameEn: 'KANPUR CENTRAL', NameHn: 'कानपुर सेंट्रल', StationCode: 'CNB', Longitude: '80.3500', Latitude: '26.4500' },
    { NameEn: 'LUCKNOW NR', NameHn: 'लखनऊ', StationCode: 'LKO', Longitude: '80.9200', Latitude: '26.8300' },
    { NameEn: 'GORAKHPUR JN', NameHn: 'गोरखपुर जं.', StationCode: 'GKP', Longitude: '83.3700', Latitude: '26.7600' },
    { NameEn: 'DARBHANGA JN', NameHn: 'दरभंगा जं.', StationCode: 'DBG', Longitude: '85.9000', Latitude: '26.1500' },
    { NameEn: 'PATNA JN', NameHn: 'पटना जं.', StationCode: 'PNBE', Longitude: '85.1376', Latitude: '25.6022' },
    { NameEn: 'SAMASTIPUR JN', NameHn: 'समस्तीपुर जं.', StationCode: 'SPJ', Longitude: '85.7800', Latitude: '25.8600' },
    { NameEn: 'HAJIPUR JN', NameHn: 'हाजीपुर जं.', StationCode: 'HJP', Longitude: '85.21554', Latitude: '25.702949' },
    { NameEn: 'BENGALURU CITY', NameHn: 'बेंगलुरु', StationCode: 'SBC', Longitude: '77.5700', Latitude: '12.9780' },
    { NameEn: 'CHENNAI CENTRAL', NameHn: 'चेन्नई सेंट्रल', StationCode: 'MAS', Longitude: '80.2785', Latitude: '13.0827' },
    { NameEn: 'SECUNDERABAD JN', NameHn: 'सिकंदराबाद जं.', StationCode: 'SC', Longitude: '78.5034', Latitude: '17.4344' },
    { NameEn: 'HYDERABAD DECCAN', NameHn: 'हैदराबाद', StationCode: 'HYB', Longitude: '78.4744', Latitude: '17.3916' },
    { NameEn: 'JAIPUR JN', NameHn: 'जयपुर जं.', StationCode: 'JP', Longitude: '75.7873', Latitude: '26.9196' },
    { NameEn: 'SURAT', NameHn: 'सूरत', StationCode: 'ST', Longitude: '72.8407', Latitude: '21.2049' },
    { NameEn: 'VADODARA JN', NameHn: 'वडोदरा जं.', StationCode: 'BRC', Longitude: '73.1812', Latitude: '22.3107' },
    { NameEn: 'UJJAIN JN', NameHn: 'उज्जैन जं.', StationCode: 'UJN', Longitude: '75.7800', Latitude: '23.1700' },
    { NameEn: 'JAMMU TAWI', NameHn: 'जम्मू तवी', StationCode: 'JAT', Longitude: '74.8700', Latitude: '32.7060' },
    { NameEn: 'SHMATA VD KATRA', NameHn: 'श्री माता वैष्णो देवी कटरा', StationCode: 'SVDK', Longitude: '74.9500', Latitude: '32.9900' },
    { NameEn: 'HAZRAT NIZAMUDDIN', NameHn: 'हज़रत निज़ामुद्दीन', StationCode: 'NZM', Longitude: '77.2533', Latitude: '28.5888' },
    { NameEn: 'BHUSAVAL JN', NameHn: 'भुसावल जं.', StationCode: 'BSL', Longitude: '75.7885', Latitude: '21.0455' },
    { NameEn: 'NASHIK ROAD', NameHn: 'नाशिक रोड', StationCode: 'NK', Longitude: '73.8447', Latitude: '19.9535' },
    { NameEn: 'KALYAN JN', NameHn: 'कल्याण जं.', StationCode: 'KYN', Longitude: '73.1300', Latitude: '19.2400' },
    { NameEn: 'THIRUVANANTHAPURAM CENTRAL', NameHn: 'तिरुवनंतपुरम सेंट्रल', StationCode: 'TVC', Longitude: '76.9525', Latitude: '8.4875' },
  ];

  async function resolveStationWithRailKit(rawInput: string): Promise<{ code: string; name: string }> {
    const cleaned = rawInput.trim().toUpperCase();
    const parenMatch = cleaned.match(/\(([A-Z0-9]{1,5})\)/);
    const candidate = parenMatch ? parenMatch[1] : cleaned;

    const exactLocal = FALLBACK_STATIONS.find((s) => s.StationCode === candidate);
    if (exactLocal) return { code: exactLocal.StationCode, name: exactLocal.NameEn };

    const byNameLocal = FALLBACK_STATIONS.find(
      (s) =>
        s.NameEn === cleaned ||
        s.NameEn.startsWith(cleaned) ||
        s.NameEn.includes(cleaned) ||
        (s.NameHn && s.NameHn.includes(cleaned))
    );
    if (byNameLocal) return { code: byNameLocal.StationCode, name: byNameLocal.NameEn };

    const key = ensureRailKitConfigured();
    if (key) {
      if (/^[A-Z]{1,5}$/.test(candidate)) {
        try {
          const byCodeRes = await railKitStationByCode(candidate);
          if (byCodeRes?.success && byCodeRes.data?.code) {
            return {
              code: String(byCodeRes.data.code).toUpperCase(),
              name: String(byCodeRes.data.name || candidate),
            };
          }
        } catch {
          // fall through to stationsByName
        }
      }

      if (cleaned.length >= 2) {
        try {
          const byNameRes = await railKitStationsByName(cleaned.toLowerCase());
          const stns = byNameRes?.data?.stations;
          if (byNameRes?.success && Array.isArray(stns) && stns.length > 0) {
            return {
              code: String(stns[0].code).toUpperCase(),
              name: String(stns[0].name || stns[0].code),
            };
          }
        } catch {
          // ignore
        }
      }
    }

    const safeCode = candidate.replace(/[^A-Z0-9]/g, '').slice(0, 5);
    return { code: safeCode, name: safeCode };
  }

  // API Configuration Status (never exposes secret values)
  app.get('/api/train/config-status', (_req: Request, res: Response) => {
    const hasRailKitKey = Boolean(getRailKitApiKey());
    res.json({
      success: true,
      provider: 'RailKit (https://railkit.in)',
      providers: {
        railKitConfigured: hasRailKitKey,
        liveTrainSupported: hasRailKitKey,
        liveStationSupported: hasRailKitKey,
        pnrSupported: hasRailKitKey,
        timetableSupported: true,
      },
      requiredEnvVars: {
        RAILKIT_API_KEY: hasRailKitKey
          ? 'configured'
          : 'missing (required for Live Train Status, PNR Check, Live Station & Timetable via https://railkit.in/)',
      },
    });
  });

  // 3a. Live Train Running Status Proxy (RailKit trackTrain / trackTrainV2)
  app.get('/api/train/live-status', async (req: Request, res: Response) => {
    const rawTrain = String(req.query.trainNumber || '').trim();
    const cleanNumber = rawTrain.replace(/[^0-9]/g, '');
    const rawDate = String(req.query.date || '').trim();

    if (!cleanNumber || cleanNumber.length !== 5) {
      return res.status(400).json({
        success: false,
        ResponseCode: '400',
        errorCode: 'INVALID_TRAIN_NUMBER',
        error: 'Please enter a valid 5-digit Indian Railways train number (e.g. 12919, 12952, 12565).',
      });
    }

    const parsedDate = parseInputDateForRailKit(rawDate);
    if (parsedDate.isFuture) {
      return res.status(400).json({
        success: false,
        ResponseCode: '400',
        errorCode: 'FUTURE_DATE_NOT_ALLOWED',
        error: 'Live train running status is not available for future dates. Please select today or a recent departure date (up to 5 days ago in IST).',
      });
    }

    const railKitKey = ensureRailKitConfigured();
    if (!railKitKey) {
      return res.status(503).json({
        success: false,
        ResponseCode: '503',
        errorCode: 'API_KEY_MISSING',
        error:
          'RailKit API key is not configured on the server. Please set RAILKIT_API_KEY in the server environment variables (.env) to enable real-time train tracking via https://railkit.in/. We never display fabricated train locations or delays.',
        officialEnquiryUrl: 'https://enquiry.indianrail.gov.in/mntes/',
      });
    }

    try {
      let result = await railKitTrackTrain(cleanNumber, parsedDate.ddmmyyyy);
      if (!result?.success) {
        const v2Result = await railKitTrackTrainV2(cleanNumber, parsedDate.ddmmyyyy);
        if (v2Result?.success) {
          result = v2Result;
        }
      }

      if (!result?.success || !result.data) {
        const errMsg =
          result?.error ||
          `Unable to retrieve live running status for Train #${cleanNumber} on ${parsedDate.ddmmyyyy} from RailKit.`;
        const isAuth = /invalid api key|inactive|not configured/i.test(errMsg);
        const isRateLimit = /limit exceeded|429/i.test(errMsg);
        const status = isAuth ? 401 : isRateLimit ? 429 : 404;

        return res.status(status).json({
          success: false,
          ResponseCode: String(status),
          errorCode: isAuth ? 'API_AUTH_FAILED' : isRateLimit ? 'RATE_LIMITED' : 'LIVE_STATUS_UNAVAILABLE',
          error: errMsg,
          officialEnquiryUrl: 'https://enquiry.indianrail.gov.in/mntes/',
        });
      }

      const d = result.data;
      const timelineArr = Array.isArray(d.timeline) ? d.timeline : [];
      const stoppages = timelineArr.filter((t: any) => t.type === 'stoppage');
      const stationsList = stoppages.length > 0 ? stoppages : timelineArr;

      const curStop =
        stationsList.find((s: any) => s.status === 'current') ||
        stationsList.find((s: any) => s.stationCode === d.currentStationCode) ||
        [...stationsList].reverse().find((s: any) => s.status === 'passed') ||
        stationsList[0] ||
        null;

      const nextStop =
        stationsList.find((s: any) => s.status === 'upcoming') ||
        null;

      const curDelayRaw =
        curStop?.departure?.delay && curStop.departure.delay !== ''
          ? curStop.departure.delay
          : curStop?.arrival?.delay || '';

      return res.json({
        success: true,
        ResponseCode: '200',
        Provider: 'RailKit (https://railkit.in)',
        StartDate: d.date || parsedDate.ddmmyyyy,
        TrainNumber: d.trainNo || cleanNumber,
        TrainName: d.trainName || `Train #${cleanNumber}`,
        CurrentPosition: d.statusNote || (curStop ? `At ${curStop.stationName} (${curStop.stationCode})` : 'Running'),
        LastUpdated: d.lastUpdate || new Date().toISOString(),
        LastUpdatedAt: d.lastUpdate || new Date().toISOString(),
        Progress: d.progress || null,
        NextStation: nextStop
          ? {
              StationName: nextStop.stationName || nextStop.stationCode,
              StationCode: nextStop.stationCode,
              Distance: `${nextStop.distanceKm ?? 0} km`,
              ScheduledArrival: nextStop.arrival?.scheduled || '-',
              ExpectedArrival: nextStop.arrival?.actual || nextStop.arrival?.scheduled || '-',
              Delay: formatRailKitDelayDisplay(nextStop.arrival?.delay, false),
              Platform: nextStop.platform || '-',
            }
          : null,
        CurrentStation: curStop
          ? {
              SerialNo: String(stationsList.indexOf(curStop) + 1),
              StationName: curStop.stationName || curStop.stationCode,
              StationCode: curStop.stationCode,
              Distance: `${curStop.distanceKm ?? 0} km`,
              Platform: curStop.platform || '-',
              IsDeparted:
                curStop.status === 'passed' || /departed/i.test(String(d.statusNote || ''))
                  ? 'YES'
                  : 'NO',
              Day: '1',
              ScheduleArrival: curStop.arrival?.scheduled || '-',
              ActualArrival: curStop.arrival?.actual || '-',
              DelayInArrival: formatRailKitDelayDisplay(curDelayRaw, false),
              ScheduleDeparture: curStop.departure?.scheduled || '-',
              ActualDeparture: curStop.departure?.actual || '-',
              DelayInDeparture: formatRailKitDelayDisplay(curStop.departure?.delay, false),
            }
          : null,
        TrainRoute: stationsList.map((stn: any, idx: number) => {
          const stnDelay =
            stn.arrival?.delay && stn.arrival.delay !== ''
              ? stn.arrival.delay
              : stn.departure?.delay || '';
          return {
            SerialNo: String(idx + 1),
            StationName: stn.stationName || stn.stationCode,
            StationCode: stn.stationCode,
            Distance: `${stn.distanceKm ?? 0} km`,
            Platform: stn.platform || '-',
            IsDeparted: stn.status === 'passed' ? 'YES' : 'NO',
            Status: stn.status || 'upcoming',
            Day: '1',
            ScheduleArrival: stn.arrival?.scheduled || '-',
            ActualArrival: stn.arrival?.actual || stn.arrival?.scheduled || '-',
            DelayInArrival: formatRailKitDelayDisplay(stnDelay, true),
            ScheduleDeparture: stn.departure?.scheduled || '-',
            ActualDeparture: stn.departure?.actual || stn.departure?.scheduled || '-',
            DelayInDeparture: formatRailKitDelayDisplay(stn.departure?.delay, true),
          };
        }),
        Message: 'SUCCESS',
      });
    } catch (err: any) {
      return res.status(502).json({
        success: false,
        ResponseCode: '502',
        errorCode: 'RAILKIT_UPSTREAM_ERROR',
        error: `RailKit live status request failed: ${err?.message || 'Unable to connect to RailKit service.'}`,
        officialEnquiryUrl: 'https://enquiry.indianrail.gov.in/mntes/',
      });
    }
  });

  // 3b. PNR Status Check Proxy via RailKit checkPNRStatus (Strict 10-Digit Validation & Real Response Only)
  app.get('/api/train/pnr-status', async (req: Request, res: Response) => {
    const rawPnr = String(req.query.pnrNumber || '').trim();
    const cleanPnr = rawPnr.replace(/[^0-9]/g, '');

    if (!/^\d{10}$/.test(cleanPnr)) {
      return res.status(400).json({
        success: false,
        ResponseCode: '400',
        errorCode: 'INVALID_PNR_FORMAT',
        error: 'Please enter a valid 10-digit numeric PNR number (e.g. 5827194603).',
      });
    }

    const railKitKey = ensureRailKitConfigured();
    if (!railKitKey) {
      return res.status(503).json({
        success: false,
        ResponseCode: '503',
        errorCode: 'PNR_API_NOT_CONFIGURED',
        error:
          'PNR lookup requires RAILKIT_API_KEY to be configured on the server (https://railkit.in/). We never fabricate ticket confirmations, passenger details, coach numbers, or berth allocations.',
        limitationNote:
          'Configure RAILKIT_API_KEY in the server environment (.env) to enable direct PNR lookup via RailKit, or check your PNR on the official Indian Railways portal.',
        officialEnquiryUrl: 'https://www.indianrail.gov.in/enquiry/PNR/PnrEnquiry.html',
      });
    }

    try {
      const result = await railKitCheckPNRStatus(cleanPnr);

      if (result?.success && result.data) {
        const d = result.data;
        const rawPassengers = Array.isArray(d.passengers) ? d.passengers : [];

        return res.json({
          success: true,
          Provider: 'RailKit (https://railkit.in)',
          PnrNumber: d.pnr || cleanPnr,
          Status: 'SUCCESS',
          ResponseCode: '200',
          TrainNumber: d.train?.number || '',
          TrainName: d.train?.name || '',
          JourneyClass: d.journey?.class || '',
          Quota: d.journey?.quota || 'GN',
          ChatPrepared:
            /prepared/i.test(String(d.chart?.status || '')) && !/not\s+prepared/i.test(String(d.chart?.status || ''))
              ? 'YES'
              : d.chart?.status || 'NO',
          From: d.journey?.source
            ? `${d.journey.source.name} (${d.journey.source.code})`
            : '',
          To: d.journey?.destination
            ? `${d.journey.destination.name} (${d.journey.destination.code})`
            : '',
          BoardingPoint: d.journey?.boardingPoint
            ? `${d.journey.boardingPoint.name} (${d.journey.boardingPoint.code})`
            : '',
          JourneyDate: d.journey?.dateOfJourney || '',
          ArrivalDate: d.journey?.arrivalDate || '',
          BookingFare: d.booking?.fare || d.booking?.ticketFare || null,
          Passangers: rawPassengers.map((p: any, idx: number) => ({
            Passenger: p.serialNumber || `Passenger ${idx + 1}`,
            BookingStatus: p.booking?.details || p.booking?.status || '-',
            CurrentStatus: p.current?.details || p.current?.status || '-',
            Coach: p.current?.coach || p.booking?.coach || '-',
            BerthNo: p.current?.berthNo ?? p.booking?.berthNo ?? '-',
            BerthCode: p.current?.berthCode || p.booking?.berthCode || '-',
          })),
          LastUpdatedAt: new Date().toISOString(),
        });
      }

      const errMsg =
        result?.error ||
        'PNR not found, flushed, or not yet generated in the Indian Railways CRIS reservation system.';
      const isAuth = /invalid api key|inactive|not configured/i.test(errMsg);
      const isRateLimit = /limit exceeded|429/i.test(errMsg);
      const status = isAuth ? 401 : isRateLimit ? 429 : 404;

      return res.status(status).json({
        success: false,
        ResponseCode: String(status),
        errorCode: isAuth ? 'API_AUTH_FAILED' : isRateLimit ? 'RATE_LIMITED' : 'PNR_NOT_FOUND_OR_INVALID',
        error: `PNR ${cleanPnr}: ${errMsg}`,
        officialEnquiryUrl: 'https://www.indianrail.gov.in/enquiry/PNR/PnrEnquiry.html',
      });
    } catch (err: any) {
      return res.status(504).json({
        success: false,
        ResponseCode: '504',
        errorCode: 'NETWORK_FAILURE',
        error: `RailKit PNR enquiry error: ${err?.message || 'Unable to reach RailKit PNR service.'}`,
        officialEnquiryUrl: 'https://www.indianrail.gov.in/enquiry/PNR/PnrEnquiry.html',
      });
    }
  });

  // 3c. Station Autocomplete Proxy (RailKit stationsByName + stationByCode + Local Directory)
  app.get('/api/train/station-autocomplete', async (req: Request, res: Response) => {
    const query = String(req.query.query || '').trim().toUpperCase();

    if (!query) {
      return res.json({ ResponseCode: '200', Status: 'SUCCESS', Station: [] });
    }

    const combined: Array<{ NameEn: string; NameHn: string; StationCode: string; Longitude: string; Latitude: string }> = [];
    const seenCodes = new Set<string>();

    // 1. Query RailKit stationsByName if configured
    const railKitKey = ensureRailKitConfigured();
    if (railKitKey && query.length >= 2) {
      try {
        const byNameRes = await railKitStationsByName(query.toLowerCase());
        const stns = byNameRes?.data?.stations;
        if (byNameRes?.success && Array.isArray(stns)) {
          for (const s of stns) {
            const code = String(s.code || '').toUpperCase();
            if (code && !seenCodes.has(code)) {
              seenCodes.add(code);
              combined.push({
                NameEn: String(s.name || code).toUpperCase(),
                NameHn: '',
                StationCode: code,
                Latitude: String(s.lat || ''),
                Longitude: String(s.lon || ''),
              });
            }
          }
        }
      } catch {
        // fall through to local stations
      }
    }

    // 2. Merge matching stations from local directory
    for (const s of FALLBACK_STATIONS) {
      if (
        !seenCodes.has(s.StationCode) &&
        (s.StationCode.includes(query) ||
          s.NameEn.includes(query) ||
          (s.NameHn && s.NameHn.includes(query)))
      ) {
        seenCodes.add(s.StationCode);
        combined.push(s);
      }
    }

    return res.json({
      ResponseCode: '200',
      Status: 'SUCCESS',
      Station: combined.slice(0, 15),
      Message: null,
    });
  });

  // Verified Published Indian Railways Static Timetables (Fallback when offline)
  const PUBLISHED_TIMETABLES: Record<string, any> = {
    '12919': {
      train: {
        number: '12919',
        name: 'Malwa SF Express',
        type: 'Superfast Express',
        category: 'Superfast',
        source: { code: 'DADN', name: 'Dr. Ambedkar Nagar (Mhow)' },
        destination: { code: 'SVDK', name: 'Shri Mata Vaishno Devi Katra' },
        runDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        distance: 1641,
        duration: 1720,
        avgSpeed: 57.2,
        maxSpeed: 110,
        totalHalts: 15,
        returnTrain: '12920',
      },
      route: [
        { sequence: 1, station: { code: 'INDB', name: 'Indore Junction' }, arrival: '12:05', departure: '12:15', arrivalDay: 1, departureDay: 1, distance: 21, isHalt: true, platform: '4', haltMinutes: 10 },
        { sequence: 2, station: { code: 'DWX', name: 'Dewas Junction' }, arrival: '12:51', departure: '12:53', arrivalDay: 1, departureDay: 1, distance: 63, isHalt: true, platform: '2', haltMinutes: 2 },
        { sequence: 3, station: { code: 'UJN', name: 'Ujjain Junction' }, arrival: '13:40', departure: '13:55', arrivalDay: 1, departureDay: 1, distance: 103, isHalt: true, platform: '1', haltMinutes: 15 },
        { sequence: 4, station: { code: 'BPL', name: 'Bhopal Junction' }, arrival: '17:15', departure: '17:25', arrivalDay: 1, departureDay: 1, distance: 287, isHalt: true, platform: '3', haltMinutes: 10 },
        { sequence: 5, station: { code: 'VGLJ', name: 'Virangana Lakshmibai Jhansi' }, arrival: '21:30', departure: '21:38', arrivalDay: 1, departureDay: 1, distance: 576, isHalt: true, platform: '4', haltMinutes: 8 },
        { sequence: 6, station: { code: 'NDLS', name: 'New Delhi' }, arrival: '04:15', departure: '04:30', arrivalDay: 2, departureDay: 2, distance: 988, isHalt: true, platform: '7', haltMinutes: 15 },
        { sequence: 7, station: { code: 'SVDK', name: 'Shri Mata Vaishno Devi Katra' }, arrival: '16:30', departure: null, arrivalDay: 2, departureDay: 2, distance: 1641, isHalt: true, platform: '2', haltMinutes: 0 },
      ],
    },
  };

  // 3d. Train Schedule & Timetable Proxy via RailKit getTrainInfo
  app.get('/api/train/schedule', async (req: Request, res: Response) => {
    const rawNumber = String(req.query.trainNumber || req.query.train || req.query.number || '').trim();
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

    if (!cleanNumber || cleanNumber.length !== 5) {
      return res.status(400).json({
        success: false,
        errorCode: 'INVALID_TRAIN_NUMBER',
        error: 'Please enter a valid 5-digit Indian Railways train number (e.g. 12919, 12952, 12565).',
      });
    }

    const railKitKey = ensureRailKitConfigured();

    if (railKitKey) {
      try {
        const result = await railKitGetTrainInfo(cleanNumber);
        if (result?.success && result.data?.trainInfo && Array.isArray(result.data.route)) {
          const info = result.data.trainInfo;
          const rawRoute = result.data.route;

          // Parse running_days string (e.g. "1111111") into day names
          const dayNames = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
          const runDaysStr = String(info.running_days || '1111111');
          const runDays =
            runDaysStr.length === 7
              ? dayNames.filter((_, i) => runDaysStr[i] === '1')
              : dayNames;

          // Parse travel_time (e.g. "28:40 hrs" or "16:55 hrs") into minutes
          let durationMins = 0;
          const timeMatch = String(info.travel_time || '').match(/(\d+):(\d+)/);
          if (timeMatch) {
            durationMins = parseInt(timeMatch[1], 10) * 60 + parseInt(timeMatch[2], 10);
          }

          const totalDist = Number(info.total_distance || rawRoute[rawRoute.length - 1]?.distance || 0);
          const avgSpeed =
            durationMins > 0 && totalDist > 0
              ? Math.round((totalDist / (durationMins / 60)) * 10) / 10
              : 60;

          return res.json({
            success: true,
            isScheduledTimetableOnly: true,
            data: {
              train: {
                number: String(info.train_no || cleanNumber),
                name: String(info.train_name || `Train #${cleanNumber}`),
                type: String(info.type || info.subtype || 'Express'),
                category: String(info.subtype || info.type || 'Scheduled'),
                source: {
                  code: String(info.from_stn_code || rawRoute[0]?.stnCode || ''),
                  name: String(info.from_stn_name || rawRoute[0]?.stnName || ''),
                },
                destination: {
                  code: String(info.to_stn_code || rawRoute[rawRoute.length - 1]?.stnCode || ''),
                  name: String(info.to_stn_name || rawRoute[rawRoute.length - 1]?.stnName || ''),
                },
                runDays,
                distance: totalDist,
                duration: durationMins,
                avgSpeed,
                maxSpeed: info.type === 'RAJDHANI' || info.type === 'VANDE BHARAT' ? 130 : 110,
                totalHalts: rawRoute.length,
              },
              route: rawRoute.map((r: any, idx: number) => ({
                sequence: idx + 1,
                station: {
                  code: String(r.stnCode || ''),
                  name: String(r.stnName || r.stnCode || ''),
                },
                arrival: !r.arrival || r.arrival === '--' || r.arrival === 'SRC' ? null : String(r.arrival),
                departure: !r.departure || r.departure === '--' || r.departure === 'DSTN' ? null : String(r.departure),
                arrivalDay: Number(r.day) || 1,
                departureDay: Number(r.day) || 1,
                distance: Number(r.distance) || 0,
                halt: r.halt || null,
                haltMinutes: typeof r.haltMinutes === 'number' ? r.haltMinutes : null,
                isHalt: true,
                platform: r.platform ? String(r.platform) : null,
                coordinates: r.coordinates || null,
              })),
            },
            meta: {
              timestamp: new Date().toISOString(),
              source: 'railkit-api',
              note: 'Official scheduled railway timetable via RailKit (https://railkit.in) — not live running status.',
            },
          });
        }
      } catch (err) {
        console.warn('RailKit getTrainInfo failed:', err);
      }
    }

    if (PUBLISHED_TIMETABLES[cleanNumber]) {
      return res.json({
        success: true,
        isScheduledTimetableOnly: true,
        data: PUBLISHED_TIMETABLES[cleanNumber],
        meta: {
          timestamp: new Date().toISOString(),
          source: 'published-railway-timetable',
        },
      });
    }

    return res.status(railKitKey ? 404 : 503).json({
      success: false,
      errorCode: railKitKey ? 'TRAIN_TIMETABLE_NOT_FOUND' : 'TIMETABLE_API_KEY_REQUIRED',
      error: railKitKey
        ? `No scheduled timetable found for Train #${cleanNumber} on RailKit. Please verify the 5-digit train number.`
        : `RAILKIT_API_KEY is not configured on the server. Please set RAILKIT_API_KEY in .env to fetch train timetables via https://railkit.in/.`,
      officialEnquiryUrl: 'https://enquiry.indianrail.gov.in/mntes/',
    });
  });

  // 3e. Live Train Status (Route alias using RailKit trackTrain)
  app.get('/api/railradar/train/live/:trainNumber', async (req: Request, res: Response) => {
    const rawNumber = String(req.params.trainNumber || '').trim();
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

    if (!cleanNumber || cleanNumber.length !== 5) {
      return res.status(400).json({
        success: false,
        errorCode: 'INVALID_TRAIN_NUMBER',
        error: 'Please enter a valid 5-digit Indian Railways train number (e.g. 12919, 12952, 12565).',
      });
    }

    const railKitKey = ensureRailKitConfigured();
    if (!railKitKey) {
      return res.status(503).json({
        success: false,
        errorCode: 'RAILKIT_API_KEY_MISSING',
        error: 'Live Train Status requires RAILKIT_API_KEY to be configured on the server (https://railkit.in/).',
        officialEnquiryUrl: 'https://enquiry.indianrail.gov.in/mntes/',
      });
    }

    try {
      const todayIst = getIstDateParts();
      const result = await railKitTrackTrain(cleanNumber, todayIst.ddmmyyyy);
      if (result?.success && result.data) {
        return res.json({
          success: true,
          data: result.data,
          meta: {
            timestamp: new Date().toISOString(),
            source: 'railkit-api',
          },
        });
      }

      return res.status(404).json({
        success: false,
        errorCode: 'LIVE_TRAIN_NOT_FOUND',
        error: result?.error || `No active live status found for Train #${cleanNumber} on ${todayIst.ddmmyyyy}.`,
        officialEnquiryUrl: 'https://enquiry.indianrail.gov.in/mntes/',
      });
    } catch (err: any) {
      return res.status(504).json({
        success: false,
        errorCode: 'NETWORK_ERROR',
        error: `Unable to reach RailKit live train service: ${err?.message || 'network error'}`,
        officialEnquiryUrl: 'https://enquiry.indianrail.gov.in/mntes/',
      });
    }
  });

  // 3f. Live Station Board via RailKit liveAtStation (Supports Station Name or Station Code)
  const handleLiveStationRequest = async (req: Request, res: Response) => {
    const rawInput = String(req.params.stationCode || req.query.station || '').trim();
    const rawHours = parseInt(String(req.query.hours || req.query.hrs || '4'), 10) || 4;
    const validHours: 2 | 4 | 8 = rawHours <= 2 ? 2 : rawHours <= 4 ? 4 : 8;

    if (!rawInput) {
      return res.status(400).json({
        success: false,
        errorCode: 'INVALID_STATION_CODE',
        error: 'Please enter a valid station name or station code (e.g. Indore, INDB, New Delhi, NDLS, CSMT).',
      });
    }

    const railKitKey = ensureRailKitConfigured();
    if (!railKitKey) {
      return res.status(503).json({
        success: false,
        errorCode: 'STATION_API_KEY_MISSING',
        error: 'Live Station Board requires RAILKIT_API_KEY to be configured on the server (https://railkit.in/). We never invent train movements, timings, or platform numbers.',
        officialEnquiryUrl: 'https://enquiry.indianrail.gov.in/mntes/',
      });
    }

    const resolved = await resolveStationWithRailKit(rawInput);
    const stationCode = resolved.code;

    if (!stationCode || !/^[A-Z]{1,5}$/.test(stationCode)) {
      return res.status(400).json({
        success: false,
        errorCode: 'INVALID_STATION_CODE',
        error: `Could not resolve "${rawInput}" to a valid Indian Railways station code. Try entering a station code like NDLS, INDB, CSMT, BPL, or HWH.`,
      });
    }

    try {
      const result = await railKitLiveAtStation(stationCode, validHours);

      if (!result?.success || !result.data) {
        const errMsg =
          result?.error ||
          `Unable to fetch live station board for ${resolved.name} (${stationCode}) from RailKit.`;
        const isAuth = /invalid api key|inactive|not configured/i.test(errMsg);
        const isRateLimit = /limit exceeded|429/i.test(errMsg);
        const status = isAuth ? 401 : isRateLimit ? 429 : 404;

        return res.status(status).json({
          success: false,
          errorCode: isAuth ? 'API_AUTH_FAILED' : isRateLimit ? 'RATE_LIMITED' : 'STATION_LIVE_UNAVAILABLE',
          station: { code: stationCode, name: resolved.name },
          error: errMsg,
          officialEnquiryUrl: 'https://enquiry.indianrail.gov.in/mntes/',
        });
      }

      const d = result.data;
      const rawTrains = Array.isArray(d.trains) ? d.trains : [];

      // Extract station name from summary if available (e.g. "7 Trains departing from/arriving at INDB- INDORE JN in next 4 Hrs.")
      let stationName = resolved.name;
      const summaryMatch = String(d.summary || '').match(/at\s+[A-Z0-9]+\s*-\s*([^.]+?)(?:\s+in\s+next\b|\.)/i);
      if (summaryMatch && summaryMatch[1]) {
        stationName = summaryMatch[1].trim();
      }

      const nowIst = new Date(Date.now() + 5.5 * 3600 * 1000);
      const pad = (n: number) => String(n).padStart(2, '0');
      const fromTime = `${pad(nowIst.getUTCHours())}:${pad(nowIst.getUTCMinutes())}`;
      const toTime = `${pad((nowIst.getUTCHours() + validHours) % 24)}:${pad(nowIst.getUTCMinutes())}`;

      return res.json({
        success: true,
        data: {
          station: {
            code: stationCode,
            name: stationName,
          },
          summary: d.summary || `${rawTrains.length} trains at ${stationName} (${stationCode}) in next ${validHours} hours`,
          window: {
            from: fromTime,
            to: toTime,
            hoursBack: 0,
            hoursAhead: validHours,
          },
          count: rawTrains.length,
          trains: rawTrains.map((t: any, idx: number) => {
            const arrDelayMin = parseRailKitDelayMinutes(t.arrival?.delay);
            const depDelayMin = parseRailKitDelayMinutes(t.departure?.delay);
            const delayMinutes = Math.max(arrDelayMin, depDelayMin);

            const schArr =
              !t.arrival?.scheduled || t.arrival.scheduled === 'SRC'
                ? null
                : String(t.arrival.scheduled);
            const schDep =
              !t.departure?.scheduled || t.departure.scheduled === 'DSTN'
                ? null
                : String(t.departure.scheduled);

            const actArr =
              !t.arrival?.actual || t.arrival.actual === 'SRC'
                ? schArr
                : String(t.arrival.actual);
            const actDep =
              !t.departure?.actual || t.departure.actual === 'DSTN'
                ? schDep
                : String(t.departure.actual);

            return {
              train: {
                number: String(t.trainNo || ''),
                name: String(t.trainName || `Train #${t.trainNo || ''}`),
                type: String(t.trainType || 'Express'),
                source: t.sourceName ? `${t.sourceName} (${t.source})` : String(t.source || '-'),
                destination: t.destName ? `${t.destName} (${t.dest})` : String(t.dest || '-'),
                runDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
              },
              stop: {
                sequence: idx + 1,
                arrival: schArr,
                departure: schDep,
                day: 1,
                distance: 0,
              },
              live: {
                type: t.cancelled ? 'cancelled' : delayMinutes > 0 ? 'en-route' : 'at-station',
                expectedArrivalTime: actArr || undefined,
                expectedDepartureTime: actDep || undefined,
                platform: t.platform ? String(t.platform) : undefined,
                delayMinutes,
              },
            };
          }),
        },
        meta: {
          timestamp: new Date().toISOString(),
          source: 'railkit-api',
        },
      });
    } catch (err: any) {
      return res.status(502).json({
        success: false,
        errorCode: 'RAILKIT_STATION_ERROR',
        station: { code: stationCode, name: resolved.name },
        error: `RailKit Live Station request failed: ${err?.message || 'network error'}`,
        officialEnquiryUrl: 'https://enquiry.indianrail.gov.in/mntes/',
      });
    }
  };

  app.get('/api/railradar/station/live/:stationCode', handleLiveStationRequest);
  app.get('/api/train/live-station/:stationCode', handleLiveStationRequest);

  // 3g. Coach Composition via RailKit trackTrain
  app.get('/api/railradar/train/coaches/:trainNumber/:stationCode?', async (req: Request, res: Response) => {
    const rawNumber = String(req.params.trainNumber || '').trim();
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
    const stationCode = req.params.stationCode ? String(req.params.stationCode).trim().toUpperCase() : '';

    if (!cleanNumber) {
      return res.status(400).json({ success: false, error: 'Train number is required' });
    }

    const railKitKey = ensureRailKitConfigured();
    if (railKitKey) {
      try {
        const todayIst = getIstDateParts();
        const liveRes = await railKitTrackTrain(cleanNumber, todayIst.ddmmyyyy);
        if (liveRes?.success && Array.isArray(liveRes.data?.coachPosition) && liveRes.data.coachPosition.length > 0) {
          const coachesRaw = liveRes.data.coachPosition;
          return res.json({
            success: true,
            data: {
              trainNumber: cleanNumber,
              trainName: liveRes.data.trainName || `Train #${cleanNumber}`,
              stationCode: stationCode || liveRes.data.currentStationCode || 'SRC',
              stationName: stationCode || liveRes.data.currentStationCode || 'Origin',
              direction: 'UP',
              platform: '1',
              baseFormation: coachesRaw.map((c: any) => c.number || c.type).join('-'),
              totalCoaches: coachesRaw.length,
              coaches: coachesRaw.map((c: any, i: number) => ({
                position: Number(c.position) || i + 1,
                code: String(c.number || c.type || `C${i + 1}`),
                category: String(c.coachClass || c.type || 'GEN'),
                classType: String(c.coachClass || c.type || 'GEN'),
                name: `Coach ${c.number || c.type} (${c.coachClass || c.coachType || 'Standard'})`,
                totalBerths: 72,
                hasSeats: c.type !== 'ENG' && c.type !== 'EOG',
                color: '#0284c7',
              })),
            },
            meta: {
              timestamp: new Date().toISOString(),
              source: 'railkit-api',
            },
          });
        }
      } catch {
        // ignore
      }
    }

    return res.status(404).json({
      success: false,
      error: `Coach composition not available for Train #${cleanNumber}.`,
    });
  });

  // 3h. Route GeoJSON via RailKit getTrainInfo
  app.get('/api/railradar/train/route/:trainNumber', async (req: Request, res: Response) => {
    const rawNumber = String(req.params.trainNumber || '').trim();
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

    if (!cleanNumber) {
      return res.status(400).json({ success: false, error: 'Train number is required' });
    }

    const railKitKey = ensureRailKitConfigured();
    if (railKitKey) {
      try {
        const infoRes = await railKitGetTrainInfo(cleanNumber);
        if (infoRes?.success && Array.isArray(infoRes.data?.route)) {
          const stops = infoRes.data.route
            .filter((r: any) => r.coordinates?.latitude && r.coordinates?.longitude)
            .map((r: any, idx: number) => ({
              sequence: idx + 1,
              code: r.stnCode,
              name: r.stnName,
              lat: Number(r.coordinates.latitude),
              lng: Number(r.coordinates.longitude),
            }));

          return res.json({
            success: true,
            data: {
              trainNumber: cleanNumber,
              format: 'geojson',
              geojson: {
                type: 'Feature',
                properties: { trainNumber: cleanNumber },
                geometry: {
                  type: 'LineString',
                  coordinates: stops.map((s: any) => [s.lng, s.lat]),
                },
              },
              stops,
            },
            meta: {
              timestamp: new Date().toISOString(),
              source: 'railkit-api',
            },
          });
        }
      } catch {
        // ignore
      }
    }

    return res.status(404).json({
      success: false,
      error: `Route coordinates not available for Train #${cleanNumber}.`,
    });
  });


  // 4. Submit Booking Enquiry (Public)
  app.post('/api/enquiries', (req: Request, res: Response) => {
    const {
      serviceType,
      customerName,
      customerPhone,
      customerEmail,
      origin,
      destination,
      travelDate,
      returnDate,
      passengers,
      passengerList,
      preferredClass,
      quota,
      tripType,
      rooms,
      hotelCategory,
      mealPlan,
      specialRequests,
    } = req.body;

    // Strict validations
    if (!customerName || !customerName.trim()) {
      return res.status(400).json({ error: 'Full name is required' });
    }
    if (!customerPhone || !customerPhone.trim()) {
      return res.status(400).json({ error: 'Phone / WhatsApp number is required' });
    }
    if (!origin || !origin.trim()) {
      return res.status(400).json({ error: 'Departure origin or city is required' });
    }
    if (!destination || !destination.trim()) {
      return res.status(400).json({ error: 'Destination or hotel is required' });
    }
    if (!travelDate || !travelDate.trim()) {
      return res.status(400).json({ error: 'Travel / Check-in date is required' });
    }

    const validServices = ['train', 'flight', 'bus', 'hotel', 'tour', 'religious'];
    const safeService = validServices.includes(serviceType) ? serviceType : 'train';

    const db = loadDatabase();
    const newId = `ENQ-${Date.now().toString().slice(-4)}${Math.floor(10 + Math.random() * 90)}`;

    const parsedPassengerList = Array.isArray(passengerList)
      ? passengerList.filter((p: any) => p && typeof p.name === 'string' && p.name.trim().length > 0)
      : undefined;

    const paxCount = parsedPassengerList && parsedPassengerList.length > 0
      ? parsedPassengerList.length
      : (Number(passengers) > 0 ? Number(passengers) : 1);

    const newEnquiry: Enquiry = {
      id: newId,
      serviceType: safeService as any,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail ? customerEmail.trim() : undefined,
      origin: origin.trim(),
      destination: destination.trim(),
      travelDate: travelDate.trim(),
      returnDate: returnDate ? returnDate.trim() : undefined,
      passengers: paxCount,
      passengerList: parsedPassengerList,
      preferredClass: preferredClass ? preferredClass.trim() : undefined,
      quota: quota ? quota.trim() : undefined,
      tripType: tripType ? tripType : undefined,
      rooms: Number(rooms) > 0 ? Number(rooms) : undefined,
      hotelCategory: hotelCategory ? hotelCategory.trim() : undefined,
      mealPlan: mealPlan ? mealPlan.trim() : undefined,
      specialRequests: specialRequests ? specialRequests.trim() : undefined,
      status: 'New',
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.enquiries.unshift(newEnquiry);
    saveDatabase(db);

    // Pre-build WhatsApp enquiry message to the Agency (+91 94215 56220)
    const agencyNumber = '919421556220';
    const serviceName = safeService === 'flight' 
      ? 'FLIGHT BOOKING' 
      : safeService === 'train' 
        ? 'IRCTC TRAIN BOOKING' 
        : safeService === 'bus'
          ? 'BUS TICKET BOOKING (AC SLEEPER / SEATER)'
          : safeService === 'hotel' 
            ? 'HOTEL BOOKING' 
            : `${safeService.toUpperCase()} BOOKING`;

    const messageLines: (string | null)[] = [
      `*Aazam Travel Agency Booking Enquiry*`,
      `*Booking Ref:* ${newId.replace('ENQ-', 'BKG-')}`,
      `*Service:* 🏷️ ${serviceName}`,
      `*Primary Contact:* ${newEnquiry.customerName}`,
      `*Phone:* ${newEnquiry.customerPhone}`,
      safeService === 'hotel'
        ? `*City / Location:* ${newEnquiry.origin}`
        : `*Route:* ${newEnquiry.origin} ➔ ${newEnquiry.destination}`,
      safeService === 'hotel'
        ? `*Check-in:* ${newEnquiry.travelDate}`
        : `*Date of Travel:* ${newEnquiry.travelDate}`,
      newEnquiry.returnDate
        ? (safeService === 'hotel' ? `*Check-out:* ${newEnquiry.returnDate}` : `*Return Date:* ${newEnquiry.returnDate}`)
        : null,
      `*Total Passengers / Guests:* ${newEnquiry.passengers}`,
      newEnquiry.preferredClass ? `*Class / Cabin:* ${newEnquiry.preferredClass}` : null,
      newEnquiry.quota ? `*Quota:* ${newEnquiry.quota}` : null,
      newEnquiry.rooms ? `*Rooms Required:* ${newEnquiry.rooms}` : null,
      newEnquiry.hotelCategory ? `*Property Category:* ${newEnquiry.hotelCategory}` : null,
      newEnquiry.mealPlan ? `*Meal Plan:* ${newEnquiry.mealPlan}` : null,
    ];

    // Append Detailed Passenger Manifest (Primary + Other Passengers)
    if (parsedPassengerList && parsedPassengerList.length > 0) {
      messageLines.push(`\n📋 *PASSENGER / GUEST MANIFEST:*`);
      parsedPassengerList.forEach((p: any, idx: number) => {
        const details = [
          p.age ? `Age: ${p.age}` : null,
          p.gender ? `${p.gender}` : null,
          p.berthPreference && p.berthPreference !== 'No Preference' ? `Berth: ${p.berthPreference}` : null,
          p.seatPreference && p.seatPreference !== 'No Preference' ? `Seat: ${p.seatPreference}` : null,
          p.mealPreference && p.mealPreference !== 'No Meal' ? `Meal: ${p.mealPreference}` : null,
          p.seniorCitizen ? `Sr. Citizen` : null,
        ].filter(Boolean).join(', ');
        const badge = idx === 0 ? ' [Primary]' : '';
        messageLines.push(`${idx + 1}. *${p.name}*${badge}${details ? ` — (${details})` : ''}`);
      });
    }

    if (newEnquiry.specialRequests) {
      messageLines.push(`\n*Special Notes / Instructions:* ${newEnquiry.specialRequests}`);
    }

    messageLines.push(`\n_Aazam Travel Agency • Pan-India Online Booking Desk (WhatsApp: +91 94215 56220)_`);

    const filteredLines = messageLines.filter((l): l is string => Boolean(l));
    const whatsappText = encodeURIComponent(filteredLines.join('\n'));
    const whatsappUrl = `https://wa.me/${agencyNumber}?text=${whatsappText}`;

    res.status(201).json({
      success: true,
      enquiryId: newId,
      enquiry: newEnquiry,
      whatsappUrl,
      message: 'Enquiry created successfully. Please send via WhatsApp to complete booking assistance.',
    });
  });

  // ==========================================
  // Auth Endpoints
  // ==========================================

  // Check current admin session
  app.get('/api/auth/me', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ authenticated: false });
    }
    const token = authHeader.split(' ')[1];
    const db = loadDatabase();
    const session = db.sessions[token];

    if (!session || Date.now() > session.expiresAt) {
      return res.status(401).json({ authenticated: false });
    }

    const admin = db.adminUsers.find((u) => u.id === session.userId);
    res.json({
      authenticated: true,
      user: {
        id: session.userId,
        email: session.email,
        name: admin?.name || 'Administrator',
        role: admin?.role || 'admin',
      },
    });
  });

  // Admin Login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = loadDatabase();
    const admin = db.adminUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = verifyPassword(password, admin.passwordHash, admin.salt);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate secure session token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    db.sessions[token] = {
      userId: admin.id,
      email: admin.email,
      expiresAt,
    };
    saveDatabase(db);

    res.json({
      success: true,
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  });

  // Admin Logout
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const db = loadDatabase();
      delete db.sessions[token];
      saveDatabase(db);
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });

  // Change Admin Password / Profile
  app.post('/api/auth/change-password', requireAdmin, (req: Request, res: Response) => {
    const { currentPassword, newPassword, newName, newEmail } = req.body;
    const session = (req as any).adminUser;
    const db = loadDatabase();
    const admin = db.adminUsers.find((u) => u.id === session.userId);

    if (!admin) {
      return res.status(404).json({ error: 'Admin account not found' });
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to set a new password' });
      }
      if (!verifyPassword(currentPassword, admin.passwordHash, admin.salt)) {
        return res.status(401).json({ error: 'Current password does not match' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' });
      }

      const newSalt = crypto.randomBytes(16).toString('hex');
      admin.passwordHash = hashPassword(newPassword, newSalt);
      admin.salt = newSalt;
    }

    if (newName && newName.trim()) {
      admin.name = newName.trim();
    }

    if (newEmail && newEmail.trim()) {
      admin.email = newEmail.trim().toLowerCase();
    }

    saveDatabase(db);
    res.json({ success: true, message: 'Admin profile updated successfully', user: { name: admin.name, email: admin.email } });
  });

  // ==========================================
  // Admin Protected Enquiries Endpoints
  // ==========================================

  // Stats summary for admin dashboard
  app.get('/api/admin/enquiries/stats', requireAdmin, (_req: Request, res: Response) => {
    const db = loadDatabase();
    const enquiries = db.enquiries;

    const stats = {
      total: enquiries.length,
      new: enquiries.filter((e) => e.status === 'New').length,
      contacted: enquiries.filter((e) => e.status === 'Contacted').length,
      pending: enquiries.filter((e) => e.status === 'Pending').length,
      confirmed: enquiries.filter((e) => e.status === 'Confirmed').length,
      cancelled: enquiries.filter((e) => e.status === 'Cancelled').length,
      byService: {
        train: enquiries.filter((e) => e.serviceType === 'train').length,
        flight: enquiries.filter((e) => e.serviceType === 'flight').length,
        bus: enquiries.filter((e) => e.serviceType === 'bus').length,
        hotel: enquiries.filter((e) => e.serviceType === 'hotel').length,
        tour: enquiries.filter((e) => e.serviceType === 'tour').length,
        religious: enquiries.filter((e) => e.serviceType === 'religious').length,
      },
    };

    res.json(stats);
  });

  // List enquiries with filtering and search
  app.get('/api/admin/enquiries', requireAdmin, (req: Request, res: Response) => {
    const { service, status, search, fromDate, toDate } = req.query;
    const db = loadDatabase();
    let list = [...db.enquiries];

    if (service && service !== 'all') {
      list = list.filter((e) => e.serviceType === service);
    }

    if (status && status !== 'all') {
      list = list.filter((e) => e.status === status);
    }

    if (fromDate) {
      list = list.filter((e) => e.travelDate >= (fromDate as string));
    }

    if (toDate) {
      list = list.filter((e) => e.travelDate <= (toDate as string));
    }

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.id.toLowerCase().includes(q) ||
          e.customerName.toLowerCase().includes(q) ||
          e.customerPhone.toLowerCase().includes(q) ||
          e.origin.toLowerCase().includes(q) ||
          e.destination.toLowerCase().includes(q) ||
          (e.specialRequests && e.specialRequests.toLowerCase().includes(q))
      );
    }

    res.json(list);
  });

  // Get single enquiry
  app.get('/api/admin/enquiries/:id', requireAdmin, (req: Request, res: Response) => {
    const db = loadDatabase();
    const item = db.enquiries.find((e) => e.id === req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }
    res.json(item);
  });

  // Update enquiry status
  app.patch('/api/admin/enquiries/:id/status', requireAdmin, (req: Request, res: Response) => {
    const { status } = req.body;
    const validStatuses = ['New', 'Contacted', 'Pending', 'Confirmed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const db = loadDatabase();
    const item = db.enquiries.find((e) => e.id === req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    item.status = status;
    item.updatedAt = new Date().toISOString();
    saveDatabase(db);

    res.json({ success: true, enquiry: item });
  });

  // Add internal note to enquiry
  app.post('/api/admin/enquiries/:id/notes', requireAdmin, (req: Request, res: Response) => {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Note text cannot be empty' });
    }

    const session = (req as any).adminUser;
    const db = loadDatabase();
    const item = db.enquiries.find((e) => e.id === req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    const newNote: EnquiryNote = {
      id: `n-${Date.now()}`,
      text: text.trim(),
      author: session.email || 'Admin',
      createdAt: new Date().toISOString(),
    };

    if (!item.notes) item.notes = [];
    item.notes.push(newNote);
    item.updatedAt = new Date().toISOString();
    saveDatabase(db);

    res.json({ success: true, note: newNote, enquiry: item });
  });

  // Delete enquiry
  app.delete('/api/admin/enquiries/:id', requireAdmin, (req: Request, res: Response) => {
    const db = loadDatabase();
    const index = db.enquiries.findIndex((e) => e.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    db.enquiries.splice(index, 1);
    saveDatabase(db);
    res.json({ success: true, message: 'Enquiry deleted' });
  });

  // Export enquiries to CSV
  app.get('/api/admin/enquiries-export-csv', requireAdmin, (_req: Request, res: Response) => {
    const db = loadDatabase();
    const rows = [
      [
        'Enquiry ID',
        'Date Received',
        'Service',
        'Customer Name',
        'Customer Phone',
        'Customer Email',
        'Origin',
        'Destination',
        'Travel Date',
        'Return Date',
        'Passengers',
        'Class',
        'Status',
        'Special Requests',
        'Notes Count',
      ].join(','),
    ];

    for (const e of db.enquiries) {
      const escape = (val: any) => `"${String(val || '').replace(/"/g, '""')}"`;
      rows.push(
        [
          escape(e.id),
          escape(e.createdAt),
          escape(e.serviceType),
          escape(e.customerName),
          escape(e.customerPhone),
          escape(e.customerEmail || ''),
          escape(e.origin),
          escape(e.destination),
          escape(e.travelDate),
          escape(e.returnDate || ''),
          escape(e.passengers),
          escape(e.preferredClass || ''),
          escape(e.status),
          escape(e.specialRequests || ''),
          escape(e.notes?.length || 0),
        ].join(',')
      );
    }

    const csvContent = rows.join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="aazam_travel_enquiries_${Date.now()}.csv"`);
    res.send(csvContent);
  });

  // Aggregated Customers directory
  app.get('/api/admin/customers', requireAdmin, (_req: Request, res: Response) => {
    const db = loadDatabase();
    const customerMap: {
      [phone: string]: {
        name: string;
        phone: string;
        email?: string;
        totalEnquiries: number;
        confirmedBookings: number;
        servicesUsed: string[];
        lastEnquiryDate: string;
        enquiries: { id: string; service: string; date: string; status: string; destination: string }[];
      };
    } = {};

    for (const e of db.enquiries) {
      const cleanPhone = e.customerPhone.trim();
      if (!customerMap[cleanPhone]) {
        customerMap[cleanPhone] = {
          name: e.customerName,
          phone: cleanPhone,
          email: e.customerEmail,
          totalEnquiries: 0,
          confirmedBookings: 0,
          servicesUsed: [],
          lastEnquiryDate: e.createdAt,
          enquiries: [],
        };
      }

      const c = customerMap[cleanPhone];
      c.totalEnquiries++;
      if (e.status === 'Confirmed') {
        c.confirmedBookings++;
      }
      if (!c.servicesUsed.includes(e.serviceType)) {
        c.servicesUsed.push(e.serviceType);
      }
      if (e.createdAt > c.lastEnquiryDate) {
        c.lastEnquiryDate = e.createdAt;
      }
      c.enquiries.push({
        id: e.id,
        service: e.serviceType,
        date: e.travelDate,
        status: e.status,
        destination: e.destination,
      });
    }

    const customers = Object.values(customerMap).sort((a, b) => b.lastEnquiryDate.localeCompare(a.lastEnquiryDate));
    res.json(customers);
  });

  // ==========================================
  // Admin Content Management (Settings, Services, Packages)
  // ==========================================

  // Update Settings
  app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
    const db = loadDatabase();
    const newSettings = req.body;
    db.settings = {
      ...db.settings,
      ...newSettings,
    };
    saveDatabase(db);
    res.json({ success: true, settings: db.settings });
  });

  // Update Service Details
  app.put('/api/admin/services/:id', requireAdmin, (req: Request, res: Response) => {
    const db = loadDatabase();
    const idx = db.services.findIndex((s) => s.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Service not found' });
    }
    db.services[idx] = {
      ...db.services[idx],
      ...req.body,
      id: req.params.id,
    };
    saveDatabase(db);
    res.json({ success: true, service: db.services[idx] });
  });

  // Create Service
  app.post('/api/admin/services', requireAdmin, (req: Request, res: Response) => {
    const { key, title, shortDesc, fullDesc, features, icon } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Service title is required' });
    }
    const db = loadDatabase();
    const newService: ServiceItem = {
      id: `srv-${Date.now()}`,
      key: key || 'tour',
      title: title.trim(),
      shortDesc: shortDesc?.trim() || '',
      fullDesc: fullDesc?.trim() || '',
      features: Array.isArray(features) ? features : [],
      icon: icon || 'Compass',
    };
    db.services.push(newService);
    saveDatabase(db);
    res.status(201).json({ success: true, service: newService });
  });

  // Delete Service
  app.delete('/api/admin/services/:id', requireAdmin, (req: Request, res: Response) => {
    const db = loadDatabase();
    const idx = db.services.findIndex((s) => s.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Service not found' });
    }
    db.services.splice(idx, 1);
    saveDatabase(db);
    res.json({ success: true, message: 'Service deleted' });
  });

  // Create Tour Package
  app.post('/api/admin/packages', requireAdmin, (req: Request, res: Response) => {
    const { title, category, duration, destination, highlights, inclusions, startingPrice, image, featured, description } = req.body;
    if (!title || !duration || !destination) {
      return res.status(400).json({ error: 'Title, duration and destination are required' });
    }

    const db = loadDatabase();
    const newPkg: TourPackage = {
      id: `pkg-${Date.now()}`,
      title: title.trim(),
      category: category || 'Domestic',
      duration: duration.trim(),
      destination: destination.trim(),
      highlights: Array.isArray(highlights) ? highlights : [highlights].filter(Boolean),
      inclusions: Array.isArray(inclusions) ? inclusions : [inclusions].filter(Boolean),
      startingPrice: startingPrice || 'On Request',
      image: image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      featured: Boolean(featured),
      description: description || '',
    };

    db.tourPackages.unshift(newPkg);
    saveDatabase(db);
    res.status(201).json({ success: true, package: newPkg });
  });

  // Update Tour Package
  app.put('/api/admin/packages/:id', requireAdmin, (req: Request, res: Response) => {
    const db = loadDatabase();
    const idx = db.tourPackages.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Package not found' });
    }

    db.tourPackages[idx] = {
      ...db.tourPackages[idx],
      ...req.body,
      id: req.params.id,
    };
    saveDatabase(db);
    res.json({ success: true, package: db.tourPackages[idx] });
  });

  // Delete Tour Package
  app.delete('/api/admin/packages/:id', requireAdmin, (req: Request, res: Response) => {
    const db = loadDatabase();
    const idx = db.tourPackages.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Package not found' });
    }

    db.tourPackages.splice(idx, 1);
    saveDatabase(db);
    res.json({ success: true, message: 'Package deleted' });
  });

  // Vite development vs production static serve
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Aazam Travel Agency server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
