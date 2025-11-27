
import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutGrid, 
  Calendar as CalendarIcon, 
  PlusCircle, 
  Activity, 
  Image as GalleryIcon, 
  Sparkles, 
  Send,
  X,
  PackageCheck,
  CreditCard,
  Search,
  Phone,
  Link as LinkIcon,
  UserPlus,
  UserRoundSearch,
  ChevronLeft,
  ChevronRight,
  Download,
  MessageCircle,
  MoreVertical,
  Settings,
  Palette,
  Check,
  AlertTriangle,
  Clock,
  Briefcase,
  CheckSquare,
  Square,
  Circle,
  CheckCircle2,
  Cloud,
  RefreshCw,
  FolderOpen,
  Maximize2,
  FileText,
  Globe,
  Lock,
  LogOut,
  Trash2,
  Edit2,
  Home
} from 'lucide-react';
import { Booking, DeliveryStatus, AppSettings, EditingTask, DriveFile, AppTheme, InvoiceTheme } from './types';
import { getBookings, saveBooking, createNewBooking, saveSettings, getSettings, deleteBooking } from './services/storageService';
import { backupToCloud } from './services/backupService';
import { connectToGoogleDrive, getDemoFolderImages } from './services/driveService';
import { parseBookingCommand } from './services/geminiService';
import { BookingCard } from './components/BookingCard';
import { InvoiceTemplate } from './components/InvoiceTemplate';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
// @ts-ignore
import html2canvas from 'html2canvas';
// @ts-ignore
import jsPDF from 'jspdf';

// --- TRANSLATIONS ---

const TRANSLATIONS = {
  en: {
    nav_gallery: 'Gallery',
    nav_bookings: 'Bookings',
    nav_calendar: 'Calendar',
    nav_tracking: 'Dashboard',
    search_placeholder: 'Search clients, dates...',
    app_settings: 'App Settings',
    cloud_backup: 'Cloud Backup',
    app_appearance: 'App Appearance',
    invoice_styling: 'Invoice Styling',
    company_branding: 'Company Branding',
    invoice_logo: 'Invoice Logo',
    save_changes: 'Save Changes',
    language: 'Language',
    tracking_dashboard: 'Business Dashboard',
    pending: 'Pending',
    editing: 'Editing',
    delivered: 'Delivered',
    all: 'All'
  },
  bn: {
    nav_gallery: 'গ্যালারি',
    nav_bookings: 'বুকিং',
    nav_calendar: 'ক্যালেন্ডার',
    nav_tracking: 'ড্যাশবোর্ড',
    search_placeholder: 'ক্লায়েন্ট বা ইভেন্ট খুঁজুন...',
    app_settings: 'সেটিংস',
    cloud_backup: 'ক্লাউড ব্যাকআপ',
    app_appearance: 'থিম',
    invoice_styling: 'ইনভয়েস স্টাইল',
    company_branding: 'কোম্পানি তথ্য',
    invoice_logo: 'ইনভয়েস লোগো',
    save_changes: 'সেভ করুন',
    language: 'ভাষা',
    tracking_dashboard: 'বিজনেস ড্যাশবোর্ড',
    pending: 'পেন্ডিং',
    editing: 'এডিটিং',
    delivered: 'ডেলিভারড',
    all: 'সব'
  }
};

// --- SUB-COMPONENTS ---

const GoogleLogo = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(onFinish, 2500);
        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-6">
            <div className="relative z-10 animate-fadeInUp">
                <div className="w-20 h-20 border-4 border-[#FFB300] rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-16 h-16 border-2 border-[#FFB300] rounded-full flex items-center justify-center">
                    <Sparkles className="text-[#FFB300]" size={32}/>
                  </div>
                </div>
                <h1 className="text-4xl font-serif text-[#FFF9C4] tracking-widest text-center mb-2">SHOOTSYNC</h1>
                <p className="text-xs text-[#FFB300] uppercase tracking-[0.3em] text-center opacity-80">Photography Management</p>
            </div>
        </div>
    );
};

// ... [GalleryPage, CalendarPage, TrackingPage implemented below] ...

