import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Navigation,
  ExternalLink,
  Car,
  Train,
  Building2,
  AlertOctagon,
  Sparkles
} from 'lucide-react';
import api from '../services/api';
import { ClinicMap } from '../components/map/ClinicMap';

export const LocationContact = () => {
  const [clinic, setClinic] = useState(null);
  const [openStatus, setOpenStatus] = useState(null);

  useEffect(() => {
    const fetchClinic = async () => {
      try {
        const res = await api.get('/clinic');
        if (res.success) {
          setClinic(res.settings);
          setOpenStatus(res.openStatus);
        }
      } catch (err) {
        console.error('Error fetching contact page clinic info:', err);
      }
    };
    fetchClinic();
  }, []);

  const phone = clinic?.phone || '+91 98765 43210';
  const emergencyPhone = clinic?.emergencyPhone || '+91 98765 00911';
  const email = clinic?.email || 'care@smilecaredental.com';
  const whatsapp = clinic?.whatsapp || '+919876543210';

  const openingHours = clinic?.openingHours || [
    { day: 'Monday', open: '09:00 AM', close: '08:00 PM', isClosed: false },
    { day: 'Tuesday', open: '09:00 AM', close: '08:00 PM', isClosed: false },
    { day: 'Wednesday', open: '09:00 AM', close: '08:00 PM', isClosed: false },
    { day: 'Thursday', open: '09:00 AM', close: '08:00 PM', isClosed: false },
    { day: 'Friday', open: '09:00 AM', close: '08:00 PM', isClosed: false },
    { day: 'Saturday', open: '09:00 AM', close: '06:00 PM', isClosed: false },
    { day: 'Sunday', open: '10:00 AM', close: '02:00 PM', isClosed: false },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-brand-50/80 via-slate-50 to-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold">
            <MapPin className="w-3.5 h-3.5" />
            <span>Clinic Location & Contact</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Get in Touch & Visit Our Clinic
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Conveniently located in Indiranagar, Bengaluru opposite the Metro station with dedicated valet parking.
          </p>
        </div>
      </section>

      {/* Main Grid: Contact Cards & Opening Hours */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Quick Contact Cards */}
          <div className="space-y-4">
            <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">
              Direct Inquiries
            </h3>

            {/* Phone */}
            <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-card flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase">General Desk</span>
                <p className="text-base font-bold text-slate-900">{phone}</p>
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="text-xs font-bold text-brand-600 hover:underline inline-block pt-1"
                >
                  Call Now →
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-card flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase">WhatsApp Care</span>
                <p className="text-base font-bold text-slate-900">{phone}</p>
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-emerald-600 hover:underline inline-block pt-1"
                >
                  Chat on WhatsApp →
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-card flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent-50 text-accent-600 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase">Email Support</span>
                <p className="text-sm font-bold text-slate-900">{email}</p>
                <a
                  href={`mailto:${email}`}
                  className="text-xs font-bold text-accent-600 hover:underline inline-block pt-1"
                >
                  Send an Email →
                </a>
              </div>
            </div>

            {/* Emergency Hotline Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-tr from-rose-600 to-rose-700 text-white shadow-xl space-y-2">
              <div className="flex items-center gap-2 text-rose-200 text-xs font-bold uppercase">
                <AlertOctagon className="w-4 h-4 text-white animate-pulse" />
                <span>24/7 Dental Emergency</span>
              </div>
              <p className="text-xl font-black">{emergencyPhone}</p>
              <p className="text-xs text-rose-100">
                Immediate triage for acute trauma, broken teeth, or severe uncontrolled toothache.
              </p>
            </div>
          </div>

          {/* Column 2 & 3: Opening Hours & Interactive Map (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Opening Hours Schedule Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-5 h-5 text-brand-600" />
                  <span>Clinic Opening Hours</span>
                </h3>

                {openStatus && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                      openStatus.isOpen
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}
                  >
                    ● {openStatus.statusText || (openStatus.isOpen ? 'Open Now' : 'Closed')}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {openingHours.map((schedule, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                  >
                    <span className="font-bold text-slate-800">{schedule.day}</span>
                    <span className="text-slate-600 font-medium">
                      {schedule.isClosed ? (
                        <span className="text-rose-500 font-bold">Closed</span>
                      ) : (
                        `${schedule.open} - ${schedule.close}`
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Map Component */}
            <ClinicMap clinic={clinic} />
          </div>
        </div>
      </section>
    </div>
  );
};
