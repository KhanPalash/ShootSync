import { Booking, DeliveryStatus, AppSettings, EditingTask } from '../types';

const STORAGE_KEY = 'dulhan_diaries_bookings';
const SETTINGS_KEY = 'dulhan_diaries_settings';

export const saveBooking = (booking: Booking): void => {
  const bookings = getBookings();
  const existingIndex = bookings.findIndex(b => b.id === booking.id);
  
  if (existingIndex >= 0) {
    bookings[existingIndex] = booking;
  } else {
    bookings.push(booking);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
};

export const getBookings = (): Booking[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const deleteBooking = (id: string): void => {
  const bookings = getBookings().filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
};

export const saveSettings = (settings: AppSettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const getSettings = (): AppSettings => {
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? JSON.parse(data) : { 
    language: 'en',
    theme: 'light', 
    invoiceTheme: 'classic',
    logoType: 'text',
    companyName: 'Dulhan Diaries',
    companyTagline: 'Cinematography & Photography',
    companyContact: 'Contact: +880 1700-000000',
    enableCloudBackup: false
  };
};

const DEFAULT_TASKS: EditingTask[] = [
  { id: '1', label: 'Data Backup & Culling', isCompleted: false },
  { id: '2', label: 'Color Correction', isCompleted: false },
  { id: '3', label: 'Skin Retouching', isCompleted: false },
  { id: '4', label: 'Cinematic Grading', isCompleted: false },
  { id: '5', label: 'Video Editing / Highlight', isCompleted: false },
  { id: '6', label: 'Final Export & Upload', isCompleted: false }
];

// Android 9 Compatibility: Polyfill for crypto.randomUUID which requires Chrome 92+
const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  // Fallback for older WebViews (Android 9 factory versions)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const createNewBooking = (partial: Partial<Booking>): Booking => {
  const today = new Date().toISOString().split('T')[0];
  const start = partial.startDate || today;
  
  return {
    id: generateUUID(),
    clientName: partial.clientName || '',
    clientPhone: partial.clientPhone || '',
    groomName: partial.groomName || '',
    brideName: partial.brideName || '',
    eventTitle: partial.eventTitle || '',
    startDate: start,
    endDate: partial.endDate || start,
    venue: partial.venue || '',
    packageAmount: partial.packageAmount || 0,
    advanceAmount: partial.advanceAmount || 0,
    notes: partial.notes || 'Photography & Cinematography',
    createdAt: Date.now(),
    shootDoneDate: undefined,
    editingProgress: 0,
    editingTasks: [...DEFAULT_TASKS], // Initialize with copy of defaults
    deliveryStatus: DeliveryStatus.PENDING,
    deliveryLink: '',
    deliveredItems: [],
    lastPaymentDate: undefined,
    ...partial
  };
};