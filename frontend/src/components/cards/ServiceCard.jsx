import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Clock, CheckCircle2, Calendar, ArrowRight } from 'lucide-react';

export const ServiceCard = ({ service }) => {
  if (!service) return null;

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col group hover:-translate-y-1">
      {/* Service Image */}
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img
          src={service.image || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop'}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80"></div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-slate-800 shadow-sm">
          {service.category}
        </div>

        {/* Popular Badge */}
        {service.isPopular && (
          <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Popular</span>
          </div>
        )}

        {/* Starting Price Pill */}
        <div className="absolute bottom-3 left-4 px-3 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-white border border-white/20">
          <span className="text-[10px] text-slate-300 block uppercase">Starting from</span>
          <span className="text-base font-black text-brand-300">
            ₹{service.startingPrice?.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <Link
            to={`/services/${service.slug || service._id}`}
            className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1 block"
          >
            {service.name}
          </Link>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {service.shortDescription}
          </p>

          {/* Quick Specs */}
          <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-50">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-brand-600" />
              <span>{service.durationMinutes || '30-45 min'}</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{service.visitsRequired || '1-2 visits'}</span>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <Link
            to={`/services/${service.slug || service._id}`}
            className="text-xs font-bold text-slate-600 hover:text-brand-600 flex items-center gap-1 transition-colors"
          >
            <span>Learn More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            to={`/booking?serviceId=${service._id}`}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 hover:shadow-lg transition-all flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Now</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
