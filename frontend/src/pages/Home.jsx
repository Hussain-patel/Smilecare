import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  ShieldCheck,
  Award,
  Star,
  Clock,
  ArrowRight,
  PhoneCall,
  CheckCircle2,
  ChevronRight,
  Stethoscope,
  HeartHandshake,
  Users,
  Smile,
  Zap,
  Cpu
} from 'lucide-react';
import api from '../services/api';
import { DoctorCard } from '../components/cards/DoctorCard';
import { ServiceCard } from '../components/cards/ServiceCard';
import { EquipmentCard } from '../components/cards/EquipmentCard';
import { ReviewCard } from '../components/cards/ReviewCard';
import { BeforeAfterSlider } from '../components/gallery/BeforeAfterSlider';
import { ClinicMap } from '../components/map/ClinicMap';
import { CardSkeleton, DoctorSkeleton } from '../components/common/Skeleton';

export const Home = () => {
  const [clinic, setClinic] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [beforeAfter, setBeforeAfter] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick booking bar state
  const [quickService, setQuickService] = useState('');
  const [quickDoctor, setQuickDoctor] = useState('');
  const [quickDate, setQuickDate] = useState('');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [clinicRes, docsRes, svcsRes, equipRes, reviewsRes, baRes] = await Promise.all([
          api.get('/clinic'),
          api.get('/doctors'),
          api.get('/services?popular=true'),
          api.get('/equipment'),
          api.get('/reviews'),
          api.get('/gallery/before-after'),
        ]);

        if (clinicRes.success) setClinic(clinicRes.settings);
        if (docsRes.success) setDoctors(docsRes.doctors || []);
        if (svcsRes.success) setServices(svcsRes.services || []);
        if (equipRes.success) setEquipment(equipRes.equipment || []);
        if (reviewsRes.success) setReviews(reviewsRes.reviews || []);
        if (baRes.success) setBeforeAfter(baRes.cases || []);

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setQuickDate(tomorrow.toISOString().split('T')[0]);
      } catch (err) {
        console.error('Home data loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const stats = clinic?.stats || {
    rating: 4.9,
    experienceYears: 12,
    patientsServed: '18,500+',
    treatmentsCount: '25+',
  };

  return (
    <div className="space-y-16 sm:space-y-24 overflow-hidden pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 pb-16 bg-gradient-to-b from-brand-50/70 via-slate-50 to-white bg-grid-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text (7 cols) */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-800 text-xs sm:text-sm font-bold shadow-sm">
                <Sparkles className="w-4 h-4 text-brand-600 animate-pulse" />
                <span>Award-Winning Dental Healthcare Sanctuary</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Your Smile<span className="text-brand-600">.</span> <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-brand-600 via-teal-500 to-accent-600 bg-clip-text text-transparent">
                  Our Expertise.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {clinic?.heroSubtitle ||
                  'Professional dental care with advanced 3D technology, experienced specialists, and pain-free personalized treatments designed for your ultimate comfort.'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/booking"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-extrabold text-base shadow-xl shadow-brand-500/30 hover:shadow-2xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book Appointment</span>
                </Link>

                <Link
                  to="/services"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>Explore Treatments</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

              {/* Trust Micro-Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Class-B Sterilization</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-brand-600" />
                  <span>MDS Certified Doctors</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>100% Pain-Free Care</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Composition (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Doctor Photo */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1000&auto=format&fit=crop"
                    alt="SmileCare Modern Dental Specialist"
                    className="w-full h-[420px] sm:h-[480px] object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-brand-300">Dental Consultation</p>
                    <h3 className="text-xl font-extrabold">State-of-the-Art Care</h3>
                    <p className="text-xs text-slate-200">Equipped with 3D CBCT & Microscopic Dentistry</p>
                  </div>
                </div>

                {/* Floating Rating Card Overlay */}
                <div className="absolute -top-4 -left-4 sm:-left-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-100 shadow-xl flex items-center gap-3 animate-float">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center font-black">
                    <Star className="w-6 h-6 fill-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-black text-slate-900">{stats.rating}</span>
                      <span className="text-xs text-slate-400 font-bold">/ 5.0</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">Over 1,480+ Google Reviews</p>
                  </div>
                </div>

                {/* Floating Patients Badge Overlay */}
                <div className="absolute -bottom-5 -right-4 sm:-right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-100 shadow-xl flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-black">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-base font-black text-slate-900">{stats.patientsServed}</p>
                    <p className="text-[11px] text-slate-500 font-medium">Satisfied Smiles Transformed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS COUNTER BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1 p-2">
            <p className="text-3xl sm:text-4xl font-black text-brand-600">{stats.rating} ★</p>
            <p className="text-xs sm:text-sm font-bold text-slate-800">Top Rated Clinic</p>
            <p className="text-[11px] text-slate-400">Google & Practo Verified</p>
          </div>
          <div className="space-y-1 p-2 border-l border-slate-100">
            <p className="text-3xl sm:text-4xl font-black text-slate-900">{stats.experienceYears}+</p>
            <p className="text-xs sm:text-sm font-bold text-slate-800">Years Experience</p>
            <p className="text-[11px] text-slate-400">Senior Dental Specialists</p>
          </div>
          <div className="space-y-1 p-2 border-l-0 md:border-l border-slate-100">
            <p className="text-3xl sm:text-4xl font-black text-slate-900">{stats.patientsServed}</p>
            <p className="text-xs sm:text-sm font-bold text-slate-800">Happy Patients</p>
            <p className="text-[11px] text-slate-400">Lifelong Trust & Care</p>
          </div>
          <div className="space-y-1 p-2 border-l border-slate-100">
            <p className="text-3xl sm:text-4xl font-black text-brand-600">{stats.treatmentsCount}</p>
            <p className="text-xs sm:text-sm font-bold text-slate-800">Specialized Treatments</p>
            <p className="text-[11px] text-slate-400">All Specialties Under One Roof</p>
          </div>
        </div>
      </section>

      {/* 3. QUICK BOOKING WIDGET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="max-w-xl space-y-2 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Fast-Track Booking</span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Find Available Dental Slots</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Select Service */}
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1.5">1. Treatment</label>
              <select
                value={quickService}
                onChange={(e) => setQuickService(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                <option value="">-- Choose Dental Service --</option>
                {services.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} (from ₹{s.startingPrice})
                  </option>
                ))}
              </select>
            </div>

            {/* Select Doctor */}
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1.5">2. Dentist</label>
              <select
                value={quickDoctor}
                onChange={(e) => setQuickDoctor(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                <option value="">-- Any Available Specialist --</option>
                {doctors.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({d.specialization?.[0]})
                  </option>
                ))}
              </select>
            </div>

            {/* Select Date */}
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1.5">3. Date</label>
              <input
                type="date"
                value={quickDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setQuickDate(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>

            {/* Action CTA */}
            <div className="flex items-end">
              <Link
                to={`/booking?${quickDoctor ? `doctorId=${quickDoctor}&` : ''}${quickService ? `serviceId=${quickService}&` : ''}`}
                className="w-full py-3.5 px-6 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-black text-sm shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Search Slots</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED SERVICES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
              Comprehensive Oral Care
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Featured Treatments & Procedures
            </h2>
            <p className="text-sm text-slate-500 max-w-xl">
              From routine hygiene and pediatric prevention to full-mouth dental implants and cosmetic smile design.
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-2 font-bold text-sm text-brand-600 hover:text-brand-700 transition-colors"
          >
            <span>View All 12+ Treatments</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((svc) => (
              <ServiceCard key={svc._id} service={svc} />
            ))}
          </div>
        )}
      </section>

      {/* 5. MEET SPECIALISTS / DOCTORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-700 bg-accent-50 px-3 py-1 rounded-full">
              Medical Board
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Meet Our Dental Specialists
            </h2>
            <p className="text-sm text-slate-500 max-w-xl">
              Distinguished MDS dental surgeons and implantologists dedicated to evidence-based compassionate healthcare.
            </p>
          </div>

          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 font-bold text-sm text-brand-600 hover:text-brand-700 transition-colors"
          >
            <span>View All Doctor Profiles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DoctorSkeleton />
            <DoctorSkeleton />
            <DoctorSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.slice(0, 3).map((doc) => (
              <DoctorCard key={doc._id} doctor={doc} />
            ))}
          </div>
        )}
      </section>

      {/* 6. TECHNOLOGY & EQUIPMENT SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
              Advanced Clinical Infrastructure
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              3D Digital Tech & Precision Equipment
            </h2>
            <p className="text-sm text-slate-500 max-w-xl">
              We invest in high-end medical technology to ensure sub-millimeter diagnostic precision and zero-pain comfort.
            </p>
          </div>

          <Link
            to="/technology"
            className="inline-flex items-center gap-2 font-bold text-sm text-brand-600 hover:text-brand-700 transition-colors"
          >
            <span>Explore All Equipment</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipment.slice(0, 3).map((eq) => (
            <EquipmentCard key={eq._id} equipment={eq} />
          ))}
        </div>
      </section>

      {/* 7. BEFORE & AFTER TRANSFORMATION SPOTLIGHT */}
      {beforeAfter.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                Smile Transformations
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Before & After Real Patient Results
              </h2>
              <p className="text-sm text-slate-500 max-w-xl">
                Drag the interactive comparison slider to see the true clinical and aesthetic transformations.
              </p>
            </div>

            <Link
              to="/before-after"
              className="inline-flex items-center gap-2 font-bold text-sm text-brand-600 hover:text-brand-700 transition-colors"
            >
              <span>View All Smile Transformations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {beforeAfter.slice(0, 2).map((item) => (
              <BeforeAfterSlider key={item._id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* 8. PATIENT REVIEWS & RATINGS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
              Patient Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Stories from Happy Smiles
            </h2>
            <p className="text-sm text-slate-500 max-w-xl">
              Read verified feedback from our patients regarding treatments, gentle doctors, and painless visits.
            </p>
          </div>

          <Link
            to="/reviews"
            className="inline-flex items-center gap-2 font-bold text-sm text-brand-600 hover:text-brand-700 transition-colors"
          >
            <span>Read All Reviews & Rate</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((rev) => (
            <ReviewCard key={rev._id} review={rev} />
          ))}
        </div>
      </section>

      {/* 9. LOCATION & CLINIC MAP SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
            Find Our Clinic
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Convenient Location & Easy Access
          </h2>
        </div>

        <ClinicMap clinic={clinic} />
      </section>
    </div>
  );
};
