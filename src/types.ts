export type ServiceType = 'train' | 'flight' | 'bus' | 'hotel' | 'tour' | 'religious';

export type EnquiryStatus = 'New' | 'Contacted' | 'Pending' | 'Confirmed' | 'Cancelled';

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
  serviceType: ServiceType;
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
  status: EnquiryStatus;
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
  key: ServiceType;
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

export interface AdminStats {
  total: number;
  new: number;
  contacted: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  byService: Record<ServiceType, number>;
}

export interface CustomerRecord {
  name: string;
  phone: string;
  email?: string;
  totalEnquiries: number;
  confirmedBookings: number;
  servicesUsed: string[];
  lastEnquiryDate: string;
  enquiries: {
    id: string;
    service: string;
    date: string;
    status: string;
    destination: string;
  }[];
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

// ==========================================
// Indian Rail API Integration Types
// ==========================================

export interface LiveTrainStation {
  SerialNo: string;
  StationName: string;
  StationCode: string;
  Distance: string;
  IsDeparted: string;
  Day: string;
  ScheduleArrival: string;
  ActualArrival: string;
  DelayInArrival: string;
  ScheduleDeparture: string;
  ActualDeparture: string;
  DelayInDeparture: string;
}

export interface LiveTrainRouteStation {
  SerialNo: string;
  StationName: string;
  StationCode: string;
  Distance: string;
  IsDeparted: string;
  Day: string;
  ScheduleArrival: string;
  ActualArrival: string;
  DelayInArrival: string;
  ScheduleDeparture: string;
  ActualDeparture: string;
  DelayInDeparture: string;
}

export interface LiveTrainStatusResponse {
  ResponseCode: string;
  StartDate: string;
  TrainNumber: string;
  TrainName?: string;
  CurrentPosition?: string | null;
  CurrentStation: LiveTrainStation;
  TrainRoute: LiveTrainRouteStation[];
  LastUpdated?: string;
  Source?: string;
  Message?: string;
  error?: string;
  errorCode?: string;
  officialEnquiryUrl?: string;
}

export interface PNRPassenger {
  Passenger: string;
  BookingStatus: string;
  CurrentStatus: string;
}

export interface PNRStatusResponse {
  PnrNumber: string;
  Status: string;
  ResponseCode: string;
  TrainNumber: string;
  TrainName: string;
  JourneyClass: string;
  ChatPrepared: string;
  From: string;
  To: string;
  JourneyDate: string;
  Passangers: PNRPassenger[];
  error?: string;
  errorCode?: string;
  limitationNote?: string;
  officialEnquiryUrl?: string;
}

export interface StationAutocompleteItem {
  NameEn: string;
  NameHn?: string;
  StationCode: string;
  Longitude?: string;
  Latitude?: string;
}

export interface StationAutocompleteResponse {
  ResponseCode: string;
  Status: string;
  Station: StationAutocompleteItem[];
  Message?: string | null;
}

// RailRadar Train Schedule & Timetable API types (https://api.railradar.in/v1/trains/{number})
export interface TrainScheduleStation {
  code: string;
  name: string;
}

export interface TrainScheduleInfo {
  number: string;
  name: string;
  type: string;
  category?: string;
  source: TrainScheduleStation;
  destination: TrainScheduleStation;
  runDays: string[];
  distance: number;
  duration: number; // in minutes
  avgSpeed?: number;
  maxSpeed?: number;
  totalHalts: number;
  returnTrain?: string;
  coachPosition?: string;
}

export interface TrainScheduleRouteItem {
  sequence: number;
  station: TrainScheduleStation;
  arrival: string | null;
  departure: string | null;
  arrivalDay: number;
  departureDay: number;
  distance: number;
  isHalt: boolean;
  platform?: string | null;
  speedToNextStationKmph?: number;
}

export interface TrainScheduleResponse {
  success: boolean;
  isScheduledTimetable?: boolean;
  data: {
    train: TrainScheduleInfo;
    route: TrainScheduleRouteItem[];
  };
  meta?: {
    traceId?: string;
    timestamp?: string;
    executionTime?: number;
    source?: string;
    notice?: string;
  };
  error?: string;
  errorCode?: string;
  officialEnquiryUrl?: string;
}

// RailRadar Live Train Running Status (https://api.railradar.in/v1/trains/{number}/live)
export interface RailRadarLocation {
  stationCode: string;
  sequence: number;
  status: 'departed' | 'arrived' | 'upcoming' | string;
  isHalt: boolean;
  isDiverted?: boolean;
  isActualPosition?: boolean;
  segmentProgress?: number;
  speedKmh?: number;
  bearingDegrees?: number;
}

export interface RailRadarStationHalt {
  stationCode: string;
  stationName: string;
  sequence: number;
  distance: number;
}

export interface RailRadarRouteStation {
  sequence: number;
  stationCode: string;
  stationName: string;
  isHalt: boolean;
  lat?: number;
  lng?: number;
  scheduledArrival?: string | null;
  scheduledDeparture?: string | null;
  actualArrival?: string | null;
  actualDeparture?: string | null;
  delayArrival?: number | null;
  delayDeparture?: number | null;
  status: 'departed' | 'upcoming' | 'arrived' | string;
  distance: number;
  speedToNextStationKmph?: number;
  platform?: string | null;
}

export interface RailRadarLiveTrainData {
  trainNumber: string;
  trainName: string;
  startDate: string;
  lastUpdatedAt: string;
  status: string;
  delayMinutes: number;
  train: {
    number: string;
    name: string;
    type: string;
    category?: string;
    source: { code: string; name: string };
    destination: { code: string; name: string };
    runDays: string[];
    distance: number;
    duration: number;
    avgSpeed?: number;
    maxSpeed?: number;
    totalHalts: number;
    returnTrain?: string;
  };
  currentLocation?: RailRadarLocation;
  previousHalt?: RailRadarStationHalt;
  nextHalt?: RailRadarStationHalt;
  exceptions?: {
    type: string;
    message: string;
    diverted?: any;
    partiallyCancelled?: any;
    rescheduled?: any;
  }[];
  route: RailRadarRouteStation[];
  isLive: boolean;
}

export interface RailRadarLiveTrainResponse {
  success: boolean;
  data: RailRadarLiveTrainData;
  meta?: any;
  error?: string;
}

// RailRadar Live Station Board (https://api.railradar.in/v1/stations/{code}/live)
export interface RailRadarLiveStationTrain {
  train: {
    number: string;
    name: string;
    type: string;
    source: string;
    destination: string;
    runDays: string[];
  };
  stop: {
    sequence: number;
    arrival: string | null;
    departure: string | null;
    day: number;
    distance: number;
  };
  live: {
    type: string;
    expectedDepartureTime?: string;
    expectedArrivalTime?: string;
    platform?: string | null;
    delayMinutes: number;
  };
}

export interface RailRadarLiveStationResponse {
  success: boolean;
  data: {
    station: {
      code: string;
      name: string;
    };
    window: {
      from: string;
      to: string;
      hoursBack: number;
      hoursAhead: number;
    };
    count: number;
    trains: RailRadarLiveStationTrain[];
  };
  meta?: any;
  error?: string;
}

// RailRadar Coaches & Seat Composition (https://api.railradar.in/v1/trains/{number}/coaches)
export interface RailRadarCoachItem {
  position: number;
  code: string;
  category: string;
  classType: string;
  name: string;
  totalBerths: number;
  hasSeats: boolean;
  color: string;
}

export interface RailRadarCabinBerth {
  number: number;
  type: string;
  name: string;
}

export interface RailRadarCabin {
  cabinNumber: number;
  main: RailRadarCabinBerth[];
  side?: RailRadarCabinBerth[];
}

export interface RailRadarBlueprint {
  classCode: string;
  className: string;
  totalBerths: number;
  hasSeats: boolean;
  cabins: RailRadarCabin[];
}

export interface RailRadarCoachesResponse {
  success: boolean;
  data: {
    trainNumber: string;
    trainName?: string;
    stationCode?: string;
    stationName?: string;
    direction?: string;
    platform?: string;
    baseFormation?: string;
    formation?: string;
    totalCoaches?: number;
    coaches: RailRadarCoachItem[];
    blueprints?: Record<string, RailRadarBlueprint>;
    summary?: Record<string, number>;
    reversals?: string[];
  };
  meta?: any;
  error?: string;
}


