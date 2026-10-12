import React, { useState, useEffect } from 'react';
import { 
  AdminStats, 
  AdminUser, 
  CustomerRecord, 
  Enquiry, 
  EnquiryStatus, 
  ServiceItem, 
  ServiceType, 
  TourPackage, 
  WebsiteSettings 
} from '../../types';
import { 
  fetchAdminStats, 
  fetchAdminEnquiries, 
  updateEnquiryStatus, 
  addEnquiryNote, 
  deleteEnquiry, 
  fetchCustomers, 
  saveAdminSettings, 
  updateAdminService, 
  createAdminService,
  deleteAdminService,
  createAdminPackage, 
  updateAdminPackage, 
  deleteAdminPackage, 
  downloadCsvFile,
  updateAdminProfile
} from '../../api';
import { 
  LayoutDashboard, 
  Inbox, 
  Train, 
  Users, 
  Compass, 
  Sliders, 
  Settings, 
  UserCheck, 
  LogOut, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Trash2, 
  Edit3, 
  MessageSquare, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X, 
  Save, 
  Send, 
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
  FileSpreadsheet,
  Upload,
  Image as ImageIcon,
  Camera,
  Sparkles,
  Check
} from 'lucide-react';

interface AdminDashboardProps {
  adminUser: AdminUser;
  initialSettings: WebsiteSettings;
  initialServices: ServiceItem[];
  initialPackages: TourPackage[];
  onLogout: () => void;
  onClose: () => void;
  onRefreshPublicData: () => void;
}

type TabType = 
  | 'dashboard' 
  | 'enquiries' 
  | 'train-enquiries' 
  | 'customers' 
  | 'packages' 
  | 'services' 
  | 'settings' 
  | 'profile';

