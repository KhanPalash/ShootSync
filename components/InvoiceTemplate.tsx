
import React, { forwardRef } from 'react';
import { Booking, DeliveryStatus, AppSettings } from '../types';

interface InvoiceTemplateProps {
  booking: Booking;
  settings?: AppSettings;
}

export const InvoiceTemplate = forwardRef<HTMLDivElement, InvoiceTemplateProps>(({ booking, settings }, ref) => {
  const balance = booking.packageAmount - booking.advanceAmount;
  const isPaidInFull = balance <= 0;
  const isDelivered = booking.deliveryStatus === DeliveryStatus.DELIVERED;
  const invoiceTheme = settings?.invoiceTheme || 'classic';

  const formatToDDMMYYYY = (isoDate: string) => {
      if (!isoDate) return '';
      const parts = isoDate.split('-'); // YYYY-MM-DD
      if (parts.length !== 3) return isoDate;
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const formatDateRange = (start: string, end: string) => {
    const formattedStart = formatToDDMMYYYY(start);
    const formattedEnd = formatToDDMMYYYY(end);
    
    if (start === end) return formattedStart;
    return `${formattedStart} to ${formattedEnd}`;
  };

  const getTodayDDMMYYYY = () => {
      const d = new Date();
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
  };

  const getDurationInDays = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const timeDiff = e.getTime() - s.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    return daysDiff;
  };

  const duration = getDurationInDays(booking.startDate, booking.endDate);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-BD', { style: 'currency', currency: 'BDT' });
  };

  // Logic for Header Logo vs Text
  const headerLogoUrl = settings?.logoType === 'image' ? settings.logoUrl : null;
  // Logic for Watermark (Always use the uploaded logo if available, regardless of header type)
  const watermarkUrl = settings?.logoUrl;
  
  const companyName = settings?.companyName || 'ShootSync';
  const tagline = settings?.companyTagline || 'Cinematography & Photography';
  const contact = settings?.companyContact || 'Contact: +880 1700-000000';

  // --- THEME CONFIGURATION ---
  const getThemeStyles = () => {
    switch (invoiceTheme) {
      case 'modern':
        return {
          wrapper: 'bg-white font-sans',
          header: 'bg-indigo-900 text-white pt-12 pb-8 mb-8',
          headerBorder: 'border-none',
          title: 'text-white',
          textMuted: 'text-indigo-200',
          accentColor: 'text-indigo-900',
          tableHeader: 'bg-indigo-50 text-indigo-900 font-bold',
          totalBorder: 'border-indigo-900'
        };
      case 'elegant':
        return {
          wrapper: 'bg-[#fffdf9] font-serif border-[12px] border-double border-[#d4af37]',
          header: 'pt-12 pb-8 mb-8 border-b border-[#d4af37]',
          headerBorder: '',
          title: 'text-[#8a7020]',
          textMuted: 'text-[#a08b50]',
          accentColor: 'text-[#8a7020]',
          tableHeader: 'bg-[#fcf8e8] text-[#8a7020] uppercase tracking-widest border-b border-[#d4af37]',
          totalBorder: 'border-[#d4af37]'
        };
      case 'minimal':
        return {
          wrapper: 'bg-white font-mono',
          header: 'pt-12 pb-8 mb-8 border-b border-black',
          headerBorder: '',
          title: 'text-black tracking-tighter',
          textMuted: 'text-gray-500',
          accentColor: 'text-black',
          tableHeader: 'bg-transparent border-b-2 border-black text-black font-bold uppercase',
          totalBorder: 'border-black'
        };
      case 'floral':
        return {
          wrapper: 'bg-white font-serif',
          header: 'bg-rose-50 text-rose-900 pt-12 pb-8 mb-8',
          headerBorder: 'border-b-4 border-rose-200',
          title: 'text-rose-800',
          textMuted: 'text-rose-700',
          accentColor: 'text-rose-800',
          tableHeader: 'bg-rose-100 text-rose-900',
          totalBorder: 'border-rose-300'
        };
      default: // Classic
        return {
          wrapper: 'bg-white font-serif',
          header: 'pt-12 pb-8 mb-8 border-b-2 border-gray-200',
          headerBorder: '',
          title: 'text-gray-800',
          textMuted: 'text-gray-500',
          accentColor: 'text-gray-800',
          tableHeader: 'bg-gray-100 text-gray-700 uppercase tracking-wider',
          totalBorder: 'border-gray-800'
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <div ref={ref} className={`w-[210mm] min-h-[297mm] box-border leading-normal relative mx-auto shadow-2xl overflow-hidden ${theme.wrapper}`}>
      
      {/* WATERMARK: STRICTLY CENTERED LOGO, 20% OPACITY */}
      {watermarkUrl && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
             <img 
               src={watermarkUrl} 
               alt="" 
               className="w-[60%] opacity-20 object-contain" 
             /> 
          </div>
      )}

      {/* Main Content (z-10 to sit above watermark) */}
      <div className="relative z-10">

        {/* Header - STRICTLY CENTERED BRANDING */}
        <div className={`${theme.header} relative`}>
            
            {/* Invoice Meta Data - Absolutely Positioned Top Right */}
            <div className="absolute top-8 right-12 text-right">
                <h2 className={`text-xl font-bold opacity-60 ${invoiceTheme === 'modern' ? 'text-indigo-200' : 'text-gray-400'}`}>INVOICE</h2>
                <p className={`text-sm mt-1 ${theme.textMuted}`}>#{booking.id.slice(0, 6).toUpperCase()}</p>
                <p className={`text-sm ${theme.textMuted}`}>{getTodayDDMMYYYY()}</p>
            </div>

            {/* Center Branding Block */}
            <div className="flex flex-col items-center justify-center px-12 text-center">
                {headerLogoUrl ? (
                    <img src={headerLogoUrl} alt="Logo" className="h-24 object-contain mb-4" />
                ) : (
                    <h1 className={`text-5xl font-bold uppercase tracking-wider mb-2 ${theme.title}`}>{companyName}</h1>
                )}
                
                {/* Tagline & Contact */}
                <p className={`text-sm tracking-wide uppercase opacity-90 ${theme.textMuted}`}>{tagline}</p>
                <p className={`text-sm mt-1 ${theme.textMuted}`}>{contact}</p>
            </div>
        </div>

        {/* Paid Stamp */}
        {isPaidInFull && (
            <div className="absolute top-48 left-1/2 -translate-x-1/2 border-4 border-green-600 text-green-600 px-6 py-2 text-2xl font-black uppercase tracking-widest opacity-80 rotate-[-10deg] z-20 bg-white/50 backdrop-blur-sm">
            PAID IN FULL
            </div>
        )}

        {/* Content Container */}
        <div className="px-12">
            {/* Client Info */}
            <div className="grid grid-cols-2 gap-12 mb-12 mt-8">
                <div>
                    <h3 className={`font-bold mb-3 uppercase text-xs tracking-wide border-b pb-1 ${theme.accentColor} border-gray-200/50`}>Billed To</h3>
                    <p className="text-xl font-bold">{booking.clientName}</p>
                    {booking.clientPhone && <p className="text-sm text-gray-600 mt-1">Ph: {booking.clientPhone}</p>}
                    {(booking.groomName || booking.brideName) && (
                        <div className={`mt-3 p-3 rounded ${invoiceTheme === 'minimal' ? 'border border-gray-200' : 'bg-gray-50/90'}`}>
                            <p className="text-xs text-gray-500 uppercase font-bold">The Couple</p>
                            <p className="text-lg font-serif italic text-gray-800">
                            {booking.groomName || 'Groom'} 
                            <span className="mx-2 text-rose-400">&</span> 
                            {booking.brideName || 'Bride'}
                            </p>
                        </div>
                    )}
                </div>
                <div className="text-right">
                    <h3 className={`font-bold mb-3 uppercase text-xs tracking-wide border-b pb-1 ${theme.accentColor} border-gray-200/50`}>Event Details</h3>
                    <p className="font-semibold text-lg">{booking.eventTitle}</p>
                    <p className="text-gray-600">{formatDateRange(booking.startDate, booking.endDate)}</p>
                    <p className="text-gray-800 font-bold text-sm mt-1">Duration: {duration} Day{duration > 1 ? 's' : ''}</p>
                    <p className="text-gray-600">{booking.venue}</p>
                </div>
            </div>

            {/* Table */}
            <div className="mb-12">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className={theme.tableHeader}>
                    <th className="p-3 text-sm">Description</th>
                    <th className="p-3 text-sm text-right">Amount</th>
                </tr>
                </thead>
                <tbody>
                <tr className="border-b border-gray-200">
                    <td className="p-4">
                    <p className="font-bold">Wedding Photography & Cinematography</p>
                    <p className="text-sm text-gray-500 mt-1">{booking.notes || "Standard Coverage"}</p>
                    <p className="text-xs text-gray-400 mt-1 italic">Event Coverage: {duration} Day{duration > 1 ? 's' : ''}</p>
                    </td>
                    <td className="p-4 text-right font-mono text-lg">
                    {formatCurrency(booking.packageAmount)}
                    </td>
                </tr>
                </tbody>
            </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-16">
            <div className="w-1/2 bg-white/80 p-4 rounded-lg">
                <div className="flex justify-between py-2 border-b border-gray-100 text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(booking.packageAmount)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 text-green-700 font-semibold">
                <span>Total Paid</span>
                <span>- {formatCurrency(booking.advanceAmount)}</span>
                </div>
                <div className={`flex justify-between py-4 border-t-2 ${theme.totalBorder} text-2xl font-bold ${theme.accentColor} mt-2`}>
                <span>Balance Due</span>
                <span>{balance <= 0 ? formatCurrency(0) : formatCurrency(balance)}</span>
                </div>
            </div>
            </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-12 left-12 right-12 text-center text-gray-400 text-sm">
            <p className="font-bold mb-1 opacity-80">Thank you for choosing {companyName}</p>
            {balance > 0 && <p className="text-xs">Please make checks payable to "{companyName}"</p>}
        </div>
      </div>
    </div>
  );
});
