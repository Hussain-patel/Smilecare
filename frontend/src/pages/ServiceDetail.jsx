import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  Stethoscope
} from 'lucide-react';
import api from '../services/api';

export const ServiceDetail = () => {
  const { idOrSlug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/services/${idOrSlug}`);
        if (res.success && res.service) {
          setService(res.service);
        }
      } catch (err) {
        console.error('Error fetching service details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Treatment Not Found</h2>
        <Link to="/services" className="text-brand-600 font-bold hover:underline">
          ← Return to Services Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button */}
      <Link
        to="/services"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Treatments</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Main Procedure Details (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Visual & Title */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-card">
            <div className="relative h-72 sm:h-96 bg-slate-900 overflow-hidden">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

              <div className="absolute top-6 left-6 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-extrabold text-slate-900">
                {service.category}
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{service.name}</h1>
                <p className="text-xs sm:text-sm text-slate-200">{service.shortDescription}</p>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900">Overview & Clinical Indications</h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {service.fullDescription}
                </p>
              </div>

              {/* Benefits checklist */}
              {service.benefits?.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h3 className="text-base font-bold text-slate-900">Key Patient Benefits</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {service.benefits.map((b, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Procedure Steps Walkthrough */}
          {service.procedureSteps?.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                  Clinical Protocol
                </span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Step-by-Step Procedure Guide
                </h3>
              </div>

              <div className="space-y-4">
                {service.procedureSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-brand-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                      0{step.stepNumber || idx + 1}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-sm">{step.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Pricing & Booking Widget (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-6 sticky top-28">
            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Estimated Pricing
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">
                  ₹{service.startingPrice?.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 font-medium">starting cost</span>
              </div>
            </div>

            {/* Quick Specs */}
            <div className="space-y-3 py-3 border-y border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-brand-600" />
                  <span>Duration</span>
                </span>
                <strong className="text-slate-900">{service.durationMinutes}</strong>
              </div>

              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Visits Required</span>
                </span>
                <strong className="text-slate-900">{service.visitsRequired}</strong>
              </div>

              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-600" />
                  <span>Sterilization</span>
                </span>
                <strong className="text-slate-900">Class-B 100% Sterile</strong>
              </div>
            </div>

            {/* Book Now Button */}
            <Link
              to={`/booking?serviceId=${service._id}`}
              className="w-full py-4 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-xl shadow-brand-500/25 hover:shadow-2xl transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book This Treatment</span>
            </Link>

            {/* Transparent Pricing Disclaimer */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <span>
                *Prices shown are starting estimates. Final treatment cost is determined after thorough clinical and radiographic diagnosis.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
