import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle2,
  Stethoscope,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  AlertCircle,
  CreditCard,
  Building,
  Sparkles,
  Info
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Booking = () => {
  const [searchParams] = useSearchParams();
  const preselectedDoctorId = searchParams.get('doctorId');
  const preselectedServiceId = searchParams.get('serviceId');
  const urgency = searchParams.get('urgency');

  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Multi-step state (1: Doctor & Service, 2: Date & Slot, 3: Patient Info, 4: Review & Confirm)
  const [currentStep, setCurrentStep] = useState(1);

  // Data sources
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Booking Form State
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsMessage, setSlotsMessage] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  // Patient Info Form
  const [patientInfo, setPatientInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    age: user?.age || '',
    gender: user?.gender || 'Prefer not to say',
    isNewPatient: true,
    reasonForVisit: urgency === 'emergency' ? 'Emergency Dental Care' : '',
    patientNotes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('Pay at Clinic (Cash/Card/UPI)');
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Fetch doctors and services
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingInitial(true);
        const [docsRes, svcsRes] = await Promise.all([
          api.get('/doctors'),
          api.get('/services'),
        ]);

        if (docsRes.success) setDoctors(docsRes.doctors || []);
        if (svcsRes.success) setServices(svcsRes.services || []);

        // Handle pre-selection if URL query params exist
        if (preselectedDoctorId && docsRes.doctors) {
          const doc = docsRes.doctors.find((d) => d._id === preselectedDoctorId);
          if (doc) setSelectedDoctor(doc);
        }
        if (preselectedServiceId && svcsRes.services) {
          const svc = svcsRes.services.find((s) => s._id === preselectedServiceId);
          if (svc) setSelectedService(svc);
        }

        // Set default minimum date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + (urgency === 'emergency' ? 0 : 1));
        const defaultDateStr = tomorrow.toISOString().split('T')[0];
        setSelectedDate(defaultDateStr);
      } catch (err) {
        toast.error('Failed to load clinic booking data.');
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchData();
  }, [preselectedDoctorId, preselectedServiceId, urgency]);

  // Sync patient info if user logs in
  useEffect(() => {
    if (user) {
      setPatientInfo((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        age: prev.age || user.age || '',
        gender: prev.gender !== 'Prefer not to say' ? prev.gender : user.gender || 'Prefer not to say',
      }));
    }
  }, [user]);

  // Fetch slots whenever selected doctor or date changes
  useEffect(() => {
    if (!selectedDoctor || !selectedDate) {
      setAvailableSlots([]);
      return;
    }

    const fetchSlots = async () => {
      setSlotsLoading(true);
      setSlotsMessage('');
      try {
        const res = await api.get(`/doctors/${selectedDoctor._id}/slots?date=${selectedDate}`);
        if (res.success && res.data) {
          setAvailableSlots(res.data.slots || []);
          if (!res.data.isAvailableDay) {
            setSlotsMessage(res.data.message || 'Doctor is not available on this day');
          }
        }
      } catch (err) {
        setSlotsMessage('Error calculating slot availability. Please try another date.');
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDoctor, selectedDate]);

  // Validation before proceeding steps
  const handleNextStep = () => {
    const errors = {};

    if (currentStep === 1) {
      if (!selectedService) errors.service = 'Please select a dental service/treatment';
      if (!selectedDoctor) errors.doctor = 'Please select a dentist';
    } else if (currentStep === 2) {
      if (!selectedDate) errors.date = 'Please choose an appointment date';
      if (!selectedSlot) errors.slot = 'Please select an available time slot';
    } else if (currentStep === 3) {
      if (!patientInfo.name.trim()) errors.name = 'Patient name is required';
      if (!patientInfo.phone.trim()) errors.phone = 'Phone number is required';
      if (!patientInfo.email.trim()) errors.email = 'Email address is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setCurrentStep((prev) => prev + 1);
  };

  // Submit Final Booking
  const handleConfirmBooking = async () => {
    setSubmitting(true);
    try {
      const payload = {
        doctorId: selectedDoctor._id,
        serviceId: selectedService._id,
        date: selectedDate,
        timeSlot: selectedSlot,
        patientInfo: {
          name: patientInfo.name,
          email: patientInfo.email,
          phone: patientInfo.phone,
          age: patientInfo.age ? Number(patientInfo.age) : undefined,
          gender: patientInfo.gender,
          isNewPatient: patientInfo.isNewPatient,
        },
        reasonForVisit: patientInfo.reasonForVisit || selectedService.name,
        patientNotes: patientInfo.patientNotes,
        paymentMethod,
      };

      const res = await api.post('/appointments', payload);
      if (res.success && res.appointment) {
        toast.success('Appointment booked successfully!');
        navigate(`/booking-success/${res.appointment._id || res.appointment.appointmentNumber}`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to complete booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen py-20 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-semibold">Loading SmileCare booking calendar...</p>
      </div>
    );
  }

  const estimatedFee = selectedService?.startingPrice || selectedDoctor?.consultationFee || 500;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Title Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Online Booking</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Schedule Your Dental Visit
          </h1>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Choose your specialist, procedure, and preferred time. Pain-free treatment with zero double-booking.
          </p>
        </div>

        {/* Step Progress Tracker */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
            {[
              { num: 1, label: 'Treatment & Doctor' },
              { num: 2, label: 'Date & Time' },
              { num: 3, label: 'Patient Details' },
              { num: 4, label: 'Confirmation' },
            ].map((s) => (
              <div
                key={s.num}
                className={`py-2 px-1 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                  currentStep === s.num
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                    : currentStep > s.num
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-400 bg-slate-50'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                  {currentStep > s.num ? '✓' : s.num}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Step Cards */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card">
          {/* STEP 1: SERVICE & DOCTOR SELECTION */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-fadeIn">
              {/* 1A: Select Service */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-brand-600" />
                    <span>1. Select Treatment / Service</span>
                  </label>
                  {formErrors.service && (
                    <span className="text-xs font-bold text-rose-500">{formErrors.service}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {services.map((svc) => {
                    const isSelected = selectedService?._id === svc._id;
                    return (
                      <div
                        key={svc._id}
                        onClick={() => {
                          setSelectedService(svc);
                          setFormErrors((prev) => ({ ...prev, service: null }));
                        }}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                          isSelected
                            ? 'border-brand-600 bg-brand-50/60 shadow-glow'
                            : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="font-bold text-slate-900 text-sm leading-snug">
                            {svc.name}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2">{svc.shortDescription}</p>
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-slate-400">{svc.durationMinutes}</span>
                          <span className="font-extrabold text-brand-700">₹{svc.startingPrice?.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 1B: Select Doctor */}
              <div className="space-y-3 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4 text-brand-600" />
                    <span>2. Select Dentist Specialist</span>
                  </label>
                  {formErrors.doctor && (
                    <span className="text-xs font-bold text-rose-500">{formErrors.doctor}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {doctors.map((doc) => {
                    const isSelected = selectedDoctor?._id === doc._id;
                    return (
                      <div
                        key={doc._id}
                        onClick={() => {
                          setSelectedDoctor(doc);
                          setFormErrors((prev) => ({ ...prev, doctor: null }));
                        }}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'border-brand-600 bg-brand-50/60 shadow-glow'
                            : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50'
                        }`}
                      >
                        <img
                          src={doc.photo}
                          alt={doc.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-sm truncate">{doc.name}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0 ml-1" />}
                          </div>
                          <p className="text-[11px] text-brand-700 font-semibold truncate">{doc.specialization?.[0]}</p>
                          <p className="text-[10px] text-slate-400">{doc.experienceYears}+ yrs • ★ {doc.rating || '4.9'}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DATE & TIME SLOTS */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedDoctor?.photo}
                    alt={selectedDoctor?.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <p className="text-xs text-brand-800 font-medium">Selected Specialist</p>
                    <p className="text-sm font-bold text-slate-900">{selectedDoctor?.name}</p>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-600">
                  <span className="block text-slate-400">Treatment</span>
                  <span className="font-bold text-slate-900">{selectedService?.name}</span>
                </div>
              </div>

              {/* Date Picker */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Select Appointment Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full sm:w-72 p-3.5 rounded-xl border border-slate-300 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                {formErrors.date && <p className="text-xs font-bold text-rose-500">{formErrors.date}</p>}
              </div>

              {/* Real-time Slots Grid */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Available Time Slots for {selectedDate}
                  </label>
                  {formErrors.slot && <span className="text-xs font-bold text-rose-500">{formErrors.slot}</span>}
                </div>

                {slotsLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center space-y-2 text-slate-400">
                    <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs">Checking real-time doctor availability...</p>
                  </div>
                ) : slotsMessage ? (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
                    <span>{slotsMessage}</span>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
                    No time slots available for this date. Please pick another date.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                    {availableSlots.map((slot, i) => {
                      const isSelected = selectedSlot === slot.time;
                      const isBooked = !slot.isAvailable;

                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={isBooked}
                          onClick={() => {
                            setSelectedSlot(slot.time);
                            setFormErrors((prev) => ({ ...prev, slot: null }));
                          }}
                          className={`p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30'
                              : isBooked
                              ? 'bg-slate-100 text-slate-300 cursor-not-allowed line-through'
                              : 'bg-slate-50 hover:bg-brand-50 hover:text-brand-700 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{slot.time}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: PATIENT DETAILS */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Patient Contact & Medical Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={patientInfo.name}
                    onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
                  />
                  {formErrors.name && <p className="text-xs text-rose-500 mt-1 font-bold">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    value={patientInfo.phone}
                    onChange={(e) => setPatientInfo({ ...patientInfo, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
                  />
                  {formErrors.phone && <p className="text-xs text-rose-500 mt-1 font-bold">{formErrors.phone}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={patientInfo.email}
                    onChange={(e) => setPatientInfo({ ...patientInfo, email: e.target.value })}
                    placeholder="e.g. rahul.s@gmail.com"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
                  />
                  {formErrors.email && <p className="text-xs text-rose-500 mt-1 font-bold">{formErrors.email}</p>}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Age</label>
                    <input
                      type="number"
                      value={patientInfo.age}
                      onChange={(e) => setPatientInfo({ ...patientInfo, age: e.target.value })}
                      placeholder="e.g. 28"
                      className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Gender</label>
                    <select
                      value={patientInfo.gender}
                      onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Chief Concern / Reason for Visit</label>
                  <input
                    type="text"
                    value={patientInfo.reasonForVisit}
                    onChange={(e) => setPatientInfo({ ...patientInfo, reasonForVisit: e.target.value })}
                    placeholder="e.g. Upper tooth sensitivity when drinking cold water"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Additional Patient Medical Notes (Optional)</label>
                  <textarea
                    rows={2}
                    value={patientInfo.patientNotes}
                    onChange={(e) => setPatientInfo({ ...patientInfo, patientNotes: e.target.value })}
                    placeholder="e.g. Allergic to penicillin, diabetic, past dental anxiety..."
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SUMMARY & PAYMENT CONFIRMATION */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Review & Confirm Appointment
              </h3>

              {/* Summary Card */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Doctor</span>
                    <span className="text-base font-bold text-slate-900">{selectedDoctor?.name}</span>
                    <span className="text-xs text-slate-500 block">{selectedDoctor?.specialization?.[0]}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Treatment / Service</span>
                    <span className="text-base font-bold text-brand-700">{selectedService?.name}</span>
                    <span className="text-xs text-slate-500 block">Est. Duration: {selectedService?.durationMinutes}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-slate-200 text-sm">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Date & Slot</span>
                    <span className="font-bold text-slate-800">{selectedDate}</span>
                    <span className="text-xs text-brand-600 font-extrabold block">at {selectedSlot}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Patient</span>
                    <span className="font-bold text-slate-800">{patientInfo.name}</span>
                    <span className="text-xs text-slate-500 block">{patientInfo.phone}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Estimated Fee</span>
                    <span className="text-lg font-black text-slate-900">₹{estimatedFee.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 block">Pay at Clinic or Online</span>
                  </div>
                </div>

                {/* Payment Mode Selector */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Choose Payment Method
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      onClick={() => setPaymentMethod('Pay at Clinic (Cash/Card/UPI)')}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                        paymentMethod.includes('Pay at Clinic')
                          ? 'border-brand-600 bg-brand-50/50'
                          : 'border-slate-200 hover:bg-slate-100/60'
                      }`}
                    >
                      <Building className="w-5 h-5 text-brand-600" />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Pay at Clinic</span>
                        <span className="text-[11px] text-slate-500">Cash, Card, or UPI after consultation</span>
                      </div>
                    </label>

                    <label
                      onClick={() => setPaymentMethod('Online (Card/UPI/NetBanking)')}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                        paymentMethod.includes('Online')
                          ? 'border-brand-600 bg-brand-50/50'
                          : 'border-slate-200 hover:bg-slate-100/60'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-accent-600" />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Online Payment (Instant)</span>
                        <span className="text-[11px] text-slate-500">UPI, Credit/Debit Card, NetBanking</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Step Buttons */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/25 hover:shadow-lg transition-all flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={handleConfirmBooking}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-xl shadow-emerald-600/30 hover:shadow-2xl transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Confirming Appointment...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Confirm & Book Appointment</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
