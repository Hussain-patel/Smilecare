import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Stethoscope,
  MapPin,
  Printer,
  Navigation,
  MessageCircle,
  Phone,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api';

export const BookingSuccess = () => {
  const { idOrNumber } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Launch celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    const fetchAppointment = async () => {
      try {
        const res = await api.get(`/appointments/${idOrNumber}`);
        if (res.success && res.appointment) {
          setAppointment(res.appointment);
        }
      } catch (err) {
        console.error('Error fetching appointment confirmation:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [idOrNumber]);

  if (loading) {
    return (
      <div className="min-h-screen py-20 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-semibold">Generating your confirmation pass...</p>
      </div>
    );
  }

  const appNumber = appointment?.appointmentNumber || idOrNumber || 'SC-2026-1042';
  const doctorName = appointment?.doctor?.name || 'Dr. Mohammed Ahmed';
  const serviceName = appointment?.service?.name || 'Dental Consultation';
  const date = appointment?.date || '2026-08-20';
  const time = appointment?.timeSlot || '10:00 AM';
  const price = appointment?.price || 500;
  const patientName = appointment?.patientInfo?.name || 'Valued Patient';

  // Google Calendar Link generator
  const createGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`Dental Appointment: ${serviceName} with ${doctorName} at SmileCare`);
    const details = encodeURIComponent(
      `Appointment Ref: ${appNumber}\nDoctor: ${doctorName}\nService: ${serviceName}\nClinic: SmileCare Towers, Indiranagar, Bengaluru\nContact: +91 98765 43210`
    );
    const location = encodeURIComponent('SmileCare Dental Clinic, 42 Health Avenue, Indiranagar, Bengaluru');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white text-center shadow-xl shadow-emerald-600/20 space-y-3 relative overflow-hidden">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-md">
            <CheckCircle2 className="w-10 h-10 text-white animate-bounce" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Appointment Confirmed!</h1>
          <p className="text-emerald-100 text-sm max-w-md mx-auto">
            Thank you, <strong className="text-white">{patientName}</strong>. Your dental visit has been scheduled.
            A confirmation notification has been dispatched to your email & WhatsApp.
          </p>
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-mono font-bold tracking-wider">
            Booking ID: {appNumber}
          </div>
        </div>

        {/* Printable Ticket Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Dental Clinic</span>
              <h3 className="text-lg font-black text-slate-900">SmileCare Dental & Implant Center</h3>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Slip</span>
            </button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-brand-600" />
                <span>Dentist Specialist</span>
              </span>
              <p className="font-bold text-slate-900">{doctorName}</p>
              <p className="text-xs text-slate-500">{appointment?.doctor?.specialization?.[0]}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Stethoscope className="w-3.5 h-3.5 text-brand-600" />
                <span>Service / Procedure</span>
              </span>
              <p className="font-bold text-brand-700">{serviceName}</p>
              <p className="text-xs text-slate-500">Starting at ₹{price?.toLocaleString()}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-brand-600" />
                <span>Date & Day</span>
              </span>
              <p className="font-bold text-slate-900">{date}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-brand-600" />
                <span>Time Slot</span>
              </span>
              <p className="font-extrabold text-brand-600">{time}</p>
            </div>
          </div>

          {/* Clinic Address Reminder */}
          <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-100 text-xs text-brand-900 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Clinic Address:</p>
              <p className="text-brand-800">
                SmileCare Towers, 42 Health Avenue, Metro Pillar 128, Indiranagar, Bengaluru - 560038
              </p>
              <p className="text-slate-500 pt-1">Please arrive 10 minutes before your slot.</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <a
              href={createGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-brand-400" />
              <span>Add to Google Calendar</span>
            </a>

            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=12.9784,77.6408"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-4 h-4 text-brand-600" />
                <span>Get Directions</span>
              </a>

              <a
                href="https://wa.me/919876543210?text=Hi%20SmileCare,%20I%20have%20booked%20an%20appointment."
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Us</span>
              </a>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <Link to="/" className="font-bold text-slate-600 hover:text-brand-600 transition-colors">
                ← Return to Home
              </Link>
              <Link
                to="/patient-dashboard"
                className="font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
              >
                <span>View My Appointments</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
