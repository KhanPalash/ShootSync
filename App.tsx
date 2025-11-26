
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
  LogOut
} from 'lucide-react';
import { Booking, DeliveryStatus, AppSettings, EditingTask, DriveFile, AppTheme, InvoiceTheme } from './types';
import { getBookings, saveBooking, createNewBooking, saveSettings, getSettings } from './services/storageService';
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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// --- TRANSLATIONS ---

const TRANSLATIONS = {
  en: {
    nav_gallery: 'Gallery',
    nav_bookings: 'Bookings',
    nav_calendar: 'Calendar',
    nav_tracking: 'Tracking',
    search_placeholder: 'Search clients, events...',
    app_settings: 'App Settings',
    cloud_backup: 'Cloud Backup',
    app_appearance: 'App Appearance',
    invoice_styling: 'Invoice Styling',
    company_branding: 'Company Branding',
    invoice_logo: 'Invoice Logo',
    save_changes: 'Save Changes',
    language: 'Language',
    tracking_dashboard: 'Tracking Dashboard',
    pending: 'Pending',
    editing: 'Editing',
    delivered: 'Delivered',
    all: 'All'
  },
  bn: {
    nav_gallery: 'গ্যালারি',
    nav_bookings: 'বুকিং',
    nav_calendar: 'ক্যালেন্ডার',
    nav_tracking: 'ট্র্যাকিং',
    search_placeholder: 'ক্লায়েন্ট বা ইভেন্ট খুঁজুন...',
    app_settings: 'অ্যাপ সেটিংস',
    cloud_backup: 'ক্লাউড ব্যাকআপ',
    app_appearance: 'অ্যাপ থিম',
    invoice_styling: 'ইনভয়েস স্টাইল',
    company_branding: 'কোম্পানি ব্র্যান্ডিং',
    invoice_logo: 'ইনভয়েস লোগো',
    save_changes: 'সেভ করুন',
    language: 'ভাষা',
    tracking_dashboard: 'ট্র্যাকিং ড্যাশবোর্ড',
    pending: 'পেন্ডিং',
    editing: 'এডিটিং',
    delivered: 'ডেলিভারড',
    all: 'সব'
  }
};

// --- ICONS ---

const GoogleLogo = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

// --- SUB-COMPONENTS (Pages) ---

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onFinish();
        }, 2500);
        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center text-center p-6 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 animate-pulse"></div>
            
            <div className="relative z-10">
                <div 
                    className="mb-6 opacity-0"
                    style={{ animation: 'fadeInUp 1s ease-out 0.3s forwards' }}
                >
                    <Sparkles className="w-16 h-16 text-amber-500 mx-auto animate-spin-slow" />
                </div>
                
                <h1 
                    className="text-5xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 opacity-0 transform scale-90"
                    style={{ animation: 'zoomIn 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) 0.5s forwards' }}
                >
                    Khan's Creations
                </h1>
                
                <div 
                    className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-6 opacity-0"
                    style={{ animation: 'fadeIn 1s ease-out 1s forwards' }}
                ></div>

                <p 
                    className="text-slate-400 mt-4 text-sm tracking-[0.2em] uppercase opacity-0"
                    style={{ animation: 'fadeInUp 1s ease-out 1.5s forwards' }}
                >
                    Cinematography & Photography
                </p>
            </div>
        </div>
    );
};

