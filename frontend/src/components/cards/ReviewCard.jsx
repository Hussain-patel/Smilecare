import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';

export const ReviewCard = ({ review }) => {
  if (!review) return null;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between space-y-4 group">
      <div className="space-y-3">
        {/* Rating Stars & Date */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                }`}
              />
            ))}
            <span className="text-xs font-extrabold text-slate-800 ml-1.5">
              {review.rating ? review.rating.toFixed(1) : '5.0'}
            </span>
          </div>

          <span className="text-[11px] text-slate-400 font-medium">
            {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
          </span>
        </div>

        {/* Title */}
        {review.title && (
          <h4 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-brand-600 transition-colors">
            "{review.title}"
          </h4>
        )}

        {/* Review Comment */}
        <p className="text-xs text-slate-600 leading-relaxed italic">
          "{review.comment}"
        </p>

        {/* Treatment Tag */}
        {(review.treatmentExperience || review.service?.name) && (
          <div className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold">
            🦷 {review.treatmentExperience || review.service?.name}
          </div>
        )}
      </div>

      {/* Patient Profile */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {review.patientAvatar ? (
            <img
              src={review.patientAvatar}
              alt={review.patientName}
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-teal-400 text-white font-bold text-sm flex items-center justify-center shadow-sm uppercase">
              {review.patientName?.charAt(0) || 'P'}
            </div>
          )}
          <div>
            <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <span>{review.patientName}</span>
              {review.isVerifiedPatient && (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100" title="Verified Patient" />
              )}
            </div>
            <span className="text-[10px] text-slate-400">
              {review.doctor?.name ? `Treated by ${review.doctor.name}` : 'Verified Patient Review'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
