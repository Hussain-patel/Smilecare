import React, { useState, useEffect } from 'react';
import { Search, Stethoscope, Sparkles } from 'lucide-react';
import api from '../services/api';
import { ServiceCard } from '../components/cards/ServiceCard';
import { CardSkeleton } from '../components/common/Skeleton';

export const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  const categories = [
    'All',
    'Preventive Dentistry',
    'Cosmetic Dentistry',
    'Restorative Dentistry',
    'Orthodontics',
    'Endodontics',
    'Oral Surgery',
    'Pediatric Dentistry',
    'Periodontics',
    'Emergency Care',
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        let url = '/services';
        const params = [];
        if (category !== 'All') params.push(`category=${encodeURIComponent(category)}`);
        if (search.trim()) params.push(`search=${encodeURIComponent(search.trim())}`);
        if (params.length > 0) url += `?${params.join('&')}`;

        const res = await api.get(url);
        if (res.success) {
          setServices(res.services || []);
        }
      } catch (err) {
        console.error('Error fetching dental services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [category, search]);

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-brand-50/80 via-slate-50 to-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Comprehensive Dental Treatments</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Our Dental Treatments & Services
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Pain-free clinical procedures backed by 3D digital imaging, specialized MDS dentists, and transparent starting prices.
          </p>
        </div>
      </section>

      {/* Filter and Search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search treatment (e.g. Root Canal, Implants)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  category === cat
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : services.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-3 bg-white rounded-3xl border border-slate-100">
            <Sparkles className="w-8 h-8 text-brand-400 mx-auto" />
            <p className="font-bold text-slate-800">No services match your search filter</p>
            <button
              onClick={() => {
                setSearch('');
                setCategory('All');
              }}
              className="text-xs font-bold text-brand-600 hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
