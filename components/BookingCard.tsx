
import React from 'react';
import { Booking, DeliveryStatus } from '../types';
import { Calendar, MapPin, CheckCircle, AlertCircle, Clock, Banknote, Briefcase } from 'lucide-react';

interface Props {
  booking: Booking;
  onClick: () => void;
}

export const BookingCard: React.FC<Props> = ({ booking, onClick }) => {
  const isReadyToDeliver = booking.editingProgress === 100 && booking.deliveryStatus !== DeliveryStatus.DELIVERED;
  const isShootDone = !!booking.shootDoneDate;

  // Logic for badges
  const today = new Date();
  const startDate = new Date(booking.startDate);
  const diffTime = startDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const isUpcoming = diffDays >= 0 && diffDays <= 2;
  
  // Payment Reminder Logic (Every 3 days if balance due)
  const balance = booking.packageAmount - booking.advanceAmount;
  const lastPay = booking.lastPaymentDate ? new Date(booking.lastPaymentDate) : new Date(booking.createdAt);
  const daysSinceLastPay = Math.floor((today.getTime() - lastPay.getTime()) / (1000 * 60 * 60 * 24));
  const showPaymentDue = balance > 0 && booking.deliveryStatus === DeliveryStatus.DELIVERED && daysSinceLastPay >= 3;

  const getStatusDisplay = () => {
    if (booking.deliveryStatus === DeliveryStatus.DELIVERED) {
      return { label: 'Delivered', color: 'bg-green-100 text-green-800' };
    }
    if (isReadyToDeliver) {
      return { label: 'Ready to Deliver', color: 'bg-amber-100 text-amber-800 animate-pulse' };
    }
    if (booking.editingProgress > 0) {
      return { label: 'Editing', color: 'bg-blue-100 text-blue-800' };
    }
    return { label: 'Pending', color: 'bg-gray-100 text-gray-800' };
  };

  const status = getStatusDisplay();

  const formatToDDMMYYYY = (isoDate: string) => {
    if (!isoDate) return '';
    const parts = isoDate.split('-'); // YYYY-MM-DD
    if (parts.length !== 3) return isoDate;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const formatDateRange = (start: string, end: string) => {
    const s = formatToDDMMYYYY(start);
    const e = formatToDDMMYYYY(end);
    if (start === end) {
      return s;
    }
    return `${s} - ${e}`;
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border p-4 mb-4 active:scale-95 transition-transform duration-200 relative overflow-hidden ${isReadyToDeliver ? 'border-amber-300 ring-1 ring-amber-100' : 'border-gray-100'}`}
    >
      {/* Priority/Warning Badges */}
      {isUpcoming && (
        <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-bl-lg font-bold flex items-center gap-1 z-10">
          <Clock size={10} /> UPCOMING
        </div>
      )}
      {showPaymentDue && (
        <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-bl-lg font-bold flex items-center gap-1 z-10">
          <Banknote size={10} /> PAYMENT DUE
        </div>
      )}

      <div className="flex justify-between items-start mb-2 pt-1">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{booking.clientName}</h3>
          <p className="text-sm text-rose-600 font-medium">{booking.eventTitle}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${status.color}`}>
            {status.label}
            </span>
             {isShootDone && booking.editingProgress < 100 && (
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100 flex items-center gap-1">
                    <Briefcase size={8} /> Editing Priority
                </span>
            )}
        </div>
      </div>

      <div className="flex items-center text-gray-500 text-sm mb-1">
        <Calendar className="w-4 h-4 mr-2" />
        {formatDateRange(booking.startDate, booking.endDate)}
      </div>
      <div className="flex items-center text-gray-500 text-sm mb-3">
        <MapPin className="w-4 h-4 mr-2" />
        {booking.venue || 'No venue set'}
      </div>

      {/* Compact Progress Bar - Only if Shoot is Done */}
      {isShootDone ? (
        <>
            <div 
              className="w-full bg-gray-100 rounded-full h-2 mb-2 overflow-hidden cursor-help"
              title={`Editing Progress: ${booking.editingProgress}%`}
            >
                <div 
                className={`h-2 rounded-full transition-all duration-500 ${isReadyToDeliver ? 'bg-amber-500' : 'bg-indigo-500'}`}
                style={{ width: `${booking.editingProgress}%` }}
                ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
                <span className={isReadyToDeliver ? 'text-amber-600 font-bold' : ''}>
                    {isReadyToDeliver ? 'Editing Complete' : `Edit: ${booking.editingProgress}%`}
                </span>
                <span className="text-green-600 flex items-center"><CheckCircle className="w-3 h-3 mr-1"/> Shoot Done</span>
            </div>
        </>
      ) : (
          <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-100 text-xs text-center text-gray-400">
              Shoot Pending
          </div>
      )}
    </div>
  );
};
