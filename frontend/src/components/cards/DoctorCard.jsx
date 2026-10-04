import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Award, Calendar, ChevronRight, Languages, CheckCircle } from 'lucide-react';

export const DoctorCard = ({ doctor }) => {
  if (!doctor) return null;

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col group hover:-translate-y-1">
      {/* Photo Container */}
      <div className="relative h-64 overflow-hidden bg-slate-100">
        <img
          src={doctor.photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop'}
          alt={doctor.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80"></div>

        {/* Experience Pill */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-brand-600" />
          <span>{doctor.experienceYears}+ Years Exp</span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-amber-500 text-white text-xs font-bold shadow-md flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-white" />
          <span>{doctor.rating ? doctor.rating.toFixed(1) : '4.9'}</span>
        </div>

        {/* Name and Designation Overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="text-xl font-black tracking-tight leading-snug drop-shadow-sm">{doctor.name}</h3>
          <p className="text-xs text-brand-200 font-medium line-clamp-1">{doctor.qualification}</p>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {doctor.designation || 'Senior Consultant'}
          </div>

          {/* Specializations Pills */}
          <div className="flex flex-wrap gap-1.5">
            {doctor.specialization?.slice(0, 3).map((spec, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                {spec}
              </span>
            ))}
            {doctor.specialization?.length > 3 && (
              <span className="px-2 py-1 rounded-lg bg-brand-50 text-brand-700 text-xs font-bold">
                +{doctor.specialization.length - 3} more
              </span>
            )}
          </div>

          {/* Languages */}
          {doctor.languages?.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
              <Languages className="w-3.5 h-3.5 text-slate-400" />
              <span>Speaks: {doctor.languages.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Footer with Fee & CTA */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-slate-400 font-semibold block uppercase">Consultation</span>
            <span className="text-lg font-extrabold text-slate-900">
              ₹{doctor.consultationFee?.toLocaleString() || 500}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/doctors/${doctor._id}`}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50 text-slate-600 hover:text-brand-600 transition-colors"
              title="View Doctor Qualifications"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>

            <Link
              to={`/booking?doctorId=${doctor._id}`}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Visit</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
