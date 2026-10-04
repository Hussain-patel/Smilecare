import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  XCircle,
  RotateCcw,
  CheckCircle,
  MessageSquare,
  Sparkles,
  Phone,
  Edit,
  Save,
  X
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const PatientDashboard = () => {
  const { user, updateProfile } = useAuth();
  const toast = useToast();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  // Cancel Modal State
  const [cancelModal, setCancelModal] = useState({ open: false, app: null, reason: '' });
  const [cancelling, setCancelling] = useState(false);

  // Reschedule Modal State
  const [rescheduleModal, setRescheduleModal] = useState({
    open: false,
    app: null,
    date: '',
    slot: '',
    slots: [],
    slotsLoading: false,
  });
  const [rescheduling, setRescheduling] = useState(false);

  // Profile Edit Modal State
  const [profileModal, setProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    age: user?.age || '',
    gender: user?.gender || 'Prefer not to say',
  });

  const fetchMyAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/appointments/my-appointments');
      if (res.success) {
        setAppointments(res.appointments || []);
      }
    } catch (err) {
      console.error('Error fetching patient appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyAppointments();
  }, []);

  // Filter appointments by tab
  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'Pending' || a.status === 'Confirmed'
  );
  const completedAppointments = appointments.filter((a) => a.status === 'Completed');
  const cancelledAppointments = appointments.filter((a) => a.status === 'Cancelled');

  const displayedAppointments =
    activeTab === 'upcoming'
      ? upcomingAppointments
      : activeTab === 'completed'
      ? completedAppointments
      : cancelledAppointments;

  // Handle Cancellation
  const handleConfirmCancel = async () => {
    if (!cancelModal.app) return;
    setCancelling(true);
    try {
      const res = await api.put(`/appointments/${cancelModal.app._id}/cancel`, {
        cancellationReason: cancelModal.reason || 'Cancelled by patient',
      });
      if (res.success) {
        toast.success('Appointment cancelled successfully.');
        setCancelModal({ open: false, app: null, reason: '' });
        fetchMyAppointments();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to cancel appointment.');
    } finally {
      setCancelling(false);
    }
  };

  // Open Reschedule Modal & Fetch Slots
  const handleOpenReschedule = async (app) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDate = tomorrow.toISOString().split('T')[0];

    setRescheduleModal({
      open: true,
      app,
      date: defaultDate,
      slot: '',
      slots: [],
      slotsLoading: true,
    });

    try {
      const res = await api.get(`/doctors/${app.doctor._id || app.doctor}/slots?date=${defaultDate}`);
      if (res.success && res.data) {
        setRescheduleModal((prev) => ({
          ...prev,
          slots: res.data.slots || [],
          slotsLoading: false,
        }));
      }
    } catch (err) {
      setRescheduleModal((prev) => ({ ...prev, slotsLoading: false }));
    }
  };

  const handleDateChangeForReschedule = async (newDate) => {
    if (!rescheduleModal.app) return;
    setRescheduleModal((prev) => ({ ...prev, date: newDate, slotsLoading: true, slot: '' }));
    try {
      const doctorId = rescheduleModal.app.doctor._id || rescheduleModal.app.doctor;
      const res = await api.get(`/doctors/${doctorId}/slots?date=${newDate}`);
      if (res.success && res.data) {
        setRescheduleModal((prev) => ({
          ...prev,
          slots: res.data.slots || [],
          slotsLoading: false,
        }));
      }
    } catch (err) {
      setRescheduleModal((prev) => ({ ...prev, slotsLoading: false }));
    }
  };

  const handleConfirmReschedule = async () => {
    if (!rescheduleModal.date || !rescheduleModal.slot) {
      toast.error('Please select both a new date and available time slot.');
      return;
    }

    setRescheduling(true);
    try {
      const res = await api.put(`/appointments/${rescheduleModal.app._id}/reschedule`, {
        date: rescheduleModal.date,
        timeSlot: rescheduleModal.slot,
      });
      if (res.success) {
        toast.success('Appointment rescheduled successfully!');
        setRescheduleModal({ open: false, app: null, date: '', slot: '', slots: [], slotsLoading: false });
        fetchMyAppointments();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to reschedule appointment.');
    } finally {
      setRescheduling(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileForm);
      toast.success('Profile updated successfully.');
      setProfileModal(false);
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-20">
      {/* Patient Header Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-teal-400 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-brand-500/20 uppercase">
            {user?.name?.charAt(0) || 'P'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{user?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold">
                Patient
              </span>
            </div>
            <p className="text-xs text-slate-500">{user?.email} • {user?.phone || 'No phone'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => {
              setProfileForm({
                name: user?.name || '',
                phone: user?.phone || '',
                age: user?.age || '',
                gender: user?.gender || 'Prefer not to say',
              });
              setProfileModal(true);
            }}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>

          <Link
            to="/booking"
            className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Book New Appointment</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-bold">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`pb-2 transition-colors relative ${
                activeTab === 'upcoming'
                  ? 'text-brand-600 border-b-2 border-brand-600'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Upcoming ({upcomingAppointments.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`pb-2 transition-colors relative ${
                activeTab === 'completed'
                  ? 'text-brand-600 border-b-2 border-brand-600'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Completed ({completedAppointments.length})
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`pb-2 transition-colors relative ${
                activeTab === 'cancelled'
                  ? 'text-brand-600 border-b-2 border-brand-600'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Cancelled ({cancelledAppointments.length})
            </button>
          </div>
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-500">Loading your dental appointments...</p>
          </div>
        ) : displayedAppointments.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm space-y-4">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">
              No {activeTab} dental appointments found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Schedule your next dental cleaning, checkup, or consultation with our specialists.
            </p>
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment Now</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedAppointments.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between space-y-5"
              >
                {/* Header with App Number & Status */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-mono font-bold text-slate-700">
                    {app.appointmentNumber}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                      app.status === 'Confirmed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : app.status === 'Completed'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : app.status === 'Cancelled'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    ● {app.status}
                  </span>
                </div>

                {/* Body Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={app.doctor?.photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop'}
                      alt={app.doctor?.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{app.doctor?.name}</h4>
                      <p className="text-xs text-brand-700 font-medium">{app.service?.name}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Date</span>
                      <strong className="text-slate-800">{app.date}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Time Slot</span>
                      <strong className="text-brand-700">{app.timeSlot}</strong>
                    </div>
                  </div>

                  {app.cancellationReason && (
                    <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl">
                      <strong>Cancellation Reason:</strong> {app.cancellationReason}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  {app.status === 'Confirmed' || app.status === 'Pending' ? (
                    <>
                      <button
                        onClick={() => handleOpenReschedule(app)}
                        className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reschedule</span>
                      </button>

                      <button
                        onClick={() => setCancelModal({ open: true, app, reason: '' })}
                        className="py-2 px-3 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-xs transition-colors flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    </>
                  ) : app.status === 'Completed' ? (
                    <Link
                      to="/reviews"
                      className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Leave Patient Review</span>
                    </Link>
                  ) : (
                    <Link
                      to={`/booking?doctorId=${app.doctor?._id || ''}`}
                      className="w-full py-2.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Re-book Appointment</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CANCEL MODAL */}
      {cancelModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-black text-slate-900">Cancel Appointment?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to cancel your appointment with{' '}
              <strong>{cancelModal.app?.doctor?.name}</strong> on {cancelModal.app?.date} at{' '}
              {cancelModal.app?.timeSlot}?
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Reason for Cancellation</label>
              <textarea
                rows={2}
                value={cancelModal.reason}
                onChange={(e) => setCancelModal({ ...cancelModal, reason: e.target.value })}
                placeholder="e.g. Schedule conflict, feeling better..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
              ></textarea>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModal({ open: false, app: null, reason: '' })}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
              >
                Keep Appointment
              </button>

              <button
                type="button"
                disabled={cancelling}
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/20"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      {rescheduleModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">Reschedule Appointment</h3>
              <button
                onClick={() =>
                  setRescheduleModal({ open: false, app: null, date: '', slot: '', slots: [], slotsLoading: false })
                }
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pick Date */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Select New Date</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={rescheduleModal.date}
                onChange={(e) => handleDateChangeForReschedule(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            {/* Pick Slot */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Select New Available Time Slot</label>
              {rescheduleModal.slotsLoading ? (
                <p className="text-xs text-slate-400 py-4 text-center">Loading doctor availability...</p>
              ) : rescheduleModal.slots.length === 0 ? (
                <p className="text-xs text-rose-500 py-4 text-center">No available slots on this date.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                  {rescheduleModal.slots.map((s, idx) => {
                    const isSelected = rescheduleModal.slot === s.time;
                    const isBooked = !s.isAvailable;
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setRescheduleModal((prev) => ({ ...prev, slot: s.time }))}
                        className={`p-2 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-brand-600 text-white shadow-sm'
                            : isBooked
                            ? 'bg-slate-100 text-slate-300 line-through cursor-not-allowed'
                            : 'bg-slate-50 hover:bg-brand-50 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {s.time}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() =>
                  setRescheduleModal({ open: false, app: null, date: '', slot: '', slots: [], slotsLoading: false })
                }
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={rescheduling || !rescheduleModal.slot}
                onClick={handleConfirmReschedule}
                className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 disabled:opacity-50"
              >
                {rescheduling ? 'Saving...' : 'Save New Slot'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {profileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">Update Profile</h3>
              <button onClick={() => setProfileModal(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Age</label>
                  <input
                    type="number"
                    value={profileForm.age}
                    onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={profileForm.gender}
                    onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md mt-2"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
