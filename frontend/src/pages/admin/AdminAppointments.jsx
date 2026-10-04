import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Phone,
  MessageCircle,
  Edit,
  RotateCcw,
  Sparkles,
  X,
  FileText
} from 'lucide-react';
import api from '../../services/api';
import { AdminNavTabs } from './AdminDashboard';
import { useToast } from '../../context/ToastContext';

export const AdminAppointments = () => {
  const toast = useToast();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [doctorFilter, setDoctorFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  // Status / Note Modal State
  const [selectedApp, setSelectedApp] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      let url = '/appointments/admin/all?limit=100';
      if (statusFilter !== 'All') url += `&status=${statusFilter}`;
      if (doctorFilter !== 'All') url += `&doctorId=${doctorFilter}`;
      if (dateFilter) url += `&date=${dateFilter}`;
      if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;

      const res = await api.get(url);
      if (res.success) {
        setAppointments(res.appointments || []);
      }
    } catch (err) {
      toast.error('Failed to load appointments list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, doctorFilter, dateFilter, search]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get('/doctors');
        if (res.success) setDoctors(res.doctors || []);
      } catch (err) {}
    };
    fetchDoctors();
  }, []);

  const handleOpenStatusModal = (app) => {
    setSelectedApp(app);
    setEditStatus(app.status);
    setEditNotes(app.doctorNotes || '');
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    setUpdating(true);
    try {
      const res = await api.put(`/appointments/admin/${selectedApp._id}/status`, {
        status: editStatus,
        doctorNotes: editNotes,
      });

      if (res.success) {
        toast.success(`Appointment status updated to ${editStatus}`);
        setSelectedApp(null);
        fetchAppointments();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Appointment Manager</h1>
        <p className="text-xs text-slate-500">Filter, confirm, update medical notes, and manage patient schedules</p>
      </div>

      <AdminNavTabs />

      {/* Filter Toolbar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Search */}
        <div>
          <label className="font-bold text-slate-700 block mb-1">Search Patient / Ref</label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Name, Phone, Email, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 font-medium outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="font-bold text-slate-700 block mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Doctor Filter */}
        <div>
          <label className="font-bold text-slate-700 block mb-1">Dentist</label>
          <select
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="All">All Doctors</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <label className="font-bold text-slate-700 block mb-1">Filter by Date</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full p-2 rounded-xl border border-slate-200 font-medium outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          />
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-4 px-5">Ref ID</th>
                <th className="py-4 px-5">Patient Details</th>
                <th className="py-4 px-5">Doctor & Service</th>
                <th className="py-4 px-5">Schedule</th>
                <th className="py-4 px-5">Fee / Payment</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    Loading appointments...
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No appointments match your filters.
                  </td>
                </tr>
              ) : (
                appointments.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5 font-mono font-bold text-slate-800">
                      {app.appointmentNumber}
                    </td>

                    {/* Patient */}
                    <td className="py-4 px-5">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900">{app.patientInfo?.name}</p>
                        <p className="text-[11px] text-slate-500">{app.patientInfo?.phone}</p>
                        <p className="text-[11px] text-slate-400">{app.patientInfo?.email}</p>
                      </div>
                    </td>

                    {/* Doctor & Service */}
                    <td className="py-4 px-5">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900">{app.doctor?.name}</p>
                        <p className="text-[11px] text-brand-700 font-semibold">{app.service?.name}</p>
                      </div>
                    </td>

                    {/* Schedule */}
                    <td className="py-4 px-5">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-800">{app.date}</p>
                        <p className="text-[11px] text-brand-600 font-bold">{app.timeSlot}</p>
                      </div>
                    </td>

                    {/* Price & Payment */}
                    <td className="py-4 px-5">
                      <div className="space-y-0.5">
                        <span className="font-black text-slate-900 text-sm">₹{app.price}</span>
                        <span className="text-[10px] text-slate-400 block">{app.paymentMethod?.split(' ')[0]}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          app.status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : app.status === 'Completed'
                            ? 'bg-blue-50 text-blue-700'
                            : app.status === 'Cancelled'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        ● {app.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`tel:${app.patientInfo?.phone}`}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                          title="Call Patient"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>

                        <a
                          href={`https://wa.me/${app.patientInfo?.phone?.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-50 text-emerald-600"
                          title="WhatsApp Patient"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>

                        <button
                          onClick={() => handleOpenStatusModal(app)}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition-colors"
                        >
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPDATE STATUS & NOTES MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-base">Update Appointment</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedApp.appointmentNumber}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Appointment Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-brand-500 bg-white"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Clinical / Doctor Notes</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Record treatment diagnosis, prescriptions, or post-op instructions..."
                  className="w-full p-3 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                ></textarea>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md"
                >
                  {updating ? 'Saving...' : 'Save Updates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
