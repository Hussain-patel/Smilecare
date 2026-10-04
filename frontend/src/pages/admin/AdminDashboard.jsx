import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Calendar,
  Users,
  Stethoscope,
  Star,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Shield,
  Activity,
  ArrowRight,
  Sparkles,
  Bell,
  Cpu,
  Image,
  Settings
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const AdminNavTabs = () => {
  const tabs = [
    { name: 'Analytics Overview', path: '/admin' },
    { name: 'Appointments', path: '/admin/appointments' },
    { name: 'Doctors', path: '/admin/doctors' },
    { name: 'Services', path: '/admin/services' },
    { name: 'Gallery & Cases', path: '/admin/gallery' },
    { name: 'Equipment', path: '/admin/equipment' },
    { name: 'Reviews', path: '/admin/reviews' },
    { name: 'Clinic Settings', path: '/admin/settings' },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
      {tabs.map((t) => (
        <NavLink
          key={t.path}
          to={t.path}
          end={t.path === '/admin'}
          className={({ isActive }) =>
            `px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              isActive
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`
          }
        >
          {t.name}
        </NavLink>
      ))}
    </div>
  );
};

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [statsRes, appsRes, notifRes] = await Promise.all([
          api.get('/clinic/admin/stats'),
          api.get('/appointments/admin/all?limit=5'),
          api.get('/clinic/admin/notifications'),
        ]);

        if (statsRes.success) setStats(statsRes.stats);
        if (appsRes.success) setRecentAppointments(appsRes.appointments || []);
        if (notifRes.success) setNotifications(notifRes.notifications || []);
      } catch (err) {
        console.error('Admin dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-500 font-semibold">Loading clinic analytics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
            <Shield className="w-3.5 h-3.5" />
            <span>Clinic Director Control Center</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Overview Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/appointments"
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Manage All Bookings</span>
          </Link>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <AdminNavTabs />

      {/* 1. Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Today's Bookings</span>
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{stats?.todayAppointments || 0}</p>
          <span className="text-[11px] text-slate-400 font-medium">Scheduled for today</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Total Appointments</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{stats?.totalAppointments || 0}</p>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
            <span className="text-emerald-600 font-bold">{stats?.confirmedAppointments || 0} Confirmed</span>
            <span>•</span>
            <span className="text-blue-600 font-bold">{stats?.completedAppointments || 0} Completed</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Estimated Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-700">₹{(stats?.totalRevenue || 0).toLocaleString()}</p>
          <span className="text-[11px] text-slate-400 font-medium">From active & completed cases</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Clinical Doctors</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{stats?.totalDoctors || 5}</p>
          <span className="text-[11px] text-slate-400 font-medium">Across all dental sub-specialties</span>
        </div>
      </div>

      {/* 2. Grid: Recent Appointments & Service Popularity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Bookings Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-base">Latest Appointments</h3>
            <Link to="/admin/appointments" className="text-xs font-bold text-brand-600 hover:underline">
              View All →
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {recentAppointments.map((app) => (
              <div key={app._id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 truncate">{app.patientInfo?.name}</span>
                    <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
                      {app.appointmentNumber}
                    </span>
                  </div>
                  <p className="text-slate-500 truncate">
                    {app.service?.name} with <strong>{app.doctor?.name}</strong>
                  </p>
                  <p className="text-[11px] text-brand-700 font-semibold">
                    📅 {app.date} at {app.timeSlot}
                  </p>
                </div>

                <div className="text-right flex flex-col items-end gap-1">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      app.status === 'Confirmed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : app.status === 'Completed'
                        ? 'bg-blue-50 text-blue-700'
                        : app.status === 'Cancelled'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {app.status}
                  </span>
                  <span className="font-bold text-slate-800">₹{app.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Most Booked Services & Notification Stream (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Most Booked Services */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4">
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-600" />
              <span>Top Booked Treatments</span>
            </h3>

            <div className="space-y-3">
              {stats?.servicePopularity?.map((sp, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>{sp.name}</span>
                    <span className="text-brand-600">{sp.count} bookings</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full"
                      style={{ width: `${Math.min(sp.count * 20, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Simulated Notifications Feed */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Simulated Notification Log</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                Email & WhatsApp
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
              {notifications.slice(0, 4).map((n) => (
                <div key={n.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-[11px]">{n.patientName}</span>
                    <span className="text-[10px] text-slate-400">{n.appointmentNumber}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-1 italic">
                    "{n.whatsappContent || n.emailContent}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
