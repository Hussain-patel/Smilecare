import React from 'react';
import { Cpu, CheckCircle, Shield, Heart } from 'lucide-react';

export const EquipmentCard = ({ equipment }) => {
  if (!equipment) return null;

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col group hover:-translate-y-1">
      {/* Machine Photo */}
      <div className="relative h-56 overflow-hidden bg-slate-900">
        <img
          src={equipment.image || 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop'}
          alt={equipment.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

        {/* Category Pill */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-xs font-bold text-brand-300 border border-brand-500/30">
          {equipment.category}
        </div>

        {/* Status Pill */}
        <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[11px] font-bold shadow flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          <span>{equipment.status || 'Active & In-Use'}</span>
        </div>

        {/* Machine Name */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <h3 className="text-lg font-black tracking-tight leading-snug">{equipment.name}</h3>
          {equipment.brandModel && (
            <p className="text-xs text-slate-300 font-medium">{equipment.brandModel}</p>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Purpose & Function
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">{equipment.purpose}</p>
          </div>

          {/* Benefits List */}
          {equipment.benefits?.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 block">
                Key Clinical Advantages
              </span>
              <ul className="space-y-1">
                {equipment.benefits.slice(0, 3).map((b, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                    <CheckCircle className="w-3.5 h-3.5 text-brand-500 flex-shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Patient Comfort Highlight Box */}
        {equipment.patientComfortImpact && (
          <div className="p-3 rounded-2xl bg-brand-50/60 border border-brand-100 flex items-start gap-2.5 text-xs text-brand-900">
            <Heart className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Patient Comfort Benefit:</span>
              <span className="text-brand-800 text-[11px] leading-tight">{equipment.patientComfortImpact}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
