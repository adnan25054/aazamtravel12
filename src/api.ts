import {
  AdminStats,
  AdminUser,
  CustomerRecord,
  Enquiry,
  EnquiryNote,
  EnquiryStatus,
  ServiceItem,
  TourPackage,
  WebsiteSettings,
  TrainScheduleResponse,
  RailRadarLiveTrainResponse,
  RailRadarLiveStationResponse,
  RailRadarCoachesResponse,
} from './types';

const TOKEN_KEY = 'aazam_admin_token';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function getHeaders(customHeaders: Record<string, string> = {}) {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// Public API
export async function fetchSettings(): Promise<WebsiteSettings> {
  const res = await fetch('/api/settings');
  if (!res.ok) throw new Error('Failed to load website settings');
  return res.json();
}

export async function fetchServices(): Promise<ServiceItem[]> {
  const res = await fetch('/api/services');
  if (!res.ok) throw new Error('Failed to load services');
  return res.json();
}

export async function fetchPackages(): Promise<TourPackage[]> {
  const res = await fetch('/api/packages');
  if (!res.ok) throw new Error('Failed to load tour packages');
  return res.json();
}

export async function submitEnquiry(payload: Partial<Enquiry>): Promise<{
  success: boolean;
  enquiryId: string;
  enquiry: Enquiry;
  whatsappUrl: string;
  message: string;
}> {
  const res = await fetch('/api/enquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to submit enquiry');
  }
  return data;
}

// Auth API
export async function loginAdmin(
  email: string,
  password: string
): Promise<{ success: boolean; token: string; user: AdminUser }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Invalid credentials');
  }
  setAuthToken(data.token);
  return data;
}

export async function checkAdminSession(): Promise<{ authenticated: boolean; user?: AdminUser }> {
  const token = getAuthToken();
  if (!token) return { authenticated: false };
  try {
    const res = await fetch('/api/auth/me', {
      headers: getHeaders(),
    });
    if (!res.ok) {
      clearAuthToken();
      return { authenticated: false };
    }
    const data = await res.json();
    return data;
  } catch {
    return { authenticated: false };
  }
}

export async function logoutAdmin(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: getHeaders(),
    });
  } finally {
    clearAuthToken();
  }
}

export async function updateAdminProfile(payload: {
  currentPassword?: string;
  newPassword?: string;
  newName?: string;
  newEmail?: string;
}): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/auth/change-password', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update admin profile');
  return data;
}

