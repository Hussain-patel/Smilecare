import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Award,
  GraduationCap,
  Calendar,
  Clock,
  Languages,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
  ArrowLeft,
  ChevronRight,
  Phone,
  Mail
} from 'lucide-react';
import api from '../services/api';

export const DoctorDetail = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/doctors/${id}`);
        if (res.success && res.doctor) {
          setDoctor(res.doctor);
        }
      } catch (err) {
        console.error('Error loading doctor details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Doctor Profile Not Found</h2>
        <Link to="/doctors" className="text-brand-600 font-bold hover:underline">
          ← Return to Doctors Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button */}
      <Link
        to="/doctors"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Doctors</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Doctor Profile Card & CTAs (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-card p-6 text-center space-y-5">
            <div className="relative w-40 h-40 mx-auto rounded-3xl overflow-hidden border-4 border-brand-100 shadow-lg">
              <img
                src={doctor.photo}
                alt={doctor.name}
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{doctor.name}</h1>
              <p className="text-xs text-brand-700 font-bold">{doctor.qualification}</p>
              <p className="text-xs text-slate-400 font-medium">{doctor.designation}</p>
            </div>

            {/* Ratings & Exp */}
            <div className="flex items-center justify-center gap-4 py-3 border-y border-slate-100 text-xs">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{doctor.rating ? doctor.rating.toFixed(1) : '4.9'}</span>
                <span className="text-slate-400 font-normal">({doctor.reviewsCount || 120})</span>
              </div>
              <div className="flex items-center gap-1 text-slate-700 font-bold">
                <Award className="w-4 h-4 text-brand-600" />
                <span>{doctor.experienceYears}+ Years</span>
              </div>
            </div>

            {/* Registration Number */}
            {doctor.registrationNumber && (
              <div className="text-[11px] text-slate-500 font-medium">
                Reg. No: <strong className="text-slate-800">{doctor.registrationNumber}</strong>
              </div>
            )}

            {/* Consultation Fee & Booking CTA */}
            <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-100 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Consultation Fee</span>
                <span className="text-lg font-black text-slate-900">
                  ₹{doctor.consultationFee?.toLocaleString()}
                </span>
              </div>

              <Link
                to={`/booking?doctorId=${doctor._id}`}
                className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment with {doctor.name.split(' ')[0]}</span>
              </Link>
            </div>
          </div>

          {/* Schedule Summary Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" />
              <span>Consultation Timings</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                <span>Working Days:</span>
                <strong className="text-slate-800 text-right">{doctor.availableDays?.join(', ')}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                <span>Hours:</span>
                <strong className="text-slate-800">
                  {doctor.availableTimings?.start} - {doctor.availableTimings?.end}
                </strong>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>Slot Duration:</span>
                <strong className="text-brand-700">{doctor.slotDurationMinutes || 30} mins / patient</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bio, Education, Certifications, Awards (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* About Doctor Bio */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-card space-y-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              About {doctor.name}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {doctor.about}
            </p>

            {/* Specialization Pills */}
            <div className="pt-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Specialized Clinical Focus
              </span>
              <div className="flex flex-wrap gap-2">
                {doctor.specialization?.map((spec, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-brand-50 text-brand-800 text-xs font-bold"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Education & Qualifications */}
          {doctor.education?.length > 0 && (
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-card space-y-4">
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-brand-600" />
                <span>Education & Medical Training</span>
              </h3>
              <div className="space-y-3">
                {doctor.education.map((edu, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-brand-600 mt-2"></div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{edu.degree}</h4>
                      <p className="text-xs text-slate-500">{edu.institution} • {edu.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications & Fellowships */}
          {doctor.certifications?.length > 0 && (
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-card space-y-4">
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Certifications & Fellowships</span>
              </h3>
              <ul className="space-y-2">
                {doctor.certifications.map((cert, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Awards & Memberships */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {doctor.awards?.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-3">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Honors & Awards</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {doctor.awards.map((award, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-500">★</span>
                      <span>{award}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {doctor.memberships?.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-3">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-brand-600" />
                  <span>Professional Memberships</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {doctor.memberships.map((mem, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-brand-600">✓</span>
                      <span>{mem}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
