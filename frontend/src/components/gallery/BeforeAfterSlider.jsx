import React, { useState, useRef } from 'react';
import { Sparkles, Clock, CheckCircle } from 'lucide-react';

export const BeforeAfterSlider = ({ item }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  if (!item) return null;

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percent = (x / rect.width) * 100;
    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;
    setSliderPosition(percent);
  };

  const handleTouchMove = (e) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col">
      {/* Slider Visual Container */}
      <div
        ref={containerRef}
        className="relative h-72 sm:h-80 w-full overflow-hidden select-none cursor-ew-resize bg-slate-900"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* "AFTER" Image (Base / Full background) */}
        <img
          src={item.afterImage}
          alt={`After: ${item.title}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-xs font-extrabold shadow-md z-10">
          AFTER ✓
        </div>

        {/* "BEFORE" Image (Clipped by slider position) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={item.beforeImage}
            alt={`Before: ${item.title}`}
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
          />
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-xs font-extrabold shadow-md z-10">
            BEFORE
          </div>
        </div>

        {/* Divider Handle Bar */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-20 cursor-ew-resize"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-slate-800 shadow-xl border-2 border-brand-500 flex items-center justify-center text-xs font-black select-none">
            ⇄
          </div>
        </div>

        {/* Drag Hint */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900/60 backdrop-blur-md text-white text-[10px] font-semibold pointer-events-none">
          Drag slider left / right to compare
        </div>
      </div>

      {/* Details Box */}
      <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-md">
              {item.category}
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{item.duration || '2 weeks'}</span>
            </div>
          </div>

          <h3 className="font-bold text-slate-900 text-base leading-snug">{item.title}</h3>
          {item.description && (
            <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Treatment: <strong className="text-slate-800">{item.treatmentType}</strong></span>
          {item.doctor?.name && (
            <span className="text-brand-700 font-semibold">{item.doctor.name}</span>
          )}
        </div>
      </div>
    </div>
  );
};