const GalleryPage = ({ isConnected, setIsConnected }: { isConnected: boolean, setIsConnected: (v: boolean) => void }) => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<DriveFile[]>([]);
    const [selectedImage, setSelectedImage] = useState<DriveFile | null>(null);

    // Auto-fetch if already connected
    useEffect(() => {
        if (isConnected && images.length === 0) {
            getDemoFolderImages().then(setImages);
        }
    }, [isConnected]);

    const handleLoginSuccess = async () => {
        setIsLoginModalOpen(false);
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
        <div className="p-4 pb-24 h-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <GalleryIcon className="text-rose-500" /> Gallery
                </h2>
                {isConnected && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1 font-bold animate-fadeInUp">
                        <Cloud size={10} /> Drive Connected
                    </span>
                )}
            </div>

            {!isConnected ? (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center animate-pulse">
                        <FolderOpen size={48} className="text-blue-500" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Connect Google Drive</h3>
                        <p className="opacity-60 text-sm mt-2 max-w-xs mx-auto">
                            Access your "Demo" folder to showcase your best wedding shots directly in the app.
                        </p>
                    </div>
                    
                    {/* Google Sign-In Button */}
                    <button 
                        onClick={() => setIsLoginModalOpen(true)}
                        disabled={isLoading}
                        className="bg-white text-gray-600 border border-gray-200 px-6 py-3 rounded-full font-bold shadow-sm hover:shadow-md hover:bg-gray-50 active:scale-95 transition-all flex items-center gap-3"
                    >
                        {isLoading ? <RefreshCw className="animate-spin text-gray-400" /> : <GoogleLogo />}
                        <span className="font-roboto">Sign in with Google</span>
                    </button>
                </div>
            ) : (
                <>
                    <div className="bg-opacity-10 bg-black border border-opacity-10 border-black p-3 rounded-lg mb-6 flex items-center gap-3 animate-[fadeIn_0.5s_ease-out]">
                        <FolderOpen size={20} className="text-yellow-600" />
                        <div>
                            <p className="text-sm font-bold">/ Dulhan Diaries / Demo</p>
                            <p className="text-xs opacity-60">{images.length} items found</p>
                        </div>
                    </div>

                    <div className="columns-2 md:columns-3 gap-6 space-y-6 px-1">
                        {images.map((img, index) => (
                            <div 
                                key={img.id} 
                                onClick={() => setSelectedImage(img)}
                                style={{ 
                                    animation: `fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) backwards`, 
                                    animationDelay: `${index * 100}ms` 
                                }}
                                className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-zoom-in shadow-lg hover:shadow-2xl hover:ring-4 hover:ring-white/40 transition-all duration-500 ease-out transform hover:-translate-y-2 bg-gray-200"
                            >
                                <img 
                                    src={img.thumbnailLink} 
                                    alt={img.name} 
                                    className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out flex flex-col justify-end p-6 backdrop-blur-[1px]">
                                    <p className="text-white text-sm font-bold truncate translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">{img.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Simulated Google Login Modal */}
            {isLoginModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-[120] flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl relative animate-[fadeInUp_0.3s_ease-out]">
                         <button 
                            onClick={() => setIsLoginModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                         >
                             <X size={20} />
                         </button>

                         <div className="text-center mb-6">
                             <div className="inline-block mb-4"><GoogleLogo /></div>
                             <h3 className="text-xl font-bold text-gray-800">Sign in with Google</h3>
                             <p className="text-sm text-gray-500 mt-2">Choose an account to continue to <br/><b>Dulhan Diaries</b></p>
                         </div>

                         <div className="space-y-2">
                             <button 
                                onClick={handleLoginSuccess}
                                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all text-left group"
                             >
                                 <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-lg group-hover:bg-rose-200 transition-colors">
                                     P
                                 </div>
                                 <div className="flex-1 min-w-0">
                                     <p className="font-bold text-gray-800 truncate">Photographer</p>
                                     <p className="text-xs text-gray-500 truncate">photographer@dulhandiaries.com</p>
                                 </div>
                             </button>
                             <div className="border-t border-gray-100 my-2"></div>
                             <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all text-left">
                                 <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                                     <UserPlus size={20} />
                                 </div>
                                 <p className="font-medium text-gray-700 text-sm">Use another account</p>
                             </button>
                         </div>
                         
                         <p className="text-[10px] text-gray-400 text-center mt-6 leading-tight">
                             To continue, Google will share your name, email address, and profile picture with Dulhan Diaries.
                         </p>
                    </div>
                </div>
            )}

            {/* Lightbox Modal */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[100] flex items-center justify-center p-4" 
                    style={{ animation: 'fadeIn 0.4s ease-out' }}
                    onClick={() => setSelectedImage(null)}
                >
                    <button className="absolute top-6 right-6 text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors z-50" onClick={() => setSelectedImage(null)}>
                        <X size={32} />
                    </button>
                    
                    <div className="relative max-w-5xl w-full max-h-screen flex flex-col items-center" onClick={e => e.stopPropagation()}>
                        <img 
                            src={selectedImage.webViewLink} 
                            alt={selectedImage.name} 
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                            style={{ animation: 'zoomIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
                        />
                        <div 
                            className="mt-6 flex items-center justify-center w-full max-w-md px-4"
                            style={{ animation: 'fadeInUp 0.5s ease-out 0.2s backwards' }}
                        >
                            <span className="text-white/90 font-medium tracking-wide text-lg bg-black/50 px-5 py-2 rounded-full backdrop-blur-md border border-white/10">
                                {selectedImage.name}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const CalendarPage = ({ bookings, onSelectBooking }: { bookings: Booking[], onSelectBooking: (b: Booking) => void }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Sunday

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const getEventsForDay = (day: number) => {
    const targetDateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
    const targetDate = new Date(targetDateStr);

    return bookings.filter(b => {
      const start = new Date(b.startDate);
      const end = new Date(b.endDate);
      start.setHours(0,0,0,0);
      end.setHours(0,0,0,0);
      targetDate.setHours(0,0,0,0);
      
      return targetDate >= start && targetDate <= end;
    });
  };

  const renderCalendarDays = () => {
    const days = [];
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50/50 border border-gray-100"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const events = getEventsForDay(d);
      const today = new Date();
      const isToday = isSameDay(new Date(currentDate.getFullYear(), currentDate.getMonth(), d), today);
      const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);

      days.push(
        <div key={d} className={`h-24 border border-gray-100 p-1 relative overflow-hidden bg-white ${isToday ? 'bg-rose-50' : ''}`}>
          <span className={`text-xs font-bold ${isToday ? 'text-rose-600' : 'text-gray-400'} block mb-1`}>{d}</span>
          <div className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100%-20px)] no-scrollbar">
            {events.map(ev => {
              const isStart = ev.startDate === dateObj.toISOString().split('T')[0];
              const isDelivered = ev.deliveryStatus === DeliveryStatus.DELIVERED;
              
              return (
                <button 
                  key={ev.id}
                  onClick={(e) => { e.stopPropagation(); onSelectBooking(ev); }}
                  className={`text-[10px] px-1 py-0.5 rounded truncate text-left w-full shadow-sm ${
                    isDelivered ? 'bg-green-100 text-green-800' : 
                    isStart ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-800'
                  }`}
                >
                  {isStart ? ev.clientName : '•'}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="p-4 pb-24 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeft size={20}/></button>
          <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100"><ChevronRight size={20}/></button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 text-center mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-xs font-bold opacity-50 uppercase">{day}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 flex-1 auto-rows-fr rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

const TrackingPage = ({ 
  bookings, 
  onUpdate, 
  onDeliver,
  title
}: { 
  bookings: Booking[], 
  onUpdate: (b: Booking) => void,
  onDeliver: (b: Booking) => void,
  title: string
}) => {
  
  const sortedBookings = [...bookings].sort((a, b) => {
      const today = new Date().getTime();
      const getScore = (bk: Booking) => {
          const start = new Date(bk.startDate).getTime();
          const daysUntilStart = Math.ceil((start - today) / (1000 * 60 * 60 * 24));
          const balance = bk.packageAmount - bk.advanceAmount;
          const lastPay = bk.lastPaymentDate ? new Date(bk.lastPaymentDate).getTime() : bk.createdAt;
          const daysSincePay = Math.floor((today - lastPay) / (1000 * 60 * 60 * 24));
          const shootDate = bk.shootDoneDate ? new Date(bk.shootDoneDate).getTime() : 0;
          const daysSinceShoot = shootDate ? Math.floor((today - shootDate)/(1000*60*60*24)) : 0;

          if (bk.editingProgress === 100 && bk.deliveryStatus !== DeliveryStatus.DELIVERED) return 20;
          if (bk.shootDoneDate && daysSinceShoot > 2 && bk.editingProgress < 100 && bk.deliveryStatus !== DeliveryStatus.DELIVERED) return 15;
          if (daysUntilStart >= 0 && daysUntilStart <= 2 && bk.deliveryStatus !== DeliveryStatus.DELIVERED) return 10;
          if (bk.deliveryStatus === DeliveryStatus.DELIVERED && balance > 0 && daysSincePay >= 3) return 8;
          if (bk.shootDoneDate && bk.editingProgress < 100) return 5;
          return 1;
      };
      const scoreA = getScore(a);
      const scoreB = getScore(b);
      if (scoreA !== scoreB) return scoreB - scoreA;
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  const stats = [
    { name: 'Pending', value: bookings.filter(b => b.deliveryStatus === DeliveryStatus.PENDING).length, color: '#94a3b8' },
    { name: 'In Prog', value: bookings.filter(b => b.deliveryStatus === DeliveryStatus.IN_PROGRESS).length, color: '#6366f1' },
    { name: 'Done', value: bookings.filter(b => b.deliveryStatus === DeliveryStatus.DELIVERED).length, color: '#22c55e' },
  ];

  const handleTaskToggle = (booking: Booking, taskId: string) => {
    const currentTasks = booking.editingTasks || [
        { id: '1', label: 'Data Backup & Culling', isCompleted: false },
        { id: '2', label: 'Color Correction', isCompleted: false },
        { id: '3', label: 'Skin Retouching', isCompleted: false },
        { id: '4', label: 'Cinematic Grading', isCompleted: false },
        { id: '5', label: 'Video Editing / Highlight', isCompleted: false },
        { id: '6', label: 'Final Export & Upload', isCompleted: false }
    ];

    const updatedTasks = currentTasks.map(t => 
        t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
    );

    const completedCount = updatedTasks.filter(t => t.isCompleted).length;
    const newProgress = Math.round((completedCount / updatedTasks.length) * 100);

    const newStatus = newProgress > 0 && newProgress < 100 
        ? DeliveryStatus.IN_PROGRESS 
        : (newProgress === 100 && booking.deliveryStatus !== DeliveryStatus.DELIVERED ? DeliveryStatus.IN_PROGRESS : booking.deliveryStatus);

    onUpdate({
        ...booking,
        editingTasks: updatedTasks,
        editingProgress: newProgress,
        deliveryStatus: newStatus
    });
  };

  return (
    <div className="p-4 pb-24">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      
      <div className="h-48 w-full bg-white rounded-xl shadow-sm p-2 mb-6 border border-gray-100">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats}>
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip cursor={{fill: 'transparent'}} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {stats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        {sortedBookings.map(booking => {
          const isReadyToDeliver = booking.editingProgress === 100 && booking.deliveryStatus !== DeliveryStatus.DELIVERED;
          const shootDate = booking.shootDoneDate ? new Date(booking.shootDoneDate).getTime() : 0;
          const daysSinceShoot = shootDate ? Math.floor((new Date().getTime() - shootDate)/(1000*60*60*24)) : 0;
          const isStalledEditing = booking.shootDoneDate && daysSinceShoot > 2 && booking.editingProgress < 100 && booking.deliveryStatus !== DeliveryStatus.DELIVERED;
          
          const displayTasks = booking.editingTasks || [
            { id: '1', label: 'Data Backup & Culling', isCompleted: false },
            { id: '2', label: 'Color Correction', isCompleted: false },
            { id: '3', label: 'Skin Retouching', isCompleted: false },
            { id: '4', label: 'Cinematic Grading', isCompleted: false },
            { id: '5', label: 'Video Editing / Highlight', isCompleted: false },
            { id: '6', label: 'Final Export & Upload', isCompleted: false }
          ];

          return (
            <div key={booking.id} className={`bg-white p-4 rounded-xl shadow-sm border ${isReadyToDeliver ? 'border-amber-300 ring-2 ring-amber-50' : 'border-gray-100'}`}>
              
              {isReadyToDeliver && (
                 <div className="mb-2 bg-amber-50 text-amber-700 px-3 py-1 rounded text-xs font-bold flex items-center gap-2">
                    <PackageCheck size={14}/> ACTION: DELIVER WORK
                 </div>
              )}
              {isStalledEditing && (
                 <div className="mb-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded text-xs font-bold flex items-center gap-2">
                    <Briefcase size={14}/> ACTION: FINISH EDITING ({daysSinceShoot} days ago)
                 </div>
              )}

              <div className="flex justify-between mb-2">
                <h4 className="font-bold text-lg text-black">{booking.clientName}</h4>
                <span className="text-xs text-gray-400">{booking.eventTitle}</span>
              </div>
              
              {booking.shootDoneDate ? (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-2 text-gray-600 font-bold">
                      <span>Editing Checklist</span>
                      <span className={isReadyToDeliver ? 'text-amber-600' : 'text-indigo-600'}>{booking.editingProgress}%</span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2 p-1">
                        {displayTasks.map(task => (
                            <button 
                                key={task.id}
                                onClick={() => booking.deliveryStatus !== DeliveryStatus.DELIVERED && handleTaskToggle(booking, task.id)}
                                disabled={booking.deliveryStatus === DeliveryStatus.DELIVERED}
                                className={`flex items-center text-sm p-3 rounded-lg border transition-all text-left ${
                                    task.isCompleted 
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-slate-50'
                                }`}
                            >
                                {task.isCompleted ? (
                                    <CheckCircle2 size={18} className="text-emerald-600 mr-3 flex-shrink-0" />
                                ) : (
                                    <Circle size={18} className="text-gray-300 mr-3 flex-shrink-0" />
                                )}
                                <span className={task.isCompleted ? 'line-through opacity-60 font-medium' : 'font-medium'}>{task.label}</span>
                            </button>
                        ))}
                    </div>
                  </div>
              ) : (
                  <div className="mb-4 p-4 bg-gray-50 rounded text-center text-xs text-gray-400 italic border border-dashed border-gray-200">
                      Mark shoot done to unlock the editing checklist
                  </div>
              )}

              <div className="flex items-center gap-2 mt-2">
                {booking.editingProgress < 100 && (
                  <button 
                    onClick={() => onUpdate({...booking, shootDoneDate: booking.shootDoneDate ? undefined : new Date().toISOString()})}
                    className={`flex-1 py-2 text-xs font-bold rounded ${booking.shootDoneDate ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {booking.shootDoneDate ? 'Shoot Done' : 'Mark Shoot Done'}
                  </button>
                )}
                
                {isReadyToDeliver && (
                  <button 
                    onClick={() => onDeliver(booking)}
                    className="flex-1 py-2 text-xs font-bold rounded bg-amber-500 text-white animate-pulse shadow-md flex items-center justify-center gap-1"
                  >
                    <PackageCheck size={14}/> Deliver
                  </button>
                )}
                
                {booking.deliveryStatus === DeliveryStatus.DELIVERED && (
                  <div className="flex-1 py-2 text-xs font-bold rounded bg-green-600 text-white text-center">
                    Delivered
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- SETTINGS MODAL ---

const SettingsModal = ({ 
    isOpen, 
    onClose, 
    settings, 
    onSave,
    isBackingUp,
    onBackup,
    t
}: { 
    isOpen: boolean, 
    onClose: () => void, 
    settings: AppSettings, 
    onSave: (s: AppSettings) => void,
    isBackingUp: boolean,
    onBackup: () => void,
    t: (key: keyof typeof TRANSLATIONS['en']) => string
}) => {
    const [localSettings, setLocalSettings] = useState(settings);

    useEffect(() => { setLocalSettings(settings); }, [settings]);

    if (!isOpen) return null;

    const themes: { id: AppTheme; name: string; color: string }[] = [
        { id: 'light', name: 'Classic Light', color: 'bg-white border-gray-200 text-gray-800' },
        { id: 'dark', name: 'Modern Dark', color: 'bg-slate-800 border-slate-700 text-white' },
        { id: 'floral', name: 'Wedding Floral', color: 'bg-rose-50 border-rose-200 text-rose-900' },
        { id: 'luxury', name: 'Luxury Gold', color: 'bg-stone-900 border-yellow-700 text-yellow-100' },
        { id: 'ocean', name: 'Ocean Blue', color: 'bg-cyan-50 border-cyan-200 text-cyan-900' },
    ];

    const invoiceThemes: { id: InvoiceTheme; name: string }[] = [
      { id: 'classic', name: 'Classic Professional' },
      { id: 'modern', name: 'Modern Bold' },
      { id: 'elegant', name: 'Elegant Serif' },
      { id: 'minimal', name: 'Minimalist' },
      { id: 'floral', name: 'Floral Decorative' }
    ];

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLocalSettings(prev => ({ ...prev, logoUrl: reader.result as string, logoType: 'image' }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-end sm:items-center justify-center p-4 no-print">
            <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto bg-white text-slate-900`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Settings size={20} /> {t('app_settings')}
                    </h2>
                    <button onClick={onClose}><X size={20} /></button>
                </div>

                {/* Language Section */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold uppercase text-gray-500 mb-3 flex items-center gap-2">
                        <Globe size={16} /> {t('language')} / ভাষা
                    </h3>
                    <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                        <button 
                            onClick={() => setLocalSettings(s => ({...s, language: 'en'}))}
                            className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${localSettings.language === 'en' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
                        >
                            English
                        </button>
                        <button 
                            onClick={() => setLocalSettings(s => ({...s, language: 'bn'}))}
                            className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${localSettings.language === 'bn' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
                        >
                            বাংলা
                        </button>
                    </div>
                </div>

                {/* Cloud Backup Section */}
                <div className="mb-8 bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex justify-between items-center mb-2">
                         <h3 className="text-sm font-bold uppercase text-blue-700 flex items-center gap-2">
                            <Cloud size={16}/> {t('cloud_backup')}
                         </h3>
                         <div 
                           onClick={() => setLocalSettings(s => ({...s, enableCloudBackup: !s.enableCloudBackup}))}
                           className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${localSettings.enableCloudBackup ? 'bg-blue-600' : 'bg-gray-300'}`}
                         >
                            <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${localSettings.enableCloudBackup ? 'left-6' : 'left-1'}`}></div>
                         </div>
                    </div>
                    <p className="text-xs text-blue-600/80 mb-3">Sync bookings to Google Drive automatically.</p>
                    
                    {localSettings.enableCloudBackup && (
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                                Last backup: {settings.lastBackupDate ? new Date(settings.lastBackupDate).toLocaleTimeString() : 'Never'}
                            </span>
                            <button 
                                onClick={() => { onSave(localSettings); onBackup(); }}
                                disabled={isBackingUp}
                                className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 disabled:opacity-50"
                            >
                                {isBackingUp ? <RefreshCw size={12} className="animate-spin"/> : <Cloud size={12}/>} 
                                {isBackingUp ? 'Syncing...' : 'Backup Now'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Theme Section */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold uppercase text-gray-500 mb-3 flex items-center gap-2">
                        <Palette size={16} /> {t('app_appearance')}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        {themes.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setLocalSettings(s => ({ ...s, theme: t.id }))}
                                className={`flex items-center justify-center p-3 rounded-xl border text-sm font-bold ${t.color} ${localSettings.theme === t.id ? 'ring-2 ring-offset-1 ring-indigo-500' : ''}`}
                            >
                                {t.name}
                            </button>
                        ))}
                    </div>
                </div>

                 {/* Invoice Theme Section */}
                 <div className="mb-8">
                    <h3 className="text-sm font-bold uppercase text-gray-500 mb-3 flex items-center gap-2">
                        <FileText size={16} /> {t('invoice_styling')}
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                        {invoiceThemes.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setLocalSettings(s => ({ ...s, invoiceTheme: t.id }))}
                                className={`flex items-center justify-between p-3 rounded-xl border bg-gray-50 text-gray-800 ${localSettings.invoiceTheme === t.id ? 'ring-2 ring-indigo-500 border-indigo-200 bg-indigo-50' : 'border-gray-200'}`}
                            >
                                <span className="font-medium text-sm">{t.name}</span>
                                {localSettings.invoiceTheme === t.id && <Check size={16} className="text-indigo-600" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Company Details */}
                <div className="mb-8">
                  <h3 className="text-sm font-bold uppercase text-gray-500 mb-3">{t('company_branding')}</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Company Name</label>
                      <input 
                        type="text" 
                        value={localSettings.companyName}
                        onChange={(e) => setLocalSettings(s => ({...s, companyName: e.target.value}))}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm font-semibold"
                        placeholder="Dulhan Diaries"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Tagline</label>
                      <input 
                        type="text" 
                        value={localSettings.companyTagline}
                        onChange={(e) => setLocalSettings(s => ({...s, companyTagline: e.target.value}))}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Cinematography & Photography"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Contact Info</label>
                      <input 
                        type="text" 
                        value={localSettings.companyContact}
                        onChange={(e) => setLocalSettings(s => ({...s, companyContact: e.target.value}))}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Contact: +880 1700-000000"
                      />
                    </div>
                  </div>
                </div>

                {/* Logo Section */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold uppercase text-gray-500 mb-3">{t('invoice_logo')}</h3>
                    <div className="space-y-3">
                        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                            <button 
                                onClick={() => setLocalSettings(s => ({...s, logoType: 'text'}))}
                                className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${localSettings.logoType === 'text' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
                            >
                                Text Logo
                            </button>
                            <button 
                                onClick={() => setLocalSettings(s => ({...s, logoType: 'image'}))}
                                className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${localSettings.logoType === 'image' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
                            >
                                Image Logo
                            </button>
                        </div>

                        {localSettings.logoType === 'image' && (
                            <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors relative">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleLogoUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                {localSettings.logoUrl ? (
                                    <img src={localSettings.logoUrl} alt="Logo" className="h-16 mx-auto object-contain" />
                                ) : (
                                    <div className="text-gray-400">
                                        <GalleryIcon className="mx-auto mb-2" />
                                        <p className="text-xs">Tap to upload PNG</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {localSettings.logoType === 'text' && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center border border-gray-200">
                             <p className="text-xl font-bold uppercase text-rose-900">{localSettings.companyName}</p>
                             <p className="text-xs text-gray-500 mt-1">Preview of text logo using Company Name</p>
                          </div>
                        )}
                    </div>
                </div>

                <button 
                    onClick={() => { onSave(localSettings); onClose(); }}
                    className="w-full bg-black text-white py-3 rounded-xl font-bold shadow-lg active:scale-95 transition"
                >
                    {t('save_changes')}
                </button>
            </div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookings' | 'calendar' | 'tracking' | 'gallery'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'EDITING' | 'DELIVERED'>('ALL');
  
  // Settings
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);

  // Google Drive State (Lifted)
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);

  // Modals
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [aiPromptOpen, setAiPromptOpen] = useState(false);
  
  // Payment Collection
  const [paymentBooking, setPaymentBooking] = useState<Booking | null>(null);
  const [collectedAmount, setCollectedAmount] = useState<number | ''>('');
  const [deliveryLinkInput, setDeliveryLinkInput] = useState('');

  // Post Save Actions (Success Modal)
  const [showPostSaveModal, setShowPostSaveModal] = useState(false);

  // Invoice Generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [printingBooking, setPrintingBooking] = useState<Booking | null>(null);

  // AI
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBookings(getBookings());
    setSettings(getSettings());
  }, []);

  // Sync document title with Company Name
  useEffect(() => {
    document.title = settings.companyName || 'Dulhan Diaries';
  }, [settings.companyName]);

  const t = (key: keyof typeof TRANSLATIONS['en']) => {
    const lang = settings.language || 'en';
    return TRANSLATIONS[lang][key] || key;
  };

  const triggerBackup = async (currentBookings: Booking[]) => {
      if (!settings.enableCloudBackup) return;
      
      setIsBackingUp(true);
      try {
          const result = await backupToCloud(currentBookings);
          if (result.success) {
              const updatedSettings = { ...settings, lastBackupDate: result.timestamp };
              setSettings(updatedSettings);
              saveSettings(updatedSettings);
          }
      } catch (e) {
          console.error("Backup failed", e);
      } finally {
          setIsBackingUp(false);
      }
  };

  const handleLogout = () => {
    setIsGoogleConnected(false);
    setIsSidebarOpen(false);
    // Optionally disable backup if user logs out
    if (settings.enableCloudBackup) {
        const newSettings = { ...settings, enableCloudBackup: false };
        setSettings(newSettings);
        saveSettings(newSettings);
        alert("Google Drive disconnected. Cloud backup disabled.");
    } else {
        alert("Google Drive disconnected.");
    }
  };

  const getThemeClasses = () => {
      switch (settings.theme) {
          case 'dark':
              return {
                  bg: 'bg-slate-900',
                  text: 'text-slate-100',
                  card: 'bg-slate-800 border-slate-700',
                  header: 'bg-slate-800 text-slate-100',
                  accent: 'text-rose-400',
                  button: 'bg-indigo-600',
                  input: 'bg-slate-700 border-slate-600 text-white'
              };
          case 'floral':
              return {
                  bg: 'bg-[#fff5f5]', // Very light pink
                  text: 'text-gray-900',
                  card: 'bg-white/80 border-rose-100 backdrop-blur-sm',
                  header: 'bg-white/90 text-rose-900',
                  accent: 'text-rose-600',
                  button: 'bg-rose-600',
                  input: 'bg-white border-rose-200 text-gray-800'
              };
          case 'luxury':
              return {
                  bg: 'bg-stone-900',
                  text: 'text-amber-50',
                  card: 'bg-stone-800 border-yellow-800',
                  header: 'bg-stone-800 text-amber-100',
                  accent: 'text-amber-500',
                  button: 'bg-yellow-700 text-stone-900',
                  input: 'bg-stone-800 border-stone-600 text-amber-50'
              };
          case 'ocean':
              return {
                  bg: 'bg-cyan-50',
                  text: 'text-cyan-900',
                  card: 'bg-white border-cyan-100',
                  header: 'bg-white text-cyan-900',
                  accent: 'text-cyan-600',
                  button: 'bg-cyan-600',
                  input: 'bg-white border-cyan-200 text-cyan-900'
              };
          default: // Light
              return {
                  bg: 'bg-slate-50',
                  text: 'text-slate-900',
                  card: 'bg-white border-gray-100',
                  header: 'bg-white text-slate-900',
                  accent: 'text-rose-600',
                  button: 'bg-indigo-600',
                  input: 'bg-white border-gray-200 text-gray-800'
              };
      }
  };

  const theme = getThemeClasses();

  const handleSaveSettings = (newSettings: AppSettings) => {
      saveSettings(newSettings);
      setSettings(newSettings);
  };

  const handleSaveBooking = (booking: Booking) => {
    if (new Date(booking.endDate) < new Date(booking.startDate)) {
      booking.endDate = booking.startDate;
    }

    saveBooking(booking);
    const updatedList = getBookings();
    setBookings(updatedList);
    
    // Trigger backup if enabled
    if (settings.enableCloudBackup) {
        triggerBackup(updatedList);
    }
    
    setSelectedBooking(booking); 
    setIsEditing(false);
    setShowPostSaveModal(true);
  };

  const handleUpdateFromTracking = (booking: Booking) => {
     saveBooking(booking);
     const updatedList = getBookings();
     setBookings(updatedList);
     if (settings.enableCloudBackup) triggerBackup(updatedList);
  };

  const initiateDelivery = (booking: Booking) => {
    const balance = booking.packageAmount - booking.advanceAmount;
    setPaymentBooking(booking);
    setCollectedAmount(balance > 0 ? balance : 0);
    setDeliveryLinkInput(booking.deliveryLink || '');
  };

  const completeDeliveryAndPayment = () => {
    if (!paymentBooking) return;
    
    const amountToAdd = typeof collectedAmount === 'number' ? collectedAmount : 0;
    
    const updatedBooking = {
      ...paymentBooking,
      deliveryStatus: DeliveryStatus.DELIVERED,
      advanceAmount: paymentBooking.advanceAmount + amountToAdd, // Update total paid
      deliveryLink: deliveryLinkInput,
      lastPaymentDate: amountToAdd > 0 ? new Date().toISOString() : paymentBooking.lastPaymentDate,
      deliveredItems: [...(paymentBooking.deliveredItems || []), `Delivered on ${new Date().toLocaleDateString('en-GB')}`]
    };

    saveBooking(updatedBooking);
    const updatedList = getBookings();
    setBookings(updatedList);
    if (settings.enableCloudBackup) triggerBackup(updatedList);
    
    setPaymentBooking(null);
    setCollectedAmount('');
    setDeliveryLinkInput('');
    
    setSelectedBooking(updatedBooking);
    setIsEditing(false);
  };

  const handleAICommand = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    const newBooking = await parseBookingCommand(aiInput);
    setAiLoading(false);
    setAiPromptOpen(false);
    setAiInput('');
    
    if (newBooking) {
      // 1. Auto-save
      saveBooking(newBooking);
      setBookings(getBookings());
      
      // 2. Set context
      setSelectedBooking(newBooking);
      
      // 3. Show success/action modal (which allows downloading)
      setShowPostSaveModal(true);
      
      // 4. Trigger invoice generation immediately (Auto-Generate)
      handleGenerateInvoice(newBooking);
    } else {
      alert("Could not understand command. Try: 'Booking for Raj Wedding on 2025-01-01 50000'");
    }
  };

  const handleGenerateInvoice = async (bookingOverride?: Booking) => {
    const targetBooking = bookingOverride || selectedBooking;
    if (!targetBooking) return;
    
    setPrintingBooking(targetBooking);
    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!invoiceRef.current) {
        console.error("Invoice element not found. Generation failed.");
        setIsGenerating(false);
        setPrintingBooking(null);
        return;
    }

    try {
      const element = invoiceRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      const safeName = targetBooking.clientName.replace(/\s+/g, '_');
      const prefix = "ShootSync"; // Organize downloads by prefix since we can't force folders
      
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `${prefix}_${safeName}_Invoice.jpg`;
      link.click();

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${prefix}_${safeName}_Invoice.pdf`);

    } catch (err) {
      console.error("Invoice generation failed", err);
      alert("Failed to generate invoice files.");
    } finally {
      setIsGenerating(false);
      setPrintingBooking(null);
    }
  };

  const handleWhatsAppShare = async () => {
      if (!selectedBooking) return;
      await handleGenerateInvoice(selectedBooking);
      const phone = selectedBooking.clientPhone ? selectedBooking.clientPhone.replace(/\D/g, '') : '';
      const text = `Hello ${selectedBooking.clientName},%0a%0aThank you for booking with ${settings.companyName}!%0a%0a📅 *Event:* ${selectedBooking.eventTitle}%0a📍 *Venue:* ${selectedBooking.venue}%0a💰 *Balance Due:* ৳${(selectedBooking.packageAmount - selectedBooking.advanceAmount).toLocaleString('en-BD')}%0a%0aPlease find your invoice attached below.%0a%0aBest regards,%0a${settings.companyName}`;
      const url = phone 
        ? `https://wa.me/${phone}?text=${text}`
        : `https://wa.me/?text=${text}`;
      window.open(url, '_blank');
      setShowPostSaveModal(false);
      setSelectedBooking(null);
  };

  const downloadVCard = (booking: Booking) => {
    if (!booking.clientPhone) return;
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${booking.clientName}
TEL;TYPE=CELL:${booking.clientPhone}
NOTE:${settings.companyName} Client - ${booking.eventTitle}
END:VCARD`;
    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ShootSync_${booking.clientName.replace(/\s+/g, '_')}.vcf`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const importContactFromDevice = async () => {
    const nav = navigator as any;
    let isIframe = false;
    try { isIframe = window.self !== window.top; } catch (e) { isIframe = true; }

    if (isIframe) {
        alert("Contact Picker API requires a top-level window. Filling mock data.");
        if (selectedBooking) {
            setSelectedBooking({
                ...selectedBooking,
                clientName: "Rahim Islam",
                clientPhone: "+880 1711-223344"
            });
        }
        return;
    }
    
    if ('contacts' in nav && 'select' in nav.contacts) {
      try {
        const contacts = await nav.contacts.select(['name', 'tel'], { multiple: false });
        if (contacts && contacts.length > 0) {
          const contact = contacts[0];
          const name = contact.name?.[0] || '';
          const phone = contact.tel?.[0] || '';
          if (selectedBooking) {
            setSelectedBooking({
              ...selectedBooking,
              clientName: name || selectedBooking.clientName,
              clientPhone: phone || selectedBooking.clientPhone
            });
          }
        }
      } catch (ex) { console.error("Contact selection failed", ex); }
    } else {
      alert("Contact picker is not supported on this device.");
    }
  };

  const filteredBookings = bookings.filter(b => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (b.clientName?.toLowerCase().includes(term) || false) || 
      (b.eventTitle?.toLowerCase().includes(term) || false) ||
      (b.venue?.toLowerCase().includes(term) || false);

    if (!matchesSearch) return false;
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'DELIVERED') return b.deliveryStatus === DeliveryStatus.DELIVERED;
    if (filterStatus === 'EDITING') return b.editingProgress > 0 && b.deliveryStatus !== DeliveryStatus.DELIVERED;
    if (filterStatus === 'PENDING') return b.editingProgress === 0 && b.deliveryStatus !== DeliveryStatus.DELIVERED;
    return true;
  });

  const renderPaymentModal = () => {
    if (!paymentBooking) return null;
    const balance = paymentBooking.packageAmount - paymentBooking.advanceAmount;

    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 no-print">
        <div className={`rounded-2xl w-full max-w-sm p-6 shadow-2xl ${theme.bg} ${theme.text} ${theme.card}`}>
          <h3 className="text-xl font-bold mb-2">Delivery & Payment</h3>
          <p className="opacity-70 mb-4 text-sm">Confirming delivery for <b>{paymentBooking.clientName}</b>.</p>
          
          <div className={`${settings.theme === 'luxury' ? 'bg-stone-800' : 'bg-gray-100/50'} p-4 rounded-xl mb-4 border ${settings.theme === 'luxury' ? 'border-stone-700' : 'border-gray-200'}`}>
             <div className="flex justify-between text-sm opacity-70 mb-1">
               <span>Total Package</span>
               <span>{paymentBooking.packageAmount.toLocaleString('en-BD')}</span>
             </div>
             <div className="flex justify-between text-sm text-green-600 mb-2">
               <span>Already Paid</span>
               <span>{paymentBooking.advanceAmount.toLocaleString('en-BD')}</span>
             </div>
             <div className="flex justify-between font-bold text-lg border-t pt-2 border-gray-300/20">
               <span>Balance Due</span>
               <span>{balance.toLocaleString('en-BD')}</span>
             </div>
          </div>

          <label className="block text-xs font-bold opacity-60 uppercase mb-1">Payment Collected Now</label>
          <div className={`flex items-center border rounded-lg px-3 py-2 mb-4 focus-within:ring-2 ring-indigo-500 ${settings.theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-300'}`}>
            <span className="opacity-50 mr-2 font-bold">৳</span>
            <input 
              type="number" 
              className="flex-1 outline-none font-bold text-lg bg-transparent"
              value={collectedAmount}
              onChange={(e) => setCollectedAmount(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>

          <label className="block text-xs font-bold opacity-60 uppercase mb-1">Drive/Cloud Link (Optional)</label>
          <div className={`flex items-center border rounded-lg px-3 py-2 mb-6 focus-within:ring-2 ring-indigo-500 ${settings.theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-300'}`}>
            <LinkIcon size={16} className="opacity-40 mr-2"/>
            <input 
              type="url" 
              placeholder="https://drive.google.com/..."
              className="flex-1 outline-none text-sm bg-transparent"
              value={deliveryLinkInput}
              onChange={(e) => setDeliveryLinkInput(e.target.value)}
            />
          </div>

          <button 
            onClick={completeDeliveryAndPayment}
            className={`w-full text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition ${theme.button}`}
          >
            <CreditCard size={18} /> Confirm & Generate Invoice
          </button>
          <button 
            onClick={() => setPaymentBooking(null)}
            className="w-full opacity-60 py-3 mt-2 font-medium hover:opacity-100"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const renderPostSaveActions = () => {
    if (!showPostSaveModal || !selectedBooking) return null;
    return (
      <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 no-print">
        <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center text-slate-900">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Check size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Booking Saved!</h3>
            <p className="text-gray-600 mb-6 text-sm">
                Next steps for <b>{selectedBooking.clientName}</b>
            </p>
            
            <div className="space-y-3">
                 {selectedBooking.clientPhone && (
                      <button 
                      onClick={() => { downloadVCard(selectedBooking); }}
                      className="w-full bg-indigo-50 text-indigo-700 border border-indigo-100 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                      >
                      <UserPlus size={20} /> Add to Device Contacts
                      </button>
                   )}

                 <button 
                  onClick={handleWhatsAppShare}
                  className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} fill="white" /> Send WhatsApp Confirmation
                </button>
                
                <button 
                    onClick={() => {
                        handleGenerateInvoice(selectedBooking);
                        setShowPostSaveModal(false);
                        setSelectedBooking(null);
                    }}
                    className="w-full border border-gray-200 py-3 rounded-xl font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                  >
                    <Download size={20} /> Download Invoice PDF
                  </button>
            </div>
             <button 
                  onClick={() => { setShowPostSaveModal(false); setSelectedBooking(null); }}
                  className="mt-4 text-gray-400 text-sm hover:text-gray-600"
                >
                  Dismiss
            </button>
        </div>
      </div>
    );
  };

  const renderBookingModal = () => {
    if (!selectedBooking) return null;
    const isHidden = showPostSaveModal;
    
    const handleChange = (field: keyof Booking, value: any) => {
      setSelectedBooking(prev => prev ? ({ ...prev, [field]: value }) : null);
    };

    const formatToDDMMYYYY = (isoDate: string) => {
        if (!isoDate) return '';
        const parts = isoDate.split('-'); // YYYY-MM-DD
        if (parts.length !== 3) return isoDate;
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    };

    const formatDateDisplay = (start: string, end: string) => {
        const s = formatToDDMMYYYY(start);
        const e = formatToDDMMYYYY(end);
        if (start === end) return s;
        return `${s} to ${e}`;
    };

    return (
      <div className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 no-print ${isHidden ? 'invisible' : ''}`}>
        <div className={`rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col ${theme.bg} ${theme.text}`}>
          <div className={`p-4 border-b flex justify-between items-center sticky top-0 z-10 ${theme.header} border-gray-200/20`}>
            <h2 className="text-xl font-bold">{isEditing ? 'Edit Booking' : 'Booking Details'}</h2>
            <button onClick={() => { setSelectedBooking(null); setIsEditing(false); }}><X /></button>
          </div>
          
          <div className="p-6 space-y-4">
            {isEditing ? (
              <>
                 <div>
                   <label className="block text-xs font-bold opacity-60 uppercase">Client Name</label>
                   <div className="flex gap-2 mt-1">
                       <input 
                         className={`w-full p-2 border rounded ${theme.input}`} 
                         value={selectedBooking.clientName} 
                         onChange={e => handleChange('clientName', e.target.value)} 
                         placeholder="Enter Name"
                       />
                       <button 
                         onClick={importContactFromDevice}
                         className="bg-indigo-100 text-indigo-700 px-3 rounded border border-indigo-200 hover:bg-indigo-200"
                         title="Import from Device Contacts"
                       >
                           <UserRoundSearch size={20} />
                       </button>
                   </div>
                 </div>
                 
                 <div className="flex items-end gap-3">
                    <div className="flex-1">
                        <label className="block text-xs font-bold opacity-60 uppercase">Groom Name</label>
                        <input className={`w-full p-2 border rounded mt-1 ${theme.input}`} value={selectedBooking.groomName} onChange={e => handleChange('groomName', e.target.value)} />
                    </div>
                    <div className="pb-2 text-rose-400 font-serif italic text-lg font-bold">Weds</div>
                    <div className="flex-1">
                        <label className="block text-xs font-bold opacity-60 uppercase">Bride Name</label>
                        <input className={`w-full p-2 border rounded mt-1 ${theme.input}`} value={selectedBooking.brideName} onChange={e => handleChange('brideName', e.target.value)} />
                    </div>
                 </div>

                 <div>
                   <label className="block text-xs font-bold opacity-60 uppercase">Phone Number</label>
                   <input className={`w-full p-2 border rounded mt-1 ${theme.input}`} type="tel" placeholder="+880 17..." value={selectedBooking.clientPhone} onChange={e => handleChange('clientPhone', e.target.value)} />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-bold opacity-60 uppercase">Start Date</label>
                     <input type="date" className={`w-full p-2 border rounded mt-1 ${theme.input}`} value={selectedBooking.startDate} onChange={e => handleChange('startDate', e.target.value)} />
                   </div>
                   <div>
                     <label className="block text-xs font-bold opacity-60 uppercase">End Date</label>
                     <input type="date" className={`w-full p-2 border rounded mt-1 ${theme.input}`} value={selectedBooking.endDate} onChange={e => handleChange('endDate', e.target.value)} />
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-bold opacity-60 uppercase">Amount (BDT)</label>
                     <div className={`flex items-center border rounded mt-1 overflow-hidden ${settings.theme === 'dark' ? 'border-slate-600 bg-slate-700' : 'border-gray-300 bg-white'}`}>
                        <span className="pl-2 opacity-50 text-sm">৳</span>
                        <input type="number" className={`w-full p-2 outline-none bg-transparent ${theme.text}`} value={selectedBooking.packageAmount} onChange={e => handleChange('packageAmount', Number(e.target.value))} />
                     </div>
                   </div>
                   <div>
                     <label className="block text-xs font-bold opacity-60 uppercase">Advance Paid (BDT)</label>
                     <div className={`flex items-center border rounded mt-1 overflow-hidden ${settings.theme === 'dark' ? 'border-slate-600 bg-slate-700' : 'border-gray-300 bg-white'}`}>
                        <span className="pl-2 opacity-50 text-sm">৳</span>
                        <input type="number" className={`w-full p-2 outline-none bg-transparent ${theme.text}`} value={selectedBooking.advanceAmount} onChange={e => handleChange('advanceAmount', Number(e.target.value))} />
                     </div>
                   </div>
                 </div>

                 <div>
                   <label className="block text-xs font-bold opacity-60 uppercase">Event Type</label>
                   <input type="text" className={`w-full p-2 border rounded mt-1 ${theme.input}`} value={selectedBooking.eventTitle} onChange={e => handleChange('eventTitle', e.target.value)} />
                 </div>
                 <div>
                   <label className="block text-xs font-bold opacity-60 uppercase">Venue</label>
                   <input className={`w-full p-2 border rounded mt-1 ${theme.input}`} value={selectedBooking.venue} onChange={e => handleChange('venue', e.target.value)} />
                 </div>
                 <div>
                   <label className="block text-xs font-bold opacity-60 uppercase">Notes</label>
                   <textarea className={`w-full p-2 border rounded mt-1 ${theme.input}`} rows={3} value={selectedBooking.notes} onChange={e => handleChange('notes', e.target.value)} />
                 </div>
              </>
            ) : (
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <div>
                        <span className="text-2xl font-bold block">{selectedBooking.clientName}</span>
                        {selectedBooking.clientPhone && (
                            <div className="flex items-center gap-2 mt-1">
                                <a href={`tel:${selectedBooking.clientPhone}`} className="text-indigo-600 font-medium text-sm flex items-center gap-1 hover:underline">
                                    <Phone size={14}/> {selectedBooking.clientPhone}
                                </a>
                                <button onClick={() => downloadVCard(selectedBooking)} className="text-gray-400 hover:text-green-600" title="Save Contact">
                                    <UserPlus size={16}/>
                                </button>
                            </div>
                        )}
                    </div>
                    <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-xs font-bold">{selectedBooking.eventTitle}</span>
                 </div>
                 <p className="opacity-70 flex items-center gap-2"><CalendarIcon size={16}/> {formatDateDisplay(selectedBooking.startDate, selectedBooking.endDate)}</p>
                 
                 {(selectedBooking.groomName || selectedBooking.brideName) && (
                     <div className={`p-3 rounded-lg text-sm border ${settings.theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-100 text-gray-700'}`}>
                         <span className="font-bold opacity-50 text-xs uppercase block mb-1">The Couple</span>
                         {selectedBooking.groomName && <span>Groom: {selectedBooking.groomName}</span>}
                         {selectedBooking.groomName && selectedBooking.brideName && <span className="mx-2 text-rose-500">&</span>}
                         {selectedBooking.brideName && <span>Bride: {selectedBooking.brideName}</span>}
                     </div>
                 )}

                 {selectedBooking.deliveryLink && (
                     <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                         <p className="text-xs font-bold text-blue-800 uppercase mb-1">Files Delivered</p>
                         <a href={selectedBooking.deliveryLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm flex items-center gap-2 hover:underline truncate">
                             <LinkIcon size={14}/> Open Drive Link
                         </a>
                     </div>
                 )}

                 <div className={`flex justify-between items-center p-3 rounded-lg ${settings.theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-gray-50 text-gray-900'}`}>
                    <div>
                      <p className="text-xs opacity-50 uppercase font-bold">Balance Due</p>
                      <p className="text-xl font-bold">৳{(selectedBooking.packageAmount - selectedBooking.advanceAmount).toLocaleString('en-BD')}</p>
                    </div>
                    {selectedBooking.deliveryStatus === DeliveryStatus.DELIVERED && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Delivered</span>
                    )}
                 </div>
              </div>
            )}
          </div>

          <div className={`p-4 border-t sticky bottom-0 rounded-b-2xl flex gap-2 ${theme.header} border-gray-200/20`}>
            {isEditing ? (
              <button 
                onClick={() => handleSaveBooking(selectedBooking)}
                className={`flex-1 text-white py-3 rounded-lg font-bold shadow-lg active:scale-95 transition ${theme.button}`}
              >
                Save Booking
              </button>
            ) : (
              <>
                <button 
                  onClick={() => setIsEditing(true)}
                  className={`flex-1 border py-3 rounded-lg font-bold ${settings.theme === 'dark' ? 'border-gray-600 text-gray-300' : 'bg-white border-gray-300 text-gray-700'}`}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleGenerateInvoice()}
                  disabled={isGenerating}
                  className={`flex-1 text-white py-3 rounded-lg font-bold shadow-lg flex items-center justify-center gap-2 ${settings.theme === 'dark' ? 'bg-slate-700' : 'bg-gray-900'}`}
                >
                  {isGenerating ? 'Generating...' : <><Download size={18} /> Invoice</>}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (showSplash) {
      return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className={`${theme.bg} min-h-screen ${theme.text} font-sans transition-colors duration-300`}>
      <div className={`${theme.header} p-4 shadow-sm sticky top-0 z-10 flex justify-between items-center no-print border-b border-gray-100/10 transition-colors`}>
        <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="p-1 rounded hover:bg-black/5">
                <MoreVertical size={24} className={theme.accent} />
            </button>
            <h1 className={`text-xl font-bold tracking-tight ${theme.accent}`}>{settings.companyName}</h1>
            {isBackingUp && <Cloud size={16} className="text-blue-500 animate-pulse ml-2" />}
        </div>
        <button 
          onClick={() => {
            setSelectedBooking(createNewBooking({}));
            setIsEditing(true);
          }}
          className={`${theme.button} text-white p-2 rounded-full shadow-lg active:scale-90 transition`}
        >
          <PlusCircle size={24} />
        </button>
      </div>

      {isSidebarOpen && (
          <div className="fixed inset-0 z-50 flex no-print">
              <div className="fixed inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)}></div>
              <div className={`w-64 ${theme.bg} ${theme.text} h-full shadow-2xl relative p-6 flex flex-col`}>
                  <div className="mb-8">
                    <h2 className={`text-2xl font-bold ${theme.accent} mb-1`}>{settings.companyName}</h2>
                    <p className="text-xs opacity-60">{settings.companyTagline}</p>
                  </div>
                  
                  <button 
                    onClick={() => { setIsSettingsOpen(true); setIsSidebarOpen(false); }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/5 font-medium mb-2 w-full text-left"
                  >
                      <Settings size={20} /> {t('app_settings')}
                  </button>

                  {/* LOGOUT BUTTON */}
                  {isGoogleConnected && (
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-500 font-medium mb-2 w-full text-left"
                      >
                          <LogOut size={20} /> Disconnect Drive
                      </button>
                  )}

                  <div className="mt-auto opacity-50 text-xs text-center">
                      <p>Made for Photographers</p>
                  </div>
              </div>
          </div>
      )}

      <main className="max-w-md mx-auto min-h-[80vh] no-print">
        {activeTab === 'bookings' && (
          <div className="p-4 pb-24">
             <div className="mb-4 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                     type="text" 
                     placeholder={t('search_placeholder')}
                     className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm ${theme.input}`}
                     value={searchTerm}
                     onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                   {(['ALL', 'PENDING', 'EDITING', 'DELIVERED'] as const).map(status => (
                     <button
                       key={status}
                       onClick={() => setFilterStatus(status)}
                       className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                         filterStatus === status 
                           ? `${theme.button} text-white shadow-md` 
                           : `${settings.theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} opacity-60 border`
                       }`}
                     >
                       {t(status.toLowerCase() as any)}
                     </button>
                   ))}
                </div>
             </div>

             {filteredBookings.map(b => (
               <BookingCard key={b.id} booking={b} onClick={() => setSelectedBooking(b)} />
             ))}
             {filteredBookings.length === 0 && (
               <div className="text-center mt-20 opacity-40">
                 {searchTerm ? (
                   <p>No matches found.</p>
                 ) : (
                   <>
                     <p>No bookings yet.</p>
                     <p className="text-sm">Use the AI button or + to add one.</p>
                   </>
                 )}
               </div>
             )}
          </div>
        )}
        {activeTab === 'calendar' && <CalendarPage bookings={bookings} onSelectBooking={setSelectedBooking} />}
        {activeTab === 'tracking' && <TrackingPage bookings={bookings} onUpdate={handleUpdateFromTracking} onDeliver={initiateDelivery} title={t('tracking_dashboard')}/>}
        {activeTab === 'gallery' && <GalleryPage isConnected={isGoogleConnected} setIsConnected={setIsGoogleConnected}/>}
      </main>

      <div style={{ position: 'fixed', top: 0, left: isGenerating ? 0 : -10000, zIndex: -1 }}>
          {printingBooking && <InvoiceTemplate booking={printingBooking} ref={invoiceRef} settings={settings} />}
      </div>

      <div className="fixed bottom-24 left-0 right-0 flex justify-center z-20 pointer-events-none no-print">
        <button 
          onClick={() => setAiPromptOpen(true)}
          className="pointer-events-auto bg-gradient-to-r from-rose-500 to-orange-500 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform duration-300 border-4 border-white animate-pulse"
        >
          <Sparkles className="w-6 h-6" />
        </button>
      </div>

      {aiPromptOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-end sm:items-center justify-center p-4 no-print">
          <div className="bg-white w-full max-w-md rounded-2xl p-4 shadow-2xl">
            <div className="flex justify-between mb-4">
               <h3 className="font-bold text-gray-800 flex items-center gap-2">
                 <Sparkles className="text-rose-500" size={18} />
                 AI Quick Booking
               </h3>
               <button onClick={() => setAiPromptOpen(false)}><X className="text-gray-400"/></button>
            </div>
            <textarea 
              autoFocus
              className="w-full bg-gray-100 p-3 rounded-xl mb-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="e.g. 'Booking for Raj weds Simran on 2025-01-01 amount 50000'"
              rows={3}
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
            />
            <button 
              onClick={handleAICommand}
              disabled={aiLoading}
              className="w-full bg-black text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              {aiLoading ? 'Thinking...' : <><Send size={18} /> Process Command</>}
            </button>
          </div>
        </div>
      )}

      <nav className={`fixed bottom-0 w-full border-t p-2 pb-safe z-30 flex justify-around items-center text-xs font-medium no-print ${theme.bg} ${settings.theme === 'dark' ? 'border-slate-800' : 'border-gray-100'}`}>
        <button 
          onClick={() => setActiveTab('gallery')}
          className={`flex flex-col items-center p-2 ${activeTab === 'gallery' ? theme.accent : 'opacity-40'}`}
        >
          <GalleryIcon size={24} className="mb-1" />
          {t('nav_gallery')}
        </button>
        <button 
          onClick={() => setActiveTab('bookings')}
          className={`flex flex-col items-center p-2 ${activeTab === 'bookings' ? theme.accent : 'opacity-40'}`}
        >
          <LayoutGrid size={24} className="mb-1" />
          {t('nav_bookings')}
        </button>
        <div className="w-12"></div>
        <button 
          onClick={() => setActiveTab('calendar')}
          className={`flex flex-col items-center p-2 ${activeTab === 'calendar' ? theme.accent : 'opacity-40'}`}
        >
          <CalendarIcon size={24} className="mb-1" />
          {t('nav_calendar')}
        </button>
        <button 
          onClick={() => setActiveTab('tracking')}
          className={`flex flex-col items-center p-2 ${activeTab === 'tracking' ? theme.accent : 'opacity-40'}`}
        >
          <Activity size={24} className="mb-1" />
          {t('nav_tracking')}
        </button>
      </nav>

      {renderBookingModal()}
      {renderPaymentModal()}
      {renderPostSaveActions()}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={settings} 
        onSave={handleSaveSettings}
        isBackingUp={isBackingUp}
        onBackup={() => triggerBackup(bookings)}
        t={t}
      />
    </div>
  );
}
