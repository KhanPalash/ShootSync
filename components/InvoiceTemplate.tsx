
import React, { forwardRef } from 'react';
import { Booking, AppSettings } from '../types';

interface InvoiceTemplateProps {
  booking: Booking;
  settings?: AppSettings;
}

export const InvoiceTemplate = forwardRef<HTMLDivElement, InvoiceTemplateProps>(({ booking, settings }, ref) => {
  const balance = booking.packageAmount - booking.advanceAmount;
  const isPaid = balance <= 0;
  
  const today = new Date().toLocaleDateString('en-GB');

  return (
    <div ref={ref} className="w-[210mm] min-h-[297mm] bg-white text-slate-900 font-serif relative overflow-hidden">
      {/* DECORATIVE HEADER */}
      <div className="bg-[#1c1917] text-[#f5f5f4] p-12 flex justify-between items-start">
         <div>
             <h1 className="text-4xl font-bold tracking-widest uppercase mb-2 text-[#d6d3d1]">{settings?.companyName || "ShootSync"}</h1>
             <p className="text-sm tracking-[0.2em] text-[#a8a29e] uppercase">{settings?.companyTagline || "Photography & Cinematography"}</p>
         </div>
         <div className="text-right">
             <h2 className="text-3xl font-bold opacity-30">INVOICE</h2>
             <p className="mt-1 text-[#a8a29e]">#{booking.id.slice(0,6).toUpperCase()}</p>
             <p className="text-sm mt-1">{today}</p>
         </div>
      </div>

      <div className="p-12">
          {/* CLIENT INFO */}
          <div className="flex justify-between mb-16">
              <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 border-b pb-2 w-32">Billed To</h3>
                  <p className="text-2xl font-bold mb-1">{booking.clientName}</p>
                  <p className="text-gray-600">{booking.clientPhone}</p>
                  <p className="text-gray-500 mt-2 text-sm">{booking.venue}</p>
              </div>
              <div className="text-right">
                   <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 border-b pb-2 w-32 ml-auto">Event Info</h3>
                   <p className="text-xl font-bold">{booking.eventTitle}</p>
                   <p className="text-gray-600">{booking.startDate}</p>
              </div>
          </div>

          {/* TABLE */}
          <table className="w-full mb-12">
              <thead>
                  <tr className="border-b-2 border-black">
                      <th className="text-left py-4 text-xs font-bold uppercase tracking-widest">Description</th>
                      <th className="text-right py-4 text-xs font-bold uppercase tracking-widest">Amount</th>
                  </tr>
              </thead>
              <tbody>
                  <tr className="border-b border-gray-100">
                      <td className="py-6">
                          <p className="font-bold text-lg mb-1">Photography Services</p>
                          <p className="text-gray-500 text-sm italic">{booking.notes || "Standard Package Coverage"}</p>
                      </td>
                      <td className="text-right py-6 text-xl">
                          ৳{booking.packageAmount.toLocaleString()}
                      </td>
                  </tr>
              </tbody>
          </table>

          {/* TOTALS */}
          <div className="flex justify-end">
              <div className="w-1/2 space-y-3">
                  <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>৳{booking.packageAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-700 font-medium">
                      <span>Paid Advance</span>
                      <span>- ৳{booking.advanceAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t-2 border-black pt-4 text-2xl font-bold">
                      <span>Balance Due</span>
                      <span>৳{balance <= 0 ? 0 : balance.toLocaleString()}</span>
                  </div>
              </div>
          </div>

          {/* STAMP */}
          {isPaid && (
               <div className="absolute bottom-40 left-20 border-4 border-green-600 text-green-600 px-8 py-2 text-4xl font-black uppercase tracking-widest -rotate-12 opacity-50">
                   PAID
               </div>
          )}

          {/* FOOTER */}
          <div className="absolute bottom-12 left-12 right-12 text-center border-t pt-8">
              <p className="font-bold mb-1">Thank you for your business!</p>
              <p className="text-sm text-gray-500">{settings?.companyContact}</p>
          </div>
      </div>
    </div>
  );
});