const SERVICE_INFO: Record<string, { label: string; icon: string; color: string }> = {
  train: { label: 'Train Booking', icon: '🚆', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  flight: { label: 'Flight Booking', icon: '✈️', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  bus: { label: 'Bus Booking', icon: '🚌', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  hotel: { label: 'Hotel Booking', icon: '🏨', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  tour: { label: 'Tour Package', icon: '🌴', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  religious: { label: 'Religious Tour', icon: '🕌', color: 'bg-amber-50 text-amber-700 border-amber-200' },
};

function renderServiceBadge(serviceType: string) {
  const info = SERVICE_INFO[serviceType] || { label: serviceType, icon: '📍', color: 'bg-slate-100 text-slate-700 border-slate-200' };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${info.color}`}>
      <span>{info.icon}</span>
      <span>{info.label}</span>
    </span>
  );
}

const PRESET_PACKAGE_IMAGES = [
  { label: 'Kashmir Valley & Snow', url: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80', tag: 'Holiday' },
  { label: 'Umrah & Madinah Pilgrimage', url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80', tag: 'Religious' },
  { label: 'Goa Coastal Resort & Beach', url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80', tag: 'Holiday' },
  { label: 'Maharashtra Jyotirlinga / Shirdi', url: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80', tag: 'Religious' },
  { label: 'Rajasthan Royal Fort & Palace', url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80', tag: 'Domestic' },
  { label: 'Kerala Backwaters & Houseboat', url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80', tag: 'Domestic' },
  { label: 'Himachal & Manali Snow Hills', url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80', tag: 'Holiday' },
  { label: 'Dubai International Skyline', url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', tag: 'Holiday' },
  { label: 'Agra Taj Mahal Heritage', url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80', tag: 'Domestic' },
  { label: 'Tirupati & Sacred Temple', url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', tag: 'Religious' },
  { label: 'Ooty & Western Ghats Tea Hills', url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80', tag: 'Holiday' },
  { label: 'Ajmer Sharif Ziyarat', url: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1200&q=80', tag: 'Religious' },
  { label: 'Varanasi Ganga Ghat & Aarti', url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80', tag: 'Religious' },
  { label: 'Golden Temple Amritsar', url: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=1200&q=80', tag: 'Religious' },
  { label: 'Andaman Radhanagar Beach', url: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80', tag: 'Holiday' },
  { label: 'Singapore Marina Bay', url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80', tag: 'Holiday' },
  { label: 'Leh Ladakh Pangong Lake', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', tag: 'Holiday' },
];

function processImageFile(file: File, callback: (dataUrl: string) => void) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxDim = 1200;
      let width = img.width;
      let height = img.height;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      callback(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.src = e.target?.result as string;
  };
  reader.readAsDataURL(file);
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminUser,
  initialSettings,
  initialServices,
  initialPackages,
  onLogout,
  onClose,
  onRefreshPublicData,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  
  // Data states
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [packages, setPackages] = useState<TourPackage[]>(initialPackages);
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [settings, setSettings] = useState<WebsiteSettings>(initialSettings);
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filters for enquiries
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [notesModalEnquiry, setNotesModalEnquiry] = useState<Enquiry | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  
  const [whatsAppModalData, setWhatsAppModalData] = useState<{
    customerPhone: string;
    customerName: string;
    message: string;
  } | null>(null);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Package Edit/Create Modal state
  const [editingPackage, setEditingPackage] = useState<Partial<TourPackage> | null>(null);
  const [isNewPackage, setIsNewPackage] = useState(false);
  const [packagePresetFilter, setPackagePresetFilter] = useState<string>('All');

  // Quick Package Photo Modal state
  const [quickImagePackage, setQuickImagePackage] = useState<TourPackage | null>(null);
  const [quickImageUrl, setQuickImageUrl] = useState<string>('');
  const [quickImageCategory, setQuickImageCategory] = useState<string>('All');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Service Edit Modal
  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);
  const [isNewService, setIsNewService] = useState(false);

  // Profile Change State
  const [profileName, setProfileName] = useState(adminUser.name);
  const [profileEmail, setProfileEmail] = useState(adminUser.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Load Admin Data
  const loadData = async () => {
    setLoading(true);
    try {
      const [sData, eData, cData] = await Promise.all([
        fetchAdminStats(),
        fetchAdminEnquiries({
          search: searchQuery,
          service: serviceFilter,
          status: statusFilter,
        }),
        fetchCustomers(),
      ]);
      setStats(sData);
      setEnquiries(eData);
      setCustomers(cData);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [serviceFilter, statusFilter]);

  const showToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // Status Updater
  const handleStatusChange = async (enquiryId: string, newStatus: EnquiryStatus) => {
    try {
      await updateEnquiryStatus(enquiryId, newStatus);
      setEnquiries((prev) =>
        prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus } : e))
      );
      // reload stats
      const newStats = await fetchAdminStats();
      setStats(newStats);
      showToast(`Status updated to ${newStatus}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update status');
    }
  };

  // Add Internal Note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notesModalEnquiry || !newNoteText.trim()) return;
    try {
      const res = await addEnquiryNote(notesModalEnquiry.id, newNoteText.trim());
      setNotesModalEnquiry(res.enquiry);
      setEnquiries((prev) =>
        prev.map((item) => (item.id === res.enquiry.id ? res.enquiry : item))
      );
      setNewNoteText('');
      showToast('Internal note saved');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to add note');
    }
  };

  // Delete Enquiry
  const handleDeleteEnquiry = async (id: string) => {
    try {
      await deleteEnquiry(id);
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      setDeleteConfirmId(null);
      const newStats = await fetchAdminStats();
      setStats(newStats);
      showToast('Enquiry deleted successfully');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete enquiry');
    }
  };

  // Open WhatsApp Composer for Customer
  const handleOpenWhatsAppCustomer = (enquiry: Enquiry) => {
    const cleanCustomer = enquiry.customerPhone.replace(/[^0-9]/g, '');
    let initialTemplate = `Hello ${enquiry.customerName}, this is Aazam Shaikh from Aazam Travel Agency.\n\nRegarding your ${enquiry.serviceType.toUpperCase()} booking enquiry (${enquiry.id}) for:\nRoute: ${enquiry.origin} to ${enquiry.destination}\nTravel Date: ${enquiry.travelDate}\nPassengers: ${enquiry.passengers} ${enquiry.preferredClass ? `(${enquiry.preferredClass})` : ''}\n\nWe have checked the current availability and schedule options. Please let us know if you would like us to proceed with the reservation!`;

    if (enquiry.status === 'Confirmed') {
      initialTemplate = `Hello ${enquiry.customerName}, this is Aazam Travel Agency.\n\nYour ${enquiry.serviceType.toUpperCase()} booking for ${enquiry.origin} to ${enquiry.destination} on ${enquiry.travelDate} has been confirmed. Please review your travel confirmation details attached.`;
    }

    setWhatsAppModalData({
      customerPhone: cleanCustomer,
      customerName: enquiry.customerName,
      message: initialTemplate,
    });
  };

  const handleSendCustomerWhatsApp = () => {
    if (!whatsAppModalData) return;
    const url = `https://wa.me/${whatsAppModalData.customerPhone}?text=${encodeURIComponent(
      whatsAppModalData.message
    )}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setWhatsAppModalData(null);
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await saveAdminSettings(settings);
      setSettings(res.settings);
      onRefreshPublicData();
      showToast('Website settings updated successfully! Public site reflects changes.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save settings');
    }
  };

  // Save Tour Package
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;
    try {
      if (isNewPackage) {
        const res = await createAdminPackage(editingPackage as any);
        setPackages((prev) => [res.package, ...prev]);
        showToast('New tour package published!');
      } else {
        const res = await updateAdminPackage(editingPackage as TourPackage);
        setPackages((prev) =>
          prev.map((p) => (p.id === res.package.id ? res.package : p))
        );
        showToast('Tour package updated!');
      }
      setEditingPackage(null);
      onRefreshPublicData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save package');
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm('Are you sure you want to remove this tour package?')) return;
    try {
      await deleteAdminPackage(id);
      setPackages((prev) => prev.filter((p) => p.id !== id));
      onRefreshPublicData();
      showToast('Package removed successfully');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete package');
    }
  };

  // Direct card photo upload
  const handleDirectCardUpload = (pkg: TourPackage, file: File) => {
    setIsUploadingPhoto(true);
    processImageFile(file, async (dataUrl) => {
      try {
        const updated = { ...pkg, image: dataUrl };
        const res = await updateAdminPackage(updated);
        setPackages((prev) =>
          prev.map((p) => (p.id === res.package.id ? res.package : p))
        );
        onRefreshPublicData();
        showToast(`Photo for "${pkg.title}" updated successfully!`);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to update package photo');
      } finally {
        setIsUploadingPhoto(false);
      }
    });
  };

  // Save photo from quick photo modal
  const handleSaveQuickPhoto = async () => {
    if (!quickImagePackage || !quickImageUrl) return;
    setIsUploadingPhoto(true);
    try {
      const updated = { ...quickImagePackage, image: quickImageUrl };
      const res = await updateAdminPackage(updated);
      setPackages((prev) =>
        prev.map((p) => (p.id === res.package.id ? res.package : p))
      );
      onRefreshPublicData();
      showToast(`Photo for "${quickImagePackage.title}" updated successfully!`);
      setQuickImagePackage(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update photo');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Save Service
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    try {
      if (isNewService) {
        const res = await createAdminService(editingService as any);
        setServices((prev) => [...prev, res.service]);
        showToast('New travel service created successfully!');
      } else {
        const res = await updateAdminService(editingService as ServiceItem);
        setServices((prev) =>
          prev.map((s) => (s.id === res.service.id ? res.service : s))
        );
        showToast('Travel service updated successfully!');
      }
      setEditingService(null);
      onRefreshPublicData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save service');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this travel service?')) return;
    try {
      await deleteAdminService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      onRefreshPublicData();
      showToast('Service removed successfully');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete service');
    }
  };

  // Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAdminProfile({
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
        newName: profileName,
        newEmail: profileEmail,
      });
      setCurrentPassword('');
      setNewPassword('');
      showToast('Admin profile & credentials updated successfully');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile');
    }
  };

  const trainOnlyEnquiries = enquiries.filter((e) => e.serviceType === 'train');

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-100 text-slate-800 overflow-hidden">
      
      {/* Top Admin Bar */}
      <header className="h-16 bg-[#0B2545] text-white flex items-center justify-between px-4 sm:px-6 shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <img
            src="/logo.svg"
            alt="Aazam Travel Agency Official Logo"
            className="h-11 w-auto object-contain rounded-xl drop-shadow-sm"
          />
          <div>
            <h1 className="font-bold text-base leading-tight text-white flex items-center gap-2">
              <span>Aazam Travel Agency</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.5 rounded font-mono uppercase">Admin Panel</span>
            </h1>
            <span className="text-[11px] text-slate-300">Pan-India Online Desk · Logged in as {adminUser.email}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Agency WhatsApp */}
          <a
            href={`https://wa.me/919421556220`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
            title="Open Agency WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>+91 94215 56220</span>
          </a>

          {/* Return to website */}
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors flex items-center gap-1"
          >
            <span>Exit Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-xs font-semibold transition-colors flex items-center gap-1"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-[#07192F] text-slate-300 flex flex-col justify-between shrink-0 overflow-y-auto hidden md:flex border-r border-slate-800">
          <nav className="p-4 space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'enquiries', label: 'All Bookings', icon: Inbox, badge: stats?.new },
              { id: 'train-enquiries', label: 'Train Bookings', icon: Train, badge: stats?.byService?.train },
              { id: 'customers', label: 'Customers Directory', icon: Users },
              { id: 'packages', label: 'Tour Packages', icon: Compass },
              { id: 'services', label: 'Travel Services', icon: Layers },
              { id: 'settings', label: 'Website Settings', icon: Settings },
              { id: 'profile', label: 'Admin Profile', icon: UserCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white text-orange-600' : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500">
            Aazam Travel Agency v2.4<br />
            100% Pan-India Online Desk
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          
          {/* Toast / Notifications */}
          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
              <button onClick={() => setSuccessMsg(null)}>
                <X className="w-4 h-4 text-emerald-600" />
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>{errorMsg}</span>
              </div>
              <button onClick={() => setErrorMsg(null)}>
                <X className="w-4 h-4 text-red-600" />
              </button>
            </div>
          )}

          {/* Mobile Tab Selector */}
          <div className="md:hidden mb-6 flex overflow-x-auto gap-1 pb-2">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'enquiries', label: 'All Bookings' },
              { id: 'train-enquiries', label: 'Train Bookings' },
              { id: 'customers', label: 'Customers' },
              { id: 'packages', label: 'Packages' },
              { id: 'services', label: 'Travel Services' },
              { id: 'settings', label: 'Settings' },
              { id: 'profile', label: 'Profile' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#0B2545] text-white'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ========================================================= */}
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {/* ========================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-black text-[#0B2545]">Business Overview</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Live summary of travel bookings, railway ticket requests, and confirmed reservations.
                </p>
              </div>

              {/* 5 Summary Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Total Bookings
                  </div>
                  <div className="text-3xl font-black text-[#0B2545]">
                    {stats?.total ?? 0}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">All customer bookings</span>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-orange-200 bg-orange-50/30 shadow-xs">
                  <div className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1">
                    New Requests
                  </div>
                  <div className="text-3xl font-black text-orange-600">
                    {stats?.new ?? 0}
                  </div>
                  <span className="text-[11px] text-orange-500/80 mt-1 block">Requires response</span>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-amber-200 bg-amber-50/30 shadow-xs">
                  <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
                    Pending Processing
                  </div>
                  <div className="text-3xl font-black text-amber-700">
                    {stats?.pending ?? 0}
                  </div>
                  <span className="text-[11px] text-amber-600/80 mt-1 block">Quotes/Docs awaited</span>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-emerald-200 bg-emerald-50/30 shadow-xs">
                  <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                    Confirmed Tickets
                  </div>
                  <div className="text-3xl font-black text-emerald-700">
                    {stats?.confirmed ?? 0}
                  </div>
                  <span className="text-[11px] text-emerald-600/80 mt-1 block">Provider confirmed</span>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Cancelled
                  </div>
                  <div className="text-3xl font-black text-slate-600">
                    {stats?.cancelled ?? 0}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">Not proceeded</span>
                </div>
              </div>

              {/* Requirement Compliance Note on 'Confirmed' Status */}
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Compliance Standard:</strong> A status of <em>Confirmed</em> indicates the reservation has actually been confirmed with the railway/airline/operator provider, not merely that a customer submitted a web form.
                </span>
              </div>

              {/* Real Data Distribution Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Breakdown by Travel Service */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                  <h3 className="text-base font-bold text-[#0B2545] mb-4 flex items-center justify-between">
                    <span>Enquiries by Travel Service</span>
                    <Train className="w-4 h-4 text-orange-500" />
                  </h3>
                  <div className="space-y-3">
                    {[
                      { key: 'train', label: 'Train Ticket Booking (IRCTC)', count: stats?.byService?.train ?? 0, color: 'bg-orange-500' },
                      { key: 'flight', label: 'Flight Ticket Booking', count: stats?.byService?.flight ?? 0, color: 'bg-blue-600' },
                      { key: 'bus', label: 'Bus Ticket Booking', count: stats?.byService?.bus ?? 0, color: 'bg-indigo-600' },
                      { key: 'hotel', label: 'Hotel Reservations', count: stats?.byService?.hotel ?? 0, color: 'bg-emerald-600' },
                      { key: 'tour', label: 'Tour Packages', count: stats?.byService?.tour ?? 0, color: 'bg-purple-600' },
                      { key: 'religious', label: 'Religious Tours (Umrah / Pilgrimage)', count: stats?.byService?.religious ?? 0, color: 'bg-amber-600' },
                    ].map((item) => {
                      const percentage = (stats?.total && stats.total > 0)
                        ? Math.round((item.count / stats.total) * 100)
                        : 0;
                      return (
                        <div key={item.key} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-700">{item.label}</span>
                            <span className="text-slate-900">{item.count} ({percentage}%)</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${item.color}`} style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Actions & Recent Summary */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#0B2545] mb-4">
                      Quick Management Actions
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      <button
                        onClick={() => setActiveTab('train-enquiries')}
                        className="p-4 rounded-xl border border-orange-200 bg-orange-50/60 hover:bg-orange-100/70 text-left transition-colors"
                      >
                        <Train className="w-5 h-5 text-orange-600 mb-2" />
                        <span className="font-bold text-xs text-[#0B2545] block">Manage Train Bookings</span>
                        <span className="text-[11px] text-slate-500">Dedicated IRCTC reservation workflow</span>
                      </button>

                      <button
                        onClick={downloadCsvFile}
                        className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/70 text-left transition-colors"
                      >
                        <FileSpreadsheet className="w-5 h-5 text-emerald-600 mb-2" />
                        <span className="font-bold text-xs text-[#0B2545] block">Export CSV File</span>
                        <span className="text-[11px] text-slate-500">Download all booking records</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('packages')}
                        className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/70 text-left transition-colors"
                      >
                        <Compass className="w-5 h-5 text-blue-600 mb-2" />
                        <span className="font-bold text-xs text-[#0B2545] block">Manage Tour Packages</span>
                        <span className="text-[11px] text-slate-500">Edit packages on public site</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('settings')}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors"
                      >
                        <Settings className="w-5 h-5 text-slate-700 mb-2" />
                        <span className="font-bold text-xs text-[#0B2545] block">Website Settings</span>
                        <span className="text-[11px] text-slate-500">Banners, phone & address</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Office desk: +91 94215 56220</span>
                    <button
                      onClick={loadData}
                      className="inline-flex items-center gap-1 font-semibold text-orange-600 hover:text-orange-700"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh Records</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Bookings Preview */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-bold text-base text-[#0B2545]">Recent Bookings</h3>
                  <button
                    onClick={() => setActiveTab('enquiries')}
                    className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
                  >
                    <span>View All ({enquiries.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="px-4 py-3">ID & Date</th>
                        <th className="px-4 py-3">Service</th>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Route</th>
                        <th className="px-4 py-3">Travel Date</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Quick Contact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {enquiries.slice(0, 5).map((e) => (
                        <tr key={e.id} className="hover:bg-slate-50/70">
                          <td className="px-4 py-3 font-mono font-bold text-[#0B2545]">
                            {e.id}
                            <span className="block text-[10px] text-slate-400 font-sans">
                              {new Date(e.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {renderServiceBadge(e.serviceType)}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-bold block text-slate-800">{e.customerName}</span>
                            <span className="text-slate-500">{e.customerPhone}</span>
                          </td>
                          <td className="px-4 py-3">
                            {e.origin} → {e.destination}
                          </td>
                          <td className="px-4 py-3 font-medium">
                            {e.travelDate} ({e.passengers} pax)
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                              e.status === 'New' ? 'bg-orange-100 text-orange-700' :
                              e.status === 'Contacted' ? 'bg-blue-100 text-blue-700' :
                              e.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                              e.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {e.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleOpenWhatsAppCustomer(e)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-semibold text-[11px] hover:bg-emerald-700 inline-flex items-center gap-1"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: ALL CUSTOMER BOOKINGS */}
          {/* ========================================================= */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-[#0B2545]">All Customer Bookings</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage and respond to train, flight, bus, hotel, and tour reservations with internal notes.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={downloadCsvFile}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold shadow-xs"
                  >
                    <Download className="w-4 h-4 text-emerald-600" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={loadData}
                    className="p-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs"
                    title="Refresh"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search name, phone, station, ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadData()}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:border-orange-500"
                  />
                </div>

                {/* Service Filter */}
                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:border-orange-500 bg-white"
                >
                  <option value="all">All Services (Train, Flight, Bus, etc.)</option>
                  <option value="train">Train Ticket Booking</option>
                  <option value="flight">Flight Ticket Booking</option>
                  <option value="bus">Bus Ticket Booking</option>
                  <option value="hotel">Hotel Reservations</option>
                  <option value="tour">Tour Packages</option>
                  <option value="religious">Religious Tours</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:border-orange-500 bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Enquiries Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="px-4 py-3.5">ID / Date</th>
                        <th className="px-4 py-3.5">Service</th>
                        <th className="px-4 py-3.5">Customer Contact</th>
                        <th className="px-4 py-3.5">Route & Class</th>
                        <th className="px-4 py-3.5">Travel Date</th>
                        <th className="px-4 py-3.5">Status</th>
                        <th className="px-4 py-3.5">Notes</th>
                        <th className="px-4 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {enquiries.map((e) => (
                        <tr key={e.id} className="hover:bg-slate-50/80">
                          {/* ID & Date */}
                          <td className="px-4 py-3.5">
                            <span className="font-mono font-bold text-[#0B2545]">{e.id}</span>
                            <span className="block text-[10px] text-slate-400">
                              {new Date(e.createdAt).toLocaleDateString()}
                            </span>
                          </td>

                          {/* Service */}
                          <td className="px-4 py-3.5">
                            {renderServiceBadge(e.serviceType)}
                          </td>

                          {/* Customer */}
                          <td className="px-4 py-3.5">
                            <span className="font-bold text-slate-900 block">{e.customerName}</span>
                            <a
                              href={`tel:${e.customerPhone}`}
                              className="text-slate-500 hover:text-orange-600 block text-[11px]"
                            >
                              {e.customerPhone}
                            </a>
                            {e.customerEmail && (
                              <span className="text-[10px] text-slate-400 block truncate max-w-[130px]">
                                {e.customerEmail}
                              </span>
                            )}
                          </td>

                          {/* Route & Class */}
                          <td className="px-4 py-3.5">
                            <div className="font-medium text-slate-800">
                              {e.origin} → {e.destination}
                            </div>
                            {e.preferredClass && (
                              <span className="text-[10px] text-slate-500 block">
                                {e.preferredClass}
                              </span>
                            )}
                            {e.specialRequests && (
                              <span className="text-[10px] text-orange-600 italic block truncate max-w-[150px]" title={e.specialRequests}>
                                Note: {e.specialRequests}
                              </span>
                            )}
                          </td>

                          {/* Date & Pax */}
                          <td className="px-4 py-3.5">
                            <span className="font-semibold text-slate-800">{e.travelDate}</span>
                            <span className="text-[11px] text-slate-500 block">
                              {e.passengers} passenger(s)
                            </span>
                            {e.passengerList && e.passengerList.length > 0 && (
                              <span className="text-[10px] text-blue-700 font-semibold block truncate max-w-[130px]" title={e.passengerList.map(p => p.name).join(', ')}>
                                Pax: {e.passengerList.map(p => p.name).join(', ')}
                              </span>
                            )}
                          </td>

                          {/* Status Updater */}
                          <td className="px-4 py-3.5">
                            <select
                              value={e.status}
                              onChange={(ev) => handleStatusChange(e.id, ev.target.value as EnquiryStatus)}
                              className={`px-2 py-1 rounded-lg text-xs font-bold border outline-none cursor-pointer ${
                                e.status === 'New' ? 'bg-orange-50 text-orange-700 border-orange-300' :
                                e.status === 'Contacted' ? 'bg-blue-50 text-blue-700 border-blue-300' :
                                e.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-300' :
                                e.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' :
                                'bg-slate-100 text-slate-600 border-slate-300'
                              }`}
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>

                          {/* Internal Notes */}
                          <td className="px-4 py-3.5">
                            <button
                              onClick={() => setNotesModalEnquiry(e)}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-[#0B2545] p-1.5 rounded-lg hover:bg-slate-100"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                              <span>{e.notes?.length || 0} Notes</span>
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Customer WhatsApp Action */}
                              <button
                                onClick={() => handleOpenWhatsAppCustomer(e)}
                                className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                                title="Message Customer on WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => setDeleteConfirmId(e.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                                title="Delete Enquiry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {enquiries.length === 0 && (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    No enquiries match the selected filter criteria.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: DEDICATED TRAIN ENQUIRY MANAGEMENT */}
          {/* ========================================================= */}
          {activeTab === 'train-enquiries' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase mb-1">
                    <Train className="w-4 h-4" />
                    <span>Primary Railway Ticket Desk</span>
                  </div>
                  <h2 className="text-2xl font-black text-[#0B2545]">
                    Dedicated Train Ticket Bookings
                  </h2>
                  <p className="text-xs text-slate-500">
                    Indian Railways ticket reservations across all stations in India with origin, travel class, and quota guidance.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://wa.me/919421556220"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Agency WhatsApp Desk</span>
                  </a>
                </div>
              </div>

              {/* Transparent Railway Disclaimer Reminder */}
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>IRCTC Assistance Standard:</strong> Do not fabricate live train availability, PNR details, or ticket confirmations. Use this dashboard to coordinate with customers and record actual booking outcomes.
                </span>
              </div>

              {/* Train Cards List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainOnlyEnquiries.map((trainEnq) => (
                  <div
                    key={trainEnq.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                        <span className="font-mono font-bold text-xs text-[#0B2545]">
                          {trainEnq.id}
                        </span>
                        <select
                          value={trainEnq.status}
                          onChange={(ev) => handleStatusChange(trainEnq.id, ev.target.value as EnquiryStatus)}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${
                            trainEnq.status === 'New' ? 'bg-orange-50 text-orange-700 border-orange-300' :
                            trainEnq.status === 'Contacted' ? 'bg-blue-50 text-blue-700 border-blue-300' :
                            trainEnq.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-300' :
                            trainEnq.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' :
                            'bg-slate-100 text-slate-600 border-slate-300'
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      {/* Route Details */}
                      <div className="mb-3">
                        <div className="text-sm font-bold text-[#0B2545] flex items-center gap-1.5">
                          <Train className="w-4 h-4 text-orange-500 shrink-0" />
                          <span>{trainEnq.origin} → {trainEnq.destination}</span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {trainEnq.travelDate}
                          </span>
                          <span className="font-semibold text-slate-700">
                            {trainEnq.passengers} Passenger(s)
                          </span>
                        </div>
                      </div>

                      {/* Class & Quota */}
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-700 mb-3 space-y-1">
                        <div>
                          <span className="font-semibold text-slate-500">Class: </span>
                          <span className="font-bold text-slate-800">{trainEnq.preferredClass || 'Not Specified'}</span>
                        </div>
                        {trainEnq.specialRequests && (
                          <div>
                            <span className="font-semibold text-slate-500">Preferences: </span>
                            <span className="italic text-slate-700">{trainEnq.specialRequests}</span>
                          </div>
                        )}
                      </div>

                      {/* Customer Contact */}
                      <div className="text-xs text-slate-600 space-y-0.5 mb-3">
                        <div className="font-bold text-slate-800">{trainEnq.customerName}</div>
                        <div className="text-slate-500">{trainEnq.customerPhone}</div>
                      </div>

                      {/* Admin Notes Summary */}
                      {trainEnq.notes?.length > 0 && (
                        <div className="text-[11px] text-slate-500 bg-amber-50/60 p-2 rounded-lg border border-amber-100 mb-3">
                          <span className="font-bold text-amber-800">Latest Note: </span>
                          <span>{trainEnq.notes[trainEnq.notes.length - 1].text}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setNotesModalEnquiry(trainEnq)}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                      >
                        + Add Note
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenWhatsAppCustomer(trainEnq)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 inline-flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {trainOnlyEnquiries.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                  <p className="text-sm text-slate-500">No railway ticket enquiries found.</p>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: CUSTOMERS DIRECTORY */}
          {/* ========================================================= */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-[#0B2545]">Customers Directory</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Aggregated client profiles compiled from booking enquiries, showing travel history and direct contact links.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="px-4 py-3.5">Customer Name</th>
                        <th className="px-4 py-3.5">Phone (WhatsApp)</th>
                        <th className="px-4 py-3.5">Total Enquiries</th>
                        <th className="px-4 py-3.5">Confirmed Bookings</th>
                        <th className="px-4 py-3.5">Services Used</th>
                        <th className="px-4 py-3.5">Last Active</th>
                        <th className="px-4 py-3.5 text-right">Direct Connect</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {customers.map((c, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="px-4 py-3.5 font-bold text-slate-900">
                            {c.name}
                            {c.email && (
                              <span className="block text-[10px] text-slate-400 font-normal">
                                {c.email}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 font-medium text-slate-700">
                            <a href={`tel:${c.phone}`} className="hover:text-orange-600">
                              {c.phone}
                            </a>
                          </td>
                          <td className="px-4 py-3.5 font-bold text-slate-800">
                            {c.totalEnquiries}
                          </td>
                          <td className="px-4 py-3.5 font-bold text-emerald-600">
                            {c.confirmedBookings}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex flex-wrap gap-1">
                              {c.servicesUsed.map((s, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 font-semibold uppercase text-slate-700"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-slate-500">
                            {new Date(c.lastEnquiryDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <a
                                href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                  `Hello ${c.name}, greetings from Aazam Travel Agency.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                                title="Chat on WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href={`tel:${c.phone}`}
                                className="p-1.5 rounded-lg bg-blue-50 text-[#0B2545] border border-blue-200 hover:bg-blue-100"
                                title="Call Customer"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {customers.length === 0 && (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    No customer records found yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: TOUR PACKAGES MANAGEMENT */}
          {/* ========================================================= */}
          {activeTab === 'packages' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-[#0B2545]">Tour Packages Management</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Add, edit, or delete domestic, holiday, and religious packages displayed on the public website.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingPackage({
                      title: '',
                      category: 'Domestic',
                      duration: '5 Nights / 6 Days',
                      destination: '',
                      startingPrice: 'Rs. 15,000 per person',
                      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
                      description: '',
                      highlights: ['Sightseeing transfers', 'Hotel accommodations', 'Daily breakfast'],
                      inclusions: ['Private vehicle with chauffeur', 'Hotel stay with meals'],
                      featured: false,
                    });
                    setIsNewPackage(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Tour Package</span>
                </button>
              </div>

              {/* Packages Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-48 bg-slate-900 group overflow-hidden">
                        <img
                          src={pkg.image}
                          alt={pkg.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />
                        
                        <span className="absolute top-2.5 left-2.5 bg-[#0B2545]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/20">
                          {pkg.category}
                        </span>

                        {pkg.featured && (
                          <span className="absolute top-2.5 right-2.5 bg-orange-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Featured</span>
                          </span>
                        )}

                        {/* Image Action Overlay Buttons */}
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
                          <label
                            className="cursor-pointer px-2.5 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold flex items-center gap-1.5 backdrop-blur-md transition-colors border border-white/20 shadow-xs"
                            title="Quick upload photo from phone or desktop"
                          >
                            <Upload className="w-3.5 h-3.5 text-orange-400" />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={isUploadingPhoto}
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleDirectCardUpload(pkg, f);
                              }}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              setQuickImagePackage(pkg);
                              setQuickImageUrl(pkg.image);
                              setQuickImageCategory('All');
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white text-[11px] font-bold flex items-center gap-1.5 backdrop-blur-md transition-colors border border-white/10 shadow-xs"
                            title="Open Photo & Destination Gallery Picker"
                          >
                            <Camera className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Change Photo</span>
                          </button>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="text-[11px] text-slate-500 font-semibold mb-1">
                          {pkg.destination} · {pkg.duration}
                        </div>
                        <h4 className="font-bold text-sm text-[#0B2545] mb-2 leading-snug">
                          {pkg.title}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                          {pkg.description}
                        </p>
                        <div className="text-xs font-extrabold text-orange-600">
                          {pkg.startingPrice}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                      <button
                        onClick={() => {
                          setEditingPackage(pkg);
                          setIsNewPackage(false);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Details</span>
                      </button>

                      <button
                        onClick={() => handleDeletePackage(pkg.id)}
                        className="text-xs font-semibold text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: TRAVEL SERVICES */}
          {/* ========================================================= */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-[#0B2545]">Travel Services Catalog</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage service offerings shown across the website. Add, edit, or remove services in real-time.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingService({
                      key: 'tour',
                      title: '',
                      shortDesc: '',
                      fullDesc: '',
                      features: ['100% Pan-India Online Booking', 'Clear pricing guidance'],
                      icon: 'Compass',
                    });
                    setIsNewService(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Travel Service</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-base text-[#0B2545]">{srv.title}</h4>
                        <span className="text-[10px] font-bold text-orange-600 uppercase bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                          {srv.key}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-4">{srv.shortDesc}</p>
                      
                      <div className="space-y-1.5 border-t border-slate-100 pt-3">
                        <span className="text-[11px] font-bold text-slate-700 block">Features:</span>
                        {srv.features?.map((f, i) => (
                          <div key={i} className="text-xs text-slate-500 flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">·</span>
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 mt-4 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingService(srv);
                          setIsNewService(false);
                        }}
                        className="flex-1 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-xs font-bold text-[#0B2545] transition-colors"
                      >
                        Edit Details
                      </button>
                      <button
                        onClick={() => handleDeleteService(srv.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 7: WEBSITE SETTINGS */}
          {/* ========================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-2xl font-black text-[#0B2545]">Website Content & Settings</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Edit public contact numbers, address, hero banner texts, and announcements in real-time.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Business Name</label>
                    <input
                      type="text"
                      value={settings.businessName}
                      onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Location City</label>
                    <input
                      type="text"
                      value={settings.location}
                      onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Phone Number</label>
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">WhatsApp Number</label>
                    <input
                      type="text"
                      value={settings.whatsapp}
                      onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Registered Office / Online Desk Address</label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Office Working Hours</label>
                    <input
                      type="text"
                      value={settings.officeHours}
                      onChange={(e) => setSettings({ ...settings, officeHours: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Contact Email</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                    />
                  </div>
                </div>

                {/* Announcement Ticker */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Top Announcement Banner</label>
                    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.announcementActive}
                        onChange={(e) => setSettings({ ...settings, announcementActive: e.target.checked })}
                      />
                      <span>Active on Website</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={settings.announcement}
                    onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                  />
                </div>

                {/* Hero Headlines */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Hero Headline</label>
                    <input
                      type="text"
                      value={settings.heroHeadline}
                      onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Hero Subheadline</label>
                    <textarea
                      rows={2}
                      value={settings.heroSubheadline}
                      onChange={(e) => setSettings({ ...settings, heroSubheadline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B2545] hover:bg-blue-900 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Website Settings</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 8: ADMIN PROFILE & PASSWORD */}
          {/* ========================================================= */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h2 className="text-2xl font-black text-[#0B2545]">Admin Profile & Security</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage agency administrator credentials and update your password.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Administrator Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Admin Email</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase">Change Password</h4>
                  
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-700">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Required only to set a new password"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-700">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0B2545] hover:bg-blue-900 text-white font-bold text-xs shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    <span>Update Profile</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================= */}
      {/* MODAL: CUSTOMER WHATSAPP ACTION WITH EDITABLE TEMPLATE */}
      {/* ========================================================= */}
      {whatsAppModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#0B2545]">WhatsApp Customer Message</h3>
                  <p className="text-xs text-slate-500">To: {whatsAppModalData.customerName} ({whatsAppModalData.customerPhone})</p>
                </div>
              </div>
              <button
                onClick={() => setWhatsAppModalData(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-5">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Message Template (Editable)
              </label>
              <textarea
                rows={6}
                value={whatsAppModalData.message}
                onChange={(e) =>
                  setWhatsAppModalData({ ...whatsAppModalData, message: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:border-emerald-600 font-sans"
              />
              <span className="text-[11px] text-slate-400 block">
                Clicking send will launch WhatsApp directly with the customer’s phone number.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setWhatsAppModalData(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSendCustomerWhatsApp}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Open in WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: INTERNAL ENQUIRY NOTES */}
      {/* ========================================================= */}
      {notesModalEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-[#0B2545]">
                  Internal Notes — {notesModalEnquiry.id}
                </h3>
                <p className="text-xs text-slate-500">
                  {notesModalEnquiry.customerName} · {notesModalEnquiry.origin} → {notesModalEnquiry.destination}
                </p>
                {notesModalEnquiry.passengerList && notesModalEnquiry.passengerList.length > 0 && (
                  <div className="mt-2 p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs">
                    <span className="font-bold text-blue-900 block mb-1">
                      Passenger Manifest ({notesModalEnquiry.passengerList.length} travelers):
                    </span>
                    <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                      {notesModalEnquiry.passengerList.map((p, idx) => (
                        <div key={idx} className="flex justify-between text-[11px] text-blue-800">
                          <span className="font-medium">{idx + 1}. {p.name} {idx === 0 ? '(Primary)' : ''}</span>
                          <span className="text-slate-500 text-[10px]">{p.age ? `Age ${p.age}` : ''} {p.gender ? `• ${p.gender}` : ''} {p.berthPreference && p.berthPreference !== 'No Preference' ? `• ${p.berthPreference}` : ''} {p.seatPreference && p.seatPreference !== 'No Preference' ? `• ${p.seatPreference}` : ''}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => setNotesModalEnquiry(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 mb-4 pr-1">
              {notesModalEnquiry.notes && notesModalEnquiry.notes.length > 0 ? (
                notesModalEnquiry.notes.map((note) => (
                  <div key={note.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                    <p className="text-slate-800">{note.text}</p>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{note.author}</span>
                      <span>{new Date(note.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-6">No internal notes added yet.</p>
              )}
            </div>

            <form onSubmit={handleAddNote} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Type internal note (e.g. Called passenger, Tatkal form prepared)..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:border-orange-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNotesModalEnquiry(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs"
                >
                  Add Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DELETE CONFIRMATION */}
      {/* ========================================================= */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1">Confirm Deletion</h3>
            <p className="text-xs text-slate-500 mb-5">
              Are you sure you want to delete enquiry {deleteConfirmId}? This action cannot be undone.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteEnquiry(deleteConfirmId)}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: PACKAGE CREATE/EDIT */}
      {/* ========================================================= */}
      {editingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-[#0B2545]">
                {isNewPackage ? 'Create Tour Package' : 'Edit Tour Package'}
              </h3>
              <button onClick={() => setEditingPackage(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Package Title *</label>
                <input
                  type="text"
                  required
                  value={editingPackage.title || ''}
                  onChange={(e) => setEditingPackage({ ...editingPackage, title: e.target.value })}
                  placeholder="e.g. Kashmir Valley Paradise"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category</label>
                  <select
                    value={editingPackage.category || 'Domestic'}
                    onChange={(e) => setEditingPackage({ ...editingPackage, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Domestic">Domestic</option>
                    <option value="Religious">Religious</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Family">Family</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Duration *</label>
                  <input
                    type="text"
                    required
                    value={editingPackage.duration || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, duration: e.target.value })}
                    placeholder="e.g. 5 Nights / 6 Days"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Destination *</label>
                  <input
                    type="text"
                    required
                    value={editingPackage.destination || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, destination: e.target.value })}
                    placeholder="e.g. Srinagar, Gulmarg"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Starting Price</label>
                  <input
                    type="text"
                    value={editingPackage.startingPrice || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, startingPrice: e.target.value })}
                    placeholder="e.g. Rs. 18,500 per person"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {/* Package Image Manager */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-orange-500" />
                    <span>Package Photo & Thumbnail *</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Upload or Pick Destination</span>
                </div>

                {/* Live Image Preview */}
                <div className="relative h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group">
                  {editingPackage.image ? (
                    <>
                      <img
                        src={editingPackage.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                        <span className="font-semibold truncate max-w-[200px]">
                          {editingPackage.title || 'Package Preview'}
                        </span>
                        <span className="bg-emerald-600/90 px-2 py-0.5 rounded text-[10px] font-bold">
                          Active Photo
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                      <ImageIcon className="w-8 h-8 text-slate-300 mb-1" />
                      <span className="text-xs">No image selected</span>
                    </div>
                  )}
                </div>

                {/* Device Upload Button */}
                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-bold transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from Phone / Computer</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          processImageFile(file, (dataUrl) => {
                            setEditingPackage({ ...editingPackage, image: dataUrl });
                            showToast('Photo uploaded and ready to save!');
                          });
                        }
                      }}
                    />
                  </label>
                </div>

                {/* One-Tap Popular Destination Presets */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-orange-500" />
                      <span>Or Select from Curated Destination Photos:</span>
                    </label>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1">
                    {['All', 'Religious', 'Holiday', 'Domestic'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setPackagePresetFilter(cat)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                          packagePresetFilter === cat
                            ? 'bg-[#0B2545] text-white shadow-xs'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                    {PRESET_PACKAGE_IMAGES
                      .filter((p) => packagePresetFilter === 'All' || p.tag === packagePresetFilter)
                      .map((preset, idx) => {
                        const isSelected = editingPackage.image === preset.url;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setEditingPackage({ ...editingPackage, image: preset.url })}
                            className={`relative rounded-lg overflow-hidden border text-left transition-all ${
                              isSelected
                                ? 'border-orange-500 ring-2 ring-orange-400'
                                : 'border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.label}
                              className="w-full h-12 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                            <span className="absolute bottom-1 left-1 right-1 text-[9px] font-bold text-white truncate leading-tight">
                              {preset.label.split(' ')[0]}
                            </span>
                            {isSelected && (
                              <div className="absolute top-1 right-1 bg-orange-500 text-white rounded-full p-0.5">
                                <Check className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Direct URL Fallback */}
                <div className="space-y-1 pt-1">
                  <label className="text-[10px] text-slate-500 block">
                    Or paste web image link:
                  </label>
                  <input
                    type="url"
                    value={editingPackage.image || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Description</label>
                <textarea
                  rows={3}
                  value={editingPackage.description || ''}
                  onChange={(e) => setEditingPackage({ ...editingPackage, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPackage(null)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: SERVICE CREATE / EDIT */}
      {/* ========================================================= */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-[#0B2545]">
                {isNewService ? 'Add New Travel Service' : `Edit Service — ${editingService.title || ''}`}
              </h3>
              <button onClick={() => setEditingService(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={editingService.title || ''}
                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                    placeholder="e.g. Airport Cab Booking"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Service Category Key</label>
                  <select
                    value={editingService.key || 'tour'}
                    onChange={(e) => setEditingService({ ...editingService, key: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="train">Train</option>
                    <option value="flight">Flight</option>
                    <option value="bus">Bus</option>
                    <option value="hotel">Hotel</option>
                    <option value="tour">Tour</option>
                    <option value="religious">Religious</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Display Icon</label>
                  <select
                    value={editingService.icon || 'Compass'}
                    onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Train">Train Icon</option>
                    <option value="Plane">Plane Icon</option>
                    <option value="Bus">Bus Icon</option>
                    <option value="Building2">Hotel / Building Icon</option>
                    <option value="Compass">Compass / Tour Icon</option>
                    <option value="MapPin">Location / Religious Icon</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Key Features (comma-separated)</label>
                  <input
                    type="text"
                    value={editingService.features?.join(', ') || ''}
                    onChange={(e) => setEditingService({
                      ...editingService,
                      features: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })}
                    placeholder="Feature 1, Feature 2, Feature 3"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Short Card Description *</label>
                <textarea
                  rows={2}
                  required
                  value={editingService.shortDesc || ''}
                  onChange={(e) => setEditingService({ ...editingService, shortDesc: e.target.value })}
                  placeholder="One sentence summary shown on service card"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Detailed Description</label>
                <textarea
                  rows={3}
                  value={editingService.fullDesc || ''}
                  onChange={(e) => setEditingService({ ...editingService, fullDesc: e.target.value })}
                  placeholder="Detailed information and booking guidance"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold"
                >
                  {isNewService ? 'Create Travel Service' : 'Update Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: QUICK PACKAGE PHOTO MANAGER */}
      {/* ========================================================= */}
      {quickImagePackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#0B2545]">
                    Update Package Photo
                  </h3>
                  <p className="text-xs text-slate-500">
                    {quickImagePackage.title} · {quickImagePackage.destination}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setQuickImagePackage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Active Image Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Photo Preview</span>
                  <span className="text-[10px] text-slate-400">Displayed on Website</span>
                </label>
                <div className="relative h-48 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner group">
                  <img
                    src={quickImageUrl || quickImagePackage.image}
                    alt={quickImagePackage.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="font-bold truncate max-w-[240px]">
                      {quickImagePackage.title}
                    </span>
                    <span className="bg-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold">
                      Selected Photo
                    </span>
                  </div>
                </div>
              </div>

              {/* Upload from Phone / PC */}
              <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-orange-600 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-orange-950 block">Upload from Device</span>
                    <span className="text-[11px] text-orange-700/80">Select any camera photo or gallery image</span>
                  </div>
                </div>
                <label className="cursor-pointer px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-colors shrink-0 shadow-xs">
                  <span>Browse Device</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        processImageFile(file, (dataUrl) => {
                          setQuickImageUrl(dataUrl);
                          showToast('Photo selected! Tap "Save Photo" below.');
                        });
                      }
                    }}
                  />
                </label>
              </div>

              {/* Destination Photo Gallery with Filters */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                    <span>Choose from Curated Destination Photos</span>
                  </label>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {['All', 'Religious', 'Holiday', 'Domestic'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setQuickImageCategory(cat)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                        quickImageCategory === cat
                          ? 'bg-[#0B2545] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Preset Thumbnails Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1.5 bg-slate-50 rounded-xl border border-slate-200">
                  {PRESET_PACKAGE_IMAGES
                    .filter((p) => quickImageCategory === 'All' || p.tag === quickImageCategory)
                    .map((preset, idx) => {
                      const isSelected = quickImageUrl === preset.url;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setQuickImageUrl(preset.url)}
                          className={`group relative rounded-xl overflow-hidden border text-left transition-all ${
                            isSelected
                              ? 'border-orange-500 ring-2 ring-orange-500 shadow-md'
                              : 'border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-full h-16 object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                          <span className="absolute bottom-1 left-1.5 right-1.5 text-[10px] font-bold text-white truncate leading-tight">
                            {preset.label}
                          </span>
                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-orange-500 text-white rounded-full p-0.5">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Direct URL Input */}
              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Or Paste Custom Image URL:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={quickImageUrl}
                    onChange={(e) => setQuickImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setQuickImagePackage(null)}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isUploadingPhoto || !quickImageUrl}
                  onClick={handleSaveQuickPhoto}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-colors"
                >
                  {isUploadingPhoto ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Photo...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save & Apply Photo</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
