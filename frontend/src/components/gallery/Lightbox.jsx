import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export const Lightbox = ({ items, currentIndex, isOpen, onClose, onPrev, onNext }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || !items || items.length === 0) return null;

  const currentItem = items[currentIndex] || items[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md animate-fadeIn">
      {/* Top Bar Controls */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10 text-white">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold backdrop-blur-md">
            {currentIndex + 1} / {items.length}
          </span>
          <span className="text-sm font-semibold text-brand-300 hidden sm:inline">
            {currentItem.category}
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Close Lightbox"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Prev Button */}
      <button
        onClick={onPrev}
        className="absolute left-4 sm:left-8 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all transform hover:scale-110 z-10"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Main Image & Caption */}
      <div className="max-w-5xl max-h-[85vh] p-4 flex flex-col items-center justify-center space-y-4">
        <img
          src={currentItem.image}
          alt={currentItem.title}
          className="max-h-[70vh] max-w-full object-contain rounded-2xl shadow-2xl transition-all duration-300"
        />
        <div className="text-center text-white space-y-1 max-w-2xl px-4">
          <h4 className="text-lg font-bold">{currentItem.title}</h4>
          {currentItem.caption && (
            <p className="text-xs text-slate-300 font-normal">{currentItem.caption}</p>
          )}
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        className="absolute right-4 sm:right-8 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all transform hover:scale-110 z-10"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};
