import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import api from '../services/api';
import { BeforeAfterSlider } from '../components/gallery/BeforeAfterSlider';

export const BeforeAfter = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');

  const categories = [
    'All',
    'Teeth Whitening',
    'Orthodontics / Braces',
    'Dental Implants',
    'Cosmetic Veneers',
  ];

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        let url = '/gallery/before-after';
        if (category !== 'All') url += `?category=${encodeURIComponent(category)}`;

        const res = await api.get(url);
        if (res.success) {
          setCases(res.cases || []);
        }
      } catch (err) {
        console.error('Before & After loading error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, [category]);

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-brand-50/80 via-slate-50 to-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Documented Smile Transformations</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Before & After Clinical Results
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Witness the artistic and restorative transformations achieved by our dental surgeons. Drag the slider to compare.
          </p>
        </div>
      </section>

      {/* Category Tabs & Slider Grid */}
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

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-slate-200 rounded-3xl animate-pulse"></div>
            <div className="h-96 bg-slate-200 rounded-3xl animate-pulse"></div>
          </div>
        ) : cases.length === 0 ? (
          <div className="py-16 text-center text-slate-500 bg-white rounded-3xl border border-slate-100">
            No transformation cases found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cases.map((item) => (
              <BeforeAfterSlider key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
