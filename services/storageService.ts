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

// SVG Logo Data URI (Khan's Creations Logo)
// Optimized for white paper (Invoice) with darker gold text
const DEFAULT_LOGO_SVG = `data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500'%3E%3Cg transform='translate(250, 180)'%3E%3Cpath d='M0 -80 C15 -15, 15 -15, 80 0 C15 15, 15 15, 0 80 C-15 15, -15 15, -80 0 C-15 -15, -15 -15, 0 -80 C-15 -15, -15 -15, 0 -80' fill='none' stroke='%23FFB300' stroke-width='35' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='-50' cy='50' r='20' fill='%23FFB300'/%3E%3C/g%3E%3Ctext x='250' y='320' text-anchor='middle' font-family='Times New Roman, serif' font-weight='bold' font-size='64' fill='%23B8860B' stroke='%23B8860B' stroke-width='1' letter-spacing='2'%3EKhan's%3C/text%3E%3Ctext x='250' y='390' text-anchor='middle' font-family='Times New Roman, serif' font-weight='bold' font-size='64' fill='%23B8860B' stroke='%23B8860B' stroke-width='1' letter-spacing='2'%3ECreations%3C/text%3E%3Ctext x='250' y='440' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%23000000' letter-spacing='4' font-weight='500'%3ECINEMATOGRAPHY %26amp; PHOTOGRAPHY%3C/text%3E%3C/svg%3E`;

export const getSettings = (): AppSettings => {
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? JSON.parse(data) : { 
    language: 'en',
    theme: 'light', 
    invoiceTheme: 'classic',
    logoType: 'image',
    logoUrl: DEFAULT_LOGO_SVG,
    companyName: "Khan's Creations",
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