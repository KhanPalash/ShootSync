
export enum DeliveryStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  DELIVERED = 'Delivered'
}

export type AppTheme = 'light' | 'dark' | 'floral' | 'luxury' | 'ocean';
export type InvoiceTheme = 'classic' | 'modern' | 'elegant' | 'minimal' | 'floral';

export interface AppSettings {
  language: 'en' | 'bn';
  theme: AppTheme;
  invoiceTheme: InvoiceTheme;
  logoType: 'text' | 'image';
  logoUrl?: string;
  companyName: string;
  companyTagline: string;
  companyContact: string;
  enableCloudBackup: boolean;
  lastBackupDate?: string;
}

export interface EditingTask {
  id: string;
  label: string;
  isCompleted: boolean;
}

export interface DriveFile {
  id: string;
  name: string;
  thumbnailLink: string;
  webViewLink: string;
  mimeType: string;
}

export interface Booking {
  id: string;
  clientName: string;
  clientPhone?: string;
  groomName?: string;
  brideName?: string;
  eventTitle: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  venue: string;
  packageAmount: number;
  advanceAmount: number;
  notes?: string;
  createdAt: number;
  
  // Tracking Fields
  shootDoneDate?: string;
  editingProgress: number; // 0-100
  editingTasks?: EditingTask[];
  deliveryStatus: DeliveryStatus;
  deliveryTrackingUrl?: string;
  deliveryLink?: string;
  deliveredItems: string[];
  lastPaymentDate?: string;
}

export interface CalendarEvent {
  date: string;
  bookings: Booking[];
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  booking: Booking;
}