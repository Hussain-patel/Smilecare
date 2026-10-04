import React, { useState, useEffect } from 'react';
import { Camera, Sparkles, Eye } from 'lucide-react';
import api from '../services/api';
import { Lightbox } from '../components/gallery/Lightbox';

export const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const categories = [
    'All',
    'Clinic Exterior',
    'Reception & Lounge',
    'Treatment Rooms',
    'Sterilization Area',
    'Dental Equipment',
    'Doctors & Staff',
    'Pediatric Corner',
    'Clinic Events',
  ];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        let url = '/gallery';
        if (category !== 'All') url += `?category=${encodeURIComponent(category)}`;

        const res = await api.get(url);
        if (res.success) {
          setItems(res.items || []);
        }
      } catch (err) {
        console.error('Gallery loading error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, [category]);

  const handleOpenLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-brand-50/80 via-slate-50 to-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold">
            <Camera className="w-3.5 h-3.5" />
            <span>Visual Clinic Tour</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Clinic Interior & Infrastructure Gallery
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Take a visual walkthrough of our calm reception lounge, surgical suites, and European sterilization bays.
          </p>
        </div>
      </section>

      {/* Categories & Photo Grid */}
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

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-200 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-slate-500 bg-white rounded-3xl border border-slate-100">
            No photos found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <div
                key={item._id}
                onClick={() => handleOpenLightbox(index)}
                className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer shadow-card hover:shadow-card-hover border border-slate-100 transition-all duration-300 transform hover:-translate-y-1 bg-slate-900"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                {/* Category Pill */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-slate-900 shadow-sm">
                  {item.category}
                </div>

                {/* View Icon on Hover */}
                <div className="absolute top-4 right-4 p-2 rounded-full bg-brand-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                  <Eye className="w-4 h-4" />
                </div>

                {/* Caption Overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <h3 className="font-bold text-base leading-snug drop-shadow-sm">{item.title}</h3>
                  {item.caption && (
                    <p className="text-xs text-slate-300 line-clamp-1">{item.caption}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      <Lightbox
        items={items}
        currentIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
};