// Admin API
export async function fetchAdminStats(): Promise<AdminStats> {
  const res = await fetch('/api/admin/enquiries/stats', {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to load stats');
  return res.json();
}

export async function fetchAdminEnquiries(filters: {
  service?: string;
  status?: string;
  search?: string;
  fromDate?: string;
  toDate?: string;
} = {}): Promise<Enquiry[]> {
  const params = new URLSearchParams();
  if (filters.service) params.set('service', filters.service);
  if (filters.status) params.set('status', filters.status);
  if (filters.search) params.set('search', filters.search);
  if (filters.fromDate) params.set('fromDate', filters.fromDate);
  if (filters.toDate) params.set('toDate', filters.toDate);

  const res = await fetch(`/api/admin/enquiries?${params.toString()}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to load enquiries');
  return res.json();
}

export async function updateEnquiryStatus(
  id: string,
  status: EnquiryStatus
): Promise<{ success: boolean; enquiry: Enquiry }> {
  const res = await fetch(`/api/admin/enquiries/${id}/status`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update status');
  return data;
}

export async function addEnquiryNote(
  id: string,
  text: string
): Promise<{ success: boolean; note: EnquiryNote; enquiry: Enquiry }> {
  const res = await fetch(`/api/admin/enquiries/${id}/notes`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ text }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to add note');
  return data;
}

export async function deleteEnquiry(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/admin/enquiries/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete enquiry');
  return data;
}

export async function fetchCustomers(): Promise<CustomerRecord[]> {
  const res = await fetch('/api/admin/customers', {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to load customers');
  return res.json();
}

export async function saveAdminSettings(settings: WebsiteSettings): Promise<{ success: boolean; settings: WebsiteSettings }> {
  const res = await fetch('/api/admin/settings', {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(settings),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to save settings');
  return data;
}

export async function updateAdminService(service: ServiceItem): Promise<{ success: boolean; service: ServiceItem }> {
  const res = await fetch(`/api/admin/services/${service.id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(service),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update service');
  return data;
}

export async function createAdminService(service: Omit<ServiceItem, 'id'>): Promise<{ success: boolean; service: ServiceItem }> {
  const res = await fetch('/api/admin/services', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(service),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create service');
  return data;
}

export async function deleteAdminService(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/admin/services/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete service');
  return data;
}

export async function createAdminPackage(pkg: Omit<TourPackage, 'id'>): Promise<{ success: boolean; package: TourPackage }> {
  const res = await fetch('/api/admin/packages', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(pkg),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create package');
  return data;
}

export async function updateAdminPackage(pkg: TourPackage): Promise<{ success: boolean; package: TourPackage }> {
  const res = await fetch(`/api/admin/packages/${pkg.id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(pkg),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update package');
  return data;
}

export async function deleteAdminPackage(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/admin/packages/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete package');
  return data;
}

export function getExportCsvUrl(): string {
  const token = getAuthToken();
  return `/api/admin/enquiries-export-csv?token=${token}`;
}

export async function downloadCsvFile(): Promise<void> {
  const token = getAuthToken();
  const res = await fetch('/api/admin/enquiries-export-csv', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Failed to generate CSV export');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aazam_travel_enquiries_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

// ==========================================
// Indian Rail & RailRadar API Endpoints (via Server Proxy)
// ==========================================

export interface RailwayApiError extends Error {
  errorCode?: string;
  limitationNote?: string;
  officialEnquiryUrl?: string;
  statusCode?: number;
}

function buildRailwayError(data: any, fallbackMessage: string, statusCode?: number): RailwayApiError {
  const err = new Error(data?.error || fallbackMessage) as RailwayApiError;
  err.errorCode = data?.errorCode;
  err.limitationNote = data?.limitationNote;
  err.officialEnquiryUrl = data?.officialEnquiryUrl;
  err.statusCode = statusCode;
  return err;
}

export async function fetchTrainConfigStatus(): Promise<{
  success: boolean;
  providers: {
    railKitConfigured?: boolean;
    indianRailApiConfigured: boolean;
    railRadarApiConfigured?: boolean;
    liveTrainStatusAvailable: boolean;
    pnrCheckAvailable: boolean;
    liveStationAvailable: boolean;
    timetableAvailable: boolean;
  };
}> {
  const res = await fetch('/api/train/config-status');
  if (!res.ok) {
    throw new Error('Failed to check railway API configuration status');
  }
  return res.json();
}

export async function fetchLiveTrainStatus(
  trainNumber: string,
  date?: string
): Promise<any> {
  const params = new URLSearchParams({ trainNumber: trainNumber.trim() });
  if (date) params.set('date', date.trim());
  const res = await fetch(`/api/train/live-status?${params.toString()}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw buildRailwayError(data, 'Failed to fetch live train status', res.status);
  }
  return data;
}

export async function fetchPNRStatus(pnrNumber: string): Promise<any> {
  const params = new URLSearchParams({ pnrNumber: pnrNumber.trim() });
  const res = await fetch(`/api/train/pnr-status?${params.toString()}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw buildRailwayError(data, 'Failed to fetch PNR status', res.status);
  }
  return data;
}

export async function searchStationAutocomplete(query: string): Promise<any> {
  if (!query || query.trim().length < 2) return [];
  const params = new URLSearchParams({ query: query.trim() });
  const res = await fetch(`/api/train/station-autocomplete?${params.toString()}`);
  if (!res.ok) return [];
  const data = await res.json().catch(() => ({}));
  return data.Station || [];
}

export async function fetchTrainSchedule(
  trainNumber: string,
  haltsOnly = true
): Promise<TrainScheduleResponse> {
  const params = new URLSearchParams({
    trainNumber: trainNumber.trim(),
    haltsOnly: haltsOnly ? 'true' : 'false',
  });
  const res = await fetch(`/api/train/schedule?${params.toString()}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw buildRailwayError(data, 'Failed to fetch train schedule & timetable', res.status);
  }
  return data;
}

// RailKit API: Live Train Status
export async function fetchRailRadarLiveTrain(
  trainNumber: string
): Promise<RailRadarLiveTrainResponse> {
  const cleanNumber = trainNumber.trim().replace(/[^0-9]/g, '');
  const res = await fetch(`/api/railradar/train/live/${cleanNumber}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw buildRailwayError(data, 'Failed to fetch live train running status from RailKit', res.status);
  }
  return data;
}

// RailKit API: Live Station Board
export async function fetchRailRadarLiveStation(
  stationCode: string,
  hours = 4
): Promise<RailRadarLiveStationResponse> {
  const cleanCode = encodeURIComponent(stationCode.trim());
  const res = await fetch(`/api/railradar/station/live/${cleanCode}?hours=${hours}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw buildRailwayError(data, 'Failed to fetch live station board from RailKit', res.status);
  }
  return data;
}

// RailKit API: Coach Layout & Composition
export async function fetchRailRadarCoaches(
  trainNumber: string,
  stationCode?: string
): Promise<RailRadarCoachesResponse> {
  const cleanNumber = trainNumber.trim().replace(/[^0-9]/g, '');
  const url = stationCode && stationCode.trim()
    ? `/api/railradar/train/coaches/${cleanNumber}/${stationCode.trim().toUpperCase()}`
    : `/api/railradar/train/coaches/${cleanNumber}`;
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw buildRailwayError(data, 'Failed to fetch coach composition from RailKit', res.status);
  }
  return data;
}