const CalendarPage = ({ bookings, onSelectBooking }: { bookings: Booking[], onSelectBooking: (b: Booking) => void }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const getEventsForDay = (day: number) => {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    targetDate.setHours(0,0,0,0);
    
    return bookings.filter(b => {
      const start = new Date(b.startDate);
      const end = new Date(b.endDate);
      start.setHours(0,0,0,0);
      end.setHours(0,0,0,0);
      return targetDate >= start && targetDate <= end;
    });
  };

  const renderCalendarDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50/30 border-r border-b border-gray-100"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const events = getEventsForDay(d);
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), d).toDateString();

      days.push(
        <div key={d} className={`h-24 border-r border-b border-gray-100 p-1 relative overflow-hidden bg-white hover:bg-gray-50 transition-colors ${isToday ? 'bg-indigo-50/30' : ''}`}>
          <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1 ${isToday ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}>{d}</span>
          <div className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100%-24px)] no-scrollbar">
            {events.map(ev => (
              <button 
                key={ev.id}
                onClick={(e) => { e.stopPropagation(); onSelectBooking(ev); }}
                className={`text-[10px] px-1.5 py-0.5 rounded truncate text-left w-full shadow-sm border-l-2 ${
                   ev.deliveryStatus === DeliveryStatus.DELIVERED ? 'bg-green-50 text-green-700 border-green-500' : 
                   ev.startDate === new Date(currentDate.getFullYear(), currentDate.getMonth(), d).toISOString().split('T')[0] ? 'bg-indigo-50 text-indigo-700 border-indigo-500' : 'bg-gray-100 text-gray-600 border-gray-400'
                }`}
              >
                {ev.clientName}
              </button>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="p-4 pb-24 h-full flex flex-col animate-fadeInUp">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold font-serif text-gray-800">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          <button onClick={prevMonth} className="p-1.5 rounded-md hover:bg-white hover:shadow-sm transition"><ChevronLeft size={18} className="text-gray-600"/></button>
          <button onClick={nextMonth} className="p-1.5 rounded-md hover:bg-white hover:shadow-sm transition"><ChevronRight size={18} className="text-gray-600"/></button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 text-center mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{day}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 flex-1 auto-rows-fr rounded-2xl overflow-hidden border-t border-l border-gray-200 shadow-sm bg-white">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

const TrackingPage = ({ bookings, onUpdate, onDeliver, onEdit, onDelete }: any) => {
  // Enhanced Tracking Logic
  const stats = [
    { name: 'Pending', value: bookings.filter((b: Booking) => b.deliveryStatus === DeliveryStatus.PENDING).length, color: '#94a3b8' },
    { name: 'Editing', value: bookings.filter((b: Booking) => b.deliveryStatus === DeliveryStatus.IN_PROGRESS).length, color: '#6366f1' },
    { name: 'Done', value: bookings.filter((b: Booking) => b.deliveryStatus === DeliveryStatus.DELIVERED).length, color: '#22c55e' },
  ];

  // Prioritize "Editing Priority" items
  const activeBookings = bookings
    .filter((b: Booking) => b.deliveryStatus !== DeliveryStatus.DELIVERED && b.shootDoneDate)
    .sort((a: Booking, b: Booking) => b.editingProgress - a.editingProgress);

  return (
    <div className="p-4 pb-24 animate-fadeInUp">
      <h2 className="text-2xl font-bold font-serif mb-6 text-gray-800">Business Dashboard</h2>
      
      <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-indigo-50 p-3 rounded-2xl border border-indigo-100">
              <p className="text-indigo-600 text-xs font-bold uppercase mb-1">In Progress</p>
              <p className="text-2xl font-bold text-indigo-900">{stats[1].value}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-2xl border border-green-100">
              <p className="text-green-600 text-xs font-bold uppercase mb-1">Delivered</p>
              <p className="text-2xl font-bold text-green-900">{stats[2].value}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <p className="text-gray-500 text-xs font-bold uppercase mb-1">Pending</p>
              <p className="text-2xl font-bold text-gray-700">{stats[0].value}</p>
          </div>
      </div>

      <div className="h-40 w-full bg-white rounded-2xl shadow-sm p-4 mb-8 border border-gray-100">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats} barSize={40}>
            <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#94a3b8'}} />
            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
            <Bar dataKey="value" radius={[6, 6, 6, 6]}>
              {stats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3 className="text-lg font-bold font-serif mb-4 flex items-center gap-2">
         <Activity size={18} className="text-rose-500"/> Active Edits
      </h3>
      
      <div className="space-y-4">
        {activeBookings.length === 0 && (
            <div className="text-center py-8 opacity-50 text-sm italic">No active edits currently.</div>
        )}
        {activeBookings.map((booking: Booking) => (
             <BookingCard 
                key={booking.id} 
                booking={booking} 
                onClick={() => onEdit(booking)} 
             />
        ))}
      </div>
    </div>
  );
};

// ... [GalleryPage Component similar to previous, but refined] ...
const GalleryPage = ({ isConnected, setIsConnected }: { isConnected: boolean, setIsConnected: (v: boolean) => void }) => {
    const [images, setImages] = useState<DriveFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        if (isConnected && images.length === 0) {
            getDemoFolderImages().then(setImages);
        }
    }, [isConnected]);

    const handleConnect = async () => {
        setIsLoading(true);
        const success = await connectToGoogleDrive();
        if (success) {
            const files = await getDemoFolderImages();
            setImages(files);
            setIsConnected(true);
        }
        setIsLoading(false);
    };

    return (
        <div className="p-4 pb-24 h-full animate-fadeInUp">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-serif flex items-center gap-2">
                    Gallery
                </h2>
                {isConnected && (
                    <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                        <Cloud size={10} /> Sync On
                    </span>
                )}
            </div>

            {!isConnected ? (
                <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-6">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center animate-pulse">
                        <FolderOpen size={40} className="text-blue-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Connect Portfolio</h3>
                        <p className="opacity-60 text-sm mt-2 max-w-xs mx-auto">
                            Link your Google Drive "Demo" folder to showcase shots.
                        </p>
                    </div>
                    <button 
                        onClick={handleConnect}
                        disabled={isLoading}
                        className="bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-xl font-bold shadow-sm hover:shadow active:scale-95 transition-all flex items-center gap-3"
                    >
                        {isLoading ? <RefreshCw className="animate-spin text-gray-400" /> : <GoogleLogo />}
                        <span>Link Google Drive</span>
                    </button>
                </div>
            ) : (
                <div className="columns-2 gap-4 space-y-4">
                    {images.map((img, i) => (
                        <div key={img.id} className="break-inside-avoid rounded-xl overflow-hidden shadow-md bg-gray-100 relative group">
                            <img src={img.thumbnailLink} alt={img.name} className="w-full h-auto object-cover" loading="lazy" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                <p className="text-white text-[10px] truncate w-full">{img.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- SETTINGS MODAL (Re-used with minor style tweaks) ---
// Note: Keeping logic mostly same, just ensuring style consistency.
const SettingsModal = ({ isOpen, onClose, settings, onSave, onBackup, isBackingUp }: any) => {
    const [local, setLocal] = useState(settings);
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-end sm:items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 max-h-[85vh] overflow-y-auto animate-fadeInUp text-slate-900">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-xl font-bold font-serif">Settings</h2>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full"><X size={18}/></button>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Company Name</label>
                        <input 
                            value={local.companyName} 
                            onChange={e => setLocal({...local, companyName: e.target.value})}
                            className="w-full p-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-semibold"
                        />
                    </div>
                    
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Theme</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['light', 'dark', 'floral', 'luxury', 'ocean'].map((t) => (
                                <button 
                                    key={t}
                                    onClick={() => setLocal({...local, theme: t})}
                                    className={`p-3 rounded-xl border text-sm font-medium capitalize ${local.theme === t ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' : 'border-gray-200'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="font-bold text-blue-900 text-sm">Cloud Backup</p>
                            <p className="text-xs text-blue-700 opacity-80">{local.lastBackupDate ? `Last: ${new Date(local.lastBackupDate).toLocaleTimeString()}` : 'Not synced yet'}</p>
                        </div>
                        <button 
                            onClick={() => { 
                                setLocal({...local, enableCloudBackup: true}); 
                                onSave({...local, enableCloudBackup: true});
                                onBackup(); 
                            }} 
                            disabled={isBackingUp}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xs"
                        >
                            {isBackingUp ? 'Syncing...' : 'Sync Now'}
                        </button>
                    </div>
                </div>

                <button 
                    onClick={() => { onSave(local); onClose(); }}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold mt-8 shadow-lg active:scale-95 transition-transform"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

// --- MAIN APP ---

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookings' | 'calendar' | 'tracking' | 'gallery'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  
  // Modals & AI
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [aiPromptOpen, setAiPromptOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'EDITING' | 'DELIVERED'>('ALL');

  // Invoice
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [printingBooking, setPrintingBooking] = useState<Booking | null>(null);

  useEffect(() => {
    setBookings(getBookings());
    // Auto-backup interval could go here
  }, []);

  useEffect(() => {
      // Dynamic Body Background based on Theme
      document.body.className = settings.theme === 'dark' ? 'bg-slate-900' : 'bg-[#f8fafc]';
  }, [settings.theme]);

  // -- Actions --

  const handleSaveBooking = (booking: Booking) => {
      saveBooking(booking);
      setBookings(getBookings());
      setSelectedBooking(booking);
      setIsEditing(false);
      // Trigger backup
      if (settings.enableCloudBackup) {
          setIsBackingUp(true);
          backupToCloud(getBookings()).then(() => setIsBackingUp(false));
      }
  };

  const handleDeleteBooking = (booking: Booking) => {
      if (confirm('Delete this booking permanently?')) {
          deleteBooking(booking.id);
          setBookings(getBookings());
          setSelectedBooking(null);
      }
  };

  const handleAICommand = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    const newBooking = await parseBookingCommand(aiInput);
    setAiLoading(false);
    
    if (newBooking) {
        setAiInput('');
        setAiPromptOpen(false);
        saveBooking(newBooking);
        setBookings(getBookings());
        setSelectedBooking(newBooking); // Open it immediately
    } else {
        alert("Sorry, I couldn't understand that. Try adding a date and amount.");
    }
  };

  const generatePDF = async (booking: Booking) => {
      setPrintingBooking(booking);
      setIsGenerating(true);
      await new Promise(r => setTimeout(r, 1000)); // Wait for render

      if (invoiceRef.current) {
          try {
              const canvas = await html2canvas(invoiceRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
              const imgData = canvas.toDataURL('image/jpeg', 0.9);
              
              const pdf = new jsPDF('p', 'mm', 'a4');
              const pdfWidth = pdf.internal.pageSize.getWidth();
              const pdfHeight = pdf.internal.pageSize.getHeight();
              
              pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
              pdf.save(`Invoice_${booking.clientName.replace(/\s/g, '_')}.pdf`);
          } catch (e) {
              console.error(e);
              alert("Error generating PDF");
          }
      }
      setIsGenerating(false);
      setPrintingBooking(null);
  };

  const filteredBookings = bookings.filter(b => {
      const matchSearch = b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.venue?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchFilter = filterStatus === 'ALL' ? true :
                          filterStatus === 'DELIVERED' ? b.deliveryStatus === DeliveryStatus.DELIVERED :
                          filterStatus === 'EDITING' ? (b.editingProgress > 0 && b.deliveryStatus !== DeliveryStatus.DELIVERED) :
                          (b.deliveryStatus === DeliveryStatus.PENDING && b.editingProgress === 0);
      return matchSearch && matchFilter;
  });

  // Theme Helpers
  const getThemeClasses = () => {
      switch(settings.theme) {
          case 'dark': return { bg: 'bg-slate-900', text: 'text-white', ui: 'bg-slate-800 border-slate-700' };
          case 'luxury': return { bg: 'bg-[#1c1917]', text: 'text-[#fef3c7]', ui: 'bg-[#292524] border-[#78350f]' };
          case 'floral': return { bg: 'bg-[#fff1f2]', text: 'text-[#881337]', ui: 'bg-white border-[#fecdd3]' };
          default: return { bg: 'bg-slate-50', text: 'text-slate-900', ui: 'bg-white border-gray-200' };
      }
  };
  const theme = getThemeClasses();

  if (showSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />;

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} font-sans transition-colors duration-300 pb-safe`}>
      
      {/* Hidden Invoice Container for Printing */}
      <div className="fixed top-0 left-[-9999px]">
          {printingBooking && <InvoiceTemplate ref={invoiceRef} booking={printingBooking} settings={settings} />}
      </div>

      {/* HEADER */}
      <header className={`sticky top-0 z-20 px-4 py-4 flex justify-between items-center bg-opacity-90 backdrop-blur-md border-b ${settings.theme === 'dark' ? 'border-slate-800 bg-slate-900/90' : 'border-gray-200/50 bg-white/80'}`}>
         <div className="flex items-center gap-3">
             <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 rounded-full hover:bg-black/5"><MoreVertical size={20}/></button>
             <h1 className="font-serif font-bold text-xl tracking-tight">{settings.companyName || 'ShootSync'}</h1>
         </div>
         <button 
            onClick={() => { setSelectedBooking(createNewBooking({})); setIsEditing(true); }}
            className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 active:scale-90 transition-transform"
         >
             <PlusCircle size={24}/>
         </button>
      </header>

      {/* SIDEBAR */}
      {isSidebarOpen && (
          <div className="fixed inset-0 z-50 flex">
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
              <div className={`w-3/4 max-w-xs h-full ${theme.ui} shadow-2xl relative p-6 flex flex-col animate-[fadeIn_0.3s_ease-out]`}>
                  <h2 className="text-2xl font-serif font-bold mb-8">{settings.companyName}</h2>
                  <nav className="space-y-2">
                      <button onClick={() => {setIsSettingsOpen(true); setIsSidebarOpen(false)}} className="flex items-center gap-4 w-full p-3 rounded-xl hover:bg-black/5 font-medium">
                          <Settings size={20}/> App Settings
                      </button>
                      <div className="h-px bg-current opacity-10 my-4"></div>
                      <p className="text-xs opacity-50 uppercase tracking-widest px-3 mb-2">Cloud</p>
                      <button onClick={() => {}} className="flex items-center gap-4 w-full p-3 rounded-xl hover:bg-black/5 font-medium opacity-60">
                          <Cloud size={20}/> {settings.lastBackupDate ? 'Synced' : 'Not Synced'}
                      </button>
                  </nav>
              </div>
          </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="max-w-xl mx-auto min-h-[85vh]">
          
          {/* BOOKINGS TAB */}
          {activeTab === 'bookings' && (
              <div className="p-4 pb-24 animate-fadeInUp">
                  {/* Search & Filter */}
                  <div className="sticky top-[72px] z-10 space-y-3 mb-6">
                       <div className={`relative rounded-2xl shadow-sm ${theme.ui}`}>
                           <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
                           <input 
                              placeholder="Search clients..." 
                              value={searchTerm}
                              onChange={e => setSearchTerm(e.target.value)}
                              className="w-full pl-11 pr-4 py-3 bg-transparent outline-none font-medium"
                           />
                       </div>
                       <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                           {(['ALL', 'PENDING', 'EDITING', 'DELIVERED'] as const).map(s => (
                               <button 
                                  key={s}
                                  onClick={() => setFilterStatus(s)}
                                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                                      filterStatus === s 
                                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                                      : 'bg-transparent border-current opacity-40'
                                  }`}
                               >
                                   {s}
                               </button>
                           ))}
                       </div>
                  </div>

                  {/* List */}
                  <div className="space-y-4">
                      {filteredBookings.length === 0 && (
                          <div className="text-center py-20 opacity-40">
                              <p className="font-serif text-lg">No bookings found</p>
                              <p className="text-sm">Try a different search or add new.</p>
                          </div>
                      )}
                      {filteredBookings.map(b => (
                          <BookingCard 
                             key={b.id} 
                             booking={b} 
                             onClick={() => setSelectedBooking(b)} 
                          />
                      ))}
                  </div>
              </div>
          )}

          {activeTab === 'calendar' && <CalendarPage bookings={bookings} onSelectBooking={setSelectedBooking}/>}
          {activeTab === 'tracking' && <TrackingPage bookings={bookings} onUpdate={handleSaveBooking} onEdit={(b: any) => {setSelectedBooking(b); setIsEditing(true)}}/>}
          {activeTab === 'gallery' && <GalleryPage isConnected={isGoogleConnected} setIsConnected={setIsGoogleConnected}/>}

      </main>

      {/* FLOATING AI BUTTON */}
      <div className="fixed bottom-24 right-4 z-30">
          <button 
            onClick={() => setAiPromptOpen(true)}
            className="w-14 h-14 bg-gradient-to-tr from-rose-500 to-amber-500 text-white rounded-full shadow-xl flex items-center justify-center border-4 border-white/20 backdrop-blur hover:scale-110 active:scale-95 transition-all"
          >
              <Sparkles size={24} className={aiLoading ? 'animate-spin' : ''} />
          </button>
      </div>

      {/* AI PROMPT MODAL */}
      {aiPromptOpen && (
          <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
              <div className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl animate-fadeInUp">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-800 flex items-center gap-2">
                          <Sparkles size={18} className="text-rose-500"/> AI Quick Add
                      </h3>
                      <button onClick={() => setAiPromptOpen(false)} className="bg-gray-100 p-1 rounded-full"><X size={16}/></button>
                  </div>
                  <textarea 
                      autoFocus
                      placeholder="e.g. Rahul weds Anjali next friday for 50k"
                      className="w-full bg-gray-50 rounded-xl p-4 text-gray-800 font-medium focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-32 mb-4"
                      value={aiInput}
                      onChange={e => setAiInput(e.target.value)}
                  />
                  <button 
                      onClick={handleAICommand}
                      disabled={aiLoading}
                      className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                      {aiLoading ? 'Processing...' : <><Send size={18}/> Create Booking</>}
                  </button>
              </div>
          </div>
      )}

      {/* BOTTOM NAVIGATION */}
      <nav className={`fixed bottom-0 w-full z-40 bg-white/90 backdrop-blur-lg border-t border-gray-200 pb-safe ${settings.theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : ''}`}>
          <div className="flex justify-around items-center h-16 max-w-md mx-auto">
              {[
                  { id: 'bookings', icon: LayoutGrid, label: 'Bookings' },
                  { id: 'calendar', icon: CalendarIcon, label: 'Calendar' },
                  { id: 'tracking', icon: Activity, label: 'Dash' },
                  { id: 'gallery', icon: GalleryIcon, label: 'Gallery' },
              ].map(item => {
                  const isActive = activeTab === item.id;
                  return (
                      <button 
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)}
                        className={`flex flex-col items-center justify-center w-16 h-full transition-all ${isActive ? 'text-indigo-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                          <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                          {isActive && <span className="text-[10px] font-bold mt-1">{item.label}</span>}
                      </button>
                  )
              })}
          </div>
      </nav>

      {/* BOOKING DETAILS MODAL (Simplified for brevity, includes View/Edit modes) */}
      {selectedBooking && (
          <div className="fixed inset-0 z-[50] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className={`w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl ${theme.ui} ${theme.text}`}>
                  {/* Modal Header */}
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                      <h2 className="font-bold">{isEditing ? 'Edit Details' : 'Booking Info'}</h2>
                      <button onClick={() => {setSelectedBooking(null); setIsEditing(false)}} className="p-2 hover:bg-gray-200 rounded-full"><X size={20}/></button>
                  </div>
                  
                  {/* Modal Body */}
                  <div className={`flex-1 overflow-y-auto p-6 space-y-5 ${theme.bg}`}>
                      {isEditing ? (
                          <>
                             {/* EDIT FORM INPUTS */}
                             <div className="space-y-4">
                                <div><label className="text-xs font-bold opacity-50 uppercase">Client</label><input className="w-full p-3 rounded-lg border bg-transparent" value={selectedBooking.clientName} onChange={e => setSelectedBooking({...selectedBooking, clientName: e.target.value})} /></div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className="text-xs font-bold opacity-50 uppercase">Start</label><input type="date" className="w-full p-3 rounded-lg border bg-transparent" value={selectedBooking.startDate} onChange={e => setSelectedBooking({...selectedBooking, startDate: e.target.value})} /></div>
                                    <div><label className="text-xs font-bold opacity-50 uppercase">End</label><input type="date" className="w-full p-3 rounded-lg border bg-transparent" value={selectedBooking.endDate} onChange={e => setSelectedBooking({...selectedBooking, endDate: e.target.value})} /></div>
                                </div>
                                <div><label className="text-xs font-bold opacity-50 uppercase">Venue</label><input className="w-full p-3 rounded-lg border bg-transparent" value={selectedBooking.venue} onChange={e => setSelectedBooking({...selectedBooking, venue: e.target.value})} /></div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className="text-xs font-bold opacity-50 uppercase">Total (BDT)</label><input type="number" className="w-full p-3 rounded-lg border bg-transparent" value={selectedBooking.packageAmount} onChange={e => setSelectedBooking({...selectedBooking, packageAmount: Number(e.target.value)})} /></div>
                                    <div><label className="text-xs font-bold opacity-50 uppercase">Paid (BDT)</label><input type="number" className="w-full p-3 rounded-lg border bg-transparent" value={selectedBooking.advanceAmount} onChange={e => setSelectedBooking({...selectedBooking, advanceAmount: Number(e.target.value)})} /></div>
                                </div>
                             </div>
                          </>
                      ) : (
                          <>
                             {/* VIEW MODE */}
                             <div className="text-center mb-6">
                                 <h3 className="text-2xl font-serif font-bold mb-1">{selectedBooking.clientName}</h3>
                                 <p className="text-indigo-600 font-medium bg-indigo-50 inline-block px-3 py-1 rounded-full text-sm">{selectedBooking.eventTitle}</p>
                             </div>
                             
                             <div className="grid grid-cols-2 gap-4 text-center">
                                 <div className="p-3 bg-gray-50 rounded-xl">
                                     <p className="text-xs text-gray-400 uppercase font-bold">Date</p>
                                     <p className="font-semibold text-gray-800 text-sm">{selectedBooking.startDate}</p>
                                 </div>
                                 <div className="p-3 bg-gray-50 rounded-xl">
                                     <p className="text-xs text-gray-400 uppercase font-bold">Status</p>
                                     <p className={`font-bold text-sm ${selectedBooking.deliveryStatus === DeliveryStatus.DELIVERED ? 'text-green-600' : 'text-amber-600'}`}>{selectedBooking.deliveryStatus}</p>
                                 </div>
                             </div>

                             <div className="border-t border-dashed border-gray-300 my-2"></div>
                             
                             <div className="flex justify-between items-center">
                                 <span className="font-bold opacity-60">Balance Due</span>
                                 <span className="text-xl font-bold">৳{(selectedBooking.packageAmount - selectedBooking.advanceAmount).toLocaleString()}</span>
                             </div>
                          </>
                      )}
                  </div>

                  {/* Modal Footer */}
                  <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                      {isEditing ? (
                          <>
                              <button onClick={() => handleDeleteBooking(selectedBooking)} className="p-3 text-red-500 bg-red-50 rounded-xl"><Trash2 size={20}/></button>
                              <button onClick={() => handleSaveBooking(selectedBooking)} className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg">Save Changes</button>
                          </>
                      ) : (
                          <>
                              <button onClick={() => setIsEditing(true)} className="flex-1 bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-xl">Edit</button>
                              <button onClick={() => generatePDF(selectedBooking)} disabled={isGenerating} className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2">
                                  {isGenerating ? 'Generating...' : <><Download size={18}/> Invoice</>}
                              </button>
                          </>
                      )}
                  </div>
              </div>
          </div>
      )}

      <SettingsModal 
         isOpen={isSettingsOpen} 
         onClose={() => setIsSettingsOpen(false)} 
         settings={settings}
         onSave={(s: AppSettings) => { setSettings(s); saveSettings(s); }}
         onBackup={() => backupToCloud(bookings)}
         isBackingUp={isBackingUp}
      />

    </div>
  );
}
