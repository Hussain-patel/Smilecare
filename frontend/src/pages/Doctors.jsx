import React, { useState, useEffect } from 'react';
import { Search, User, Sparkles, Filter } from 'lucide-react';
import api from '../services/api';
import { DoctorCard } from '../components/cards/DoctorCard';
import { DoctorSkeleton } from '../components/common/Skeleton';

export const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const specialties = [
    'All',
    'Dental Implants',
    'Oral & Maxillofacial Surgery',
    'Invisalign & Clear Aligners',
    'Orthodontics',
    'Root Canal Treatment',
    'Pediatric Dentistry',
    'Cosmetic Dentistry',
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        let url = '/doctors';
        const params = [];
        if (selectedSpecialty !== 'All') params.push(`specialization=${encodeURIComponent(selectedSpecialty)}`);
        if (search.trim()) params.push(`search=${encodeURIComponent(search.trim())}`);
        if (params.length > 0) url += `?${params.join('&')}`;

        const res = await api.get(url);
        if (res.success) {
          setDoctors(res.doctors || []);
        }
      } catch (err) {
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [selectedSpecialty, search]);

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-brand-50/80 via-slate-50 to-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-100 text-accent-800 text-xs font-bold">
            <User className="w-3.5 h-3.5" />
            <span>Specialist Clinical Faculty</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Meet Our Senior Dental Surgeons
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Our multi-disciplinary team brings decades of hospital-trained surgical, orthodontic, and aesthetic dental expertise.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by doctor name or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
            />
          </div>

          {/* Specialty Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {specialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedSpecialty === spec
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DoctorSkeleton />
            <DoctorSkeleton />
            <DoctorSkeleton />
          </div>
        ) : doctors.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-3 bg-white rounded-3xl border border-slate-100">
            <Sparkles className="w-8 h-8 text-brand-400 mx-auto" />
            <p className="font-bold text-slate-800">No doctors match your search filter</p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedSpecialty('All');
              }}
              className="text-xs font-bold text-brand-600 hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
