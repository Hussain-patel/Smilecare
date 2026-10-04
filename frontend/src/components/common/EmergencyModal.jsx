import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneCall, MessageSquare, AlertOctagon, X, ShieldAlert, Clock, CheckCircle } from 'lucide-react';

export const EmergencyModal = ({ isOpen, onClose, clinicInfo }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const phone = clinicInfo?.emergencyPhone || '+91 7483910280';
  const whatsapp = clinicInfo?.whatsapp || '+917483910280';

  const handleBookEmergency = () => {
    onClose();
    navigate('/booking?urgency=emergency');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-rose-100 overflow-hidden relative">
        {/* Urgent Header Banner */}
        <div className="bg-gradient-to-r from-rose-600 to-rose-700 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
            <AlertOctagon className="w-8 h-8 text-white animate-bounce" />
          </div>
          <h3 className="text-2xl font-black tracking-tight">Dental Emergency Care</h3>
          <p className="text-rose-100 text-sm mt-1">
            Immediate attention for severe toothache, trauma, broken teeth or acute swelling.
          </p>
        </div>

        {/* Action Body */}
        <div className="p-6 space-y-5">
          {/* Quick Call Button */}
          <a
            href={`tel:${phone.replace(/\s+/g, '')}`}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-lg shadow-rose-600/30 transition-all transform hover:-translate-y-0.5 text-base"
          >
            <PhoneCall className="w-5 h-5 animate-pulse" />
            <span>Call 24/7 Hotline: {phone}</span>
          </a>

          {/* WhatsApp Direct Message */}
          <a
            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20SmileCare,%20I%20have%20an%20urgent%20dental%20emergency.%20Please%20assist.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/20 transition-all text-sm"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Chat on WhatsApp Instantly</span>
          </a>

          {/* Fast-Track Booking Button */}
          <button
            onClick={handleBookEmergency}
            className="w-full py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-all text-sm flex items-center justify-center gap-2"
          >
            <Clock className="w-4 h-4 text-slate-600" />
            <span>Book Priority Emergency Slot</span>
          </button>

          {/* Quick Triage Advice */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              Immediate First-Aid Guidance
            </div>
            <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
              <li><strong>Knocked-Out Tooth:</strong> Do not touch root. Place in cold milk/saliva and reach us within 60 mins.</li>
              <li><strong>Severe Toothache:</strong> Rinse with warm salt water. Avoid placing aspirin directly on gums.</li>
              <li><strong>Bleeding / Trauma:</strong> Apply firm pressure with sterile gauze for 15-20 minutes.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
