import React, { useState, useEffect } from 'react';
import { Cpu, Sparkles, Shield, Heart } from 'lucide-react';
import api from '../services/api';
import { EquipmentCard } from '../components/cards/EquipmentCard';
import { CardSkeleton } from '../components/common/Skeleton';

export const Technology = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');

  const categories = [
    'All',
    'Imaging & Diagnostics',
    'Treatment & Surgery',
    'Sterilization & Safety',
    'Patient Comfort',
    'Digital Dentistry',
  ];

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        let url = '/equipment';
        if (category !== 'All') url += `?category=${encodeURIComponent(category)}`;

        const res = await api.get(url);
        if (res.success) {
          setEquipment(res.equipment || []);
        }
      } catch (err) {
        console.error('Error fetching technology machines:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, [category]);

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-brand-50/80 via-slate-50 to-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
            <Cpu className="w-3.5 h-3.5" />
            <span>Digital Dental Innovations</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Advanced Dental Machines & Equipment
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Discover the state-of-the-art diagnostic and surgical technology that powers our gentle, high-precision treatments.
          </p>
        </div>
      </section>

      {/* Category Tabs & Equipment Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                category === cat
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Equipment Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : equipment.length === 0 ? (
          <div className="py-16 text-center text-slate-500 bg-white rounded-3xl border border-slate-100">
            No equipment listed under this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {equipment.map((item) => (
              <EquipmentCard key={item._id} equipment={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
