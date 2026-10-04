import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Award,
  HeartHandshake,
  CheckCircle,
  Building2,
  Calendar,
  Users,
  Target,
  Eye,
  Check
} from 'lucide-react';
import api from '../services/api';

export const About = () => {
  const [clinic, setClinic] = useState(null);

  useEffect(() => {
    const fetchClinic = async () => {
      try {
        const res = await api.get('/clinic');
        if (res.success && res.settings) {
          setClinic(res.settings);
        }
      } catch (err) {
        console.error('Error fetching about page clinic data:', err);
      }
    };
    fetchClinic();
  }, []);

  const values = clinic?.values || [
    'Patient-First Compassion',
    'Zero-Compromise European Sterilization',
    'Transparent & Honest Pricing',
    'Continuous Digital Innovation',
    'Pain-Free Care Philosophy',
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-brand-50/80 via-slate-50 to-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Established in {clinic?.establishedYear || 2014}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            About SmileCare Dental Clinic
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {clinic?.aboutDescription ||
              'SmileCare is dedicated to delivering gentle, precision dental healthcare with world-class diagnostics, sterile environments, and empathetic specialist doctors.'}
          </p>
        </div>
      </section>

      {/* Mission & Vision Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Our Mission</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {clinic?.mission ||
                'To provide world-class, gentle, and accessible dental healthcare utilizing advanced digital diagnostics and evidence-based clinical practices.'}
            </p>
          </div>

          {/* Vision */}
          <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-accent-50 text-accent-600 flex items-center justify-center font-bold">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Our Vision</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {clinic?.vision ||
                'To be the most trusted healthcare sanctuary for smiles, setting the gold standard in patient comfort, safety, and aesthetic transformation.'}
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
            Our Philosophy
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Our Guiding Core Values</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {values.map((val, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-3 hover:border-brand-300 transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0 font-bold">
                <Check className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-800 text-sm">{val}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Sterilization & Patient Safety Standards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl space-y-8">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
              European Class-B Standards
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Hospital-Grade Sterilization Protocols
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Your health and safety are non-negotiable. Every instrument undergoes a 6-step hospital-grade sterilization cycle and is sealed in barcode-tracked vacuum pouches opened only in your presence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
              <span className="font-extrabold text-brand-400 text-sm">01. Ultrasonic Cleaning</span>
              <p className="text-slate-300">Biofilm and chemical residue removal in ultrasonic enzymatic baths.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
              <span className="font-extrabold text-brand-400 text-sm">02. Class-B Autoclave</span>
              <p className="text-slate-300">134°C pressurized fractionated pre-vacuum destroying 100% of micro-organisms.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
              <span className="font-extrabold text-brand-400 text-sm">03. Sealed Pouches</span>
              <p className="text-slate-300">Sterile thermo-sealed transparent pouches with chemical indicator color change.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
              <span className="font-extrabold text-brand-400 text-sm">04. Laminar HEPA Air</span>
              <p className="text-slate-300">Continuous clinical room air filtration capturing particles down to 0.3 microns.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Ready to Experience Gentle, Modern Dentistry?
        </h3>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Book your first consultation today and let our specialists craft a personalized roadmap for your smile.
        </p>
        <Link
          to="/booking"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-xl shadow-brand-500/25 transition-all"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Consultation Online</span>
        </Link>
      </section>
    </div>
  );
};
