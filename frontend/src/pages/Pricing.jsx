import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  Search,
  Sparkles,
  Calendar,
  AlertCircle,
  Clock,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';
import api from '../services/api';

export const Pricing = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await api.get('/services');
        if (res.success) {
          setServices(res.services || []);
        }
      } catch (err) {
        console.error('Pricing error loading services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-brand-50/80 via-slate-50 to-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Zero Hidden Charges</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Transparent Dental Treatment Pricing
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Honest, competitive, and itemized fee estimates for all clinical, cosmetic, and surgical dental procedures.
          </p>
        </div>
      </section>

      {/* Pricing Table Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Medical Pricing Disclaimer Alert */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs leading-relaxed flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Important Pricing Notice:</span>
            <span>
              All prices listed below are starting/indicative fees. Final treatment costs may vary depending on the severity of the case, tooth anatomy, bone density, and materials selected following clinical examination and digital radiography.
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter treatments (e.g. Whitening, Implant, Root Canal)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
            />
          </div>
          <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
            Showing {filteredServices.length} Treatments
          </span>
        </div>

        {/* Table View */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
                <tr>
                  <th className="py-4 px-6">Treatment / Procedure</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Starting Price</th>
                  <th className="py-4 px-6">Typical Duration</th>
                  <th className="py-4 px-6">Visits</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400">
                      Loading dental treatment pricing...
                    </td>
                  </tr>
                ) : filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400">
                      No treatments match your search term.
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((s) => (
                    <tr key={s._id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-4 px-6">
                        <Link
                          to={`/services/${s.slug || s._id}`}
                          className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors"
                        >
                          {s.name}
                        </Link>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                          {s.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-extrabold text-brand-700 text-base">
                        Starting from ₹{s.startingPrice?.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-slate-600">{s.durationMinutes || '30-45 min'}</td>
                      <td className="py-4 px-6 text-slate-600">{s.visitsRequired || '1-2 visits'}</td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          to={`/booking?serviceId=${s._id}`}
                          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all inline-flex items-center gap-1"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Book</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
