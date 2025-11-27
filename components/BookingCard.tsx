
import React from 'react';
import { Booking, DeliveryStatus } from '../types';
import { Calendar, MapPin, ChevronRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface Props {
  booking: Booking;
  onClick: () => void;
  onDelete?: (e: React.MouseEvent) => void;
}

export const BookingCard: React.FC<Props> = ({ booking, onClick }) => {
  const isDelivered = booking.deliveryStatus === DeliveryStatus.DELIVERED;
  const isEditing = booking.editingProgress > 0 && !isDelivered;
  const isPending = !isDelivered && !isEditing;

  const formatDate = (dateStr: string) => {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getStatusColor = () => {
      if (isDelivered) return 'bg-green-100 text-green-700 border-green-200';
      if (isEditing) return 'bg-amber-100 text-amber-700 border-amber-200';
      return 'bg-gray-100 text-gray-600 border-gray-200';
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 active:scale-[0.98] transition-all duration-200 relative overflow-hidden group hover:shadow-md cursor-pointer"
    >
        {/* Status Strip */}
        <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${isDelivered ? 'bg-green-500' : isEditing ? 'bg-amber-500' : 'bg-gray-300'}`}></div>

        <div className="flex justify-between items-start mb-3 pl-2">
            <div>
                <h3 className="font-bold text-lg text-gray-800 leading-tight">{booking.clientName}</h3>
                <p className="text-sm text-indigo-600 font-medium">{booking.eventTitle}</p>
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border uppercase tracking-wider ${getStatusColor()}`}>
                {booking.deliveryStatus}
            </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pl-2">
            <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-gray-400"/>
                {formatDate(booking.startDate)}
            </div>
            {booking.venue && (
                <div className="flex items-center gap-1.5 truncate max-w-[150px]">
                    <MapPin size={14} className="text-gray-400"/>
                    {booking.venue}
                </div>
            )}
        </div>

        {/* Progress / Footer */}
        <div className="pl-2 pt-3 border-t border-gray-50 flex justify-between items-center">
            {isDelivered ? (
                <div className="text-green-600 flex items-center gap-1.5 text-xs font-bold">
                    <CheckCircle2 size={16} /> Completed
                </div>
            ) : isEditing ? (
                <div className="flex-1 mr-4">
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                        <span>EDITING</span>
                        <span>{booking.editingProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                            style={{ width: `${booking.editingProgress}%` }}
                        ></div>
                    </div>
                </div>
            ) : (
                <div className="text-gray-400 flex items-center gap-1.5 text-xs">
                    <Clock size={16} /> Upcoming Shoot
                </div>
            )}
            
            <ChevronRight size={18} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
        </div>
    </div>
  );
};
