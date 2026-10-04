import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronRight,
  ShieldCheck,
  Award,
  Heart
} from 'lucide-react';

// Clean SVG Social Icons
const InstagramIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
import api from '../../services/api';

export const Footer = () => {
  const [clinic, setClinic] = useState(null);

  useEffect(() => {
    const loadClinic = async () => {
      try {
        const res = await api.get('/clinic');
        if (res.success && res.settings) {
          setClinic(res.settings);
        }
      } catch (err) {
        console.error('Footer error loading clinic info:', err);
      }
    };
    loadClinic();
  }, []);

  const phone = clinic?.phone || '+91 7483910280';
  const email = clinic?.email || 'care@smilecaredental.com';
  const address = clinic?.address?.street
    ? `${clinic.address.building}, ${clinic.address.street}, ${clinic.address.area}, ${clinic.address.city} - ${clinic.address.pinCode}`
    : 'SmileCare Towers, 42 Health Avenue, Indiranagar, Bengaluru - 560038';

  const socialLinks = clinic?.socialLinks || {
    instagram: 'https://instagram.com/smilecaredental',
    facebook: 'https://facebook.com/smilecaredental',
    youtube: 'https://youtube.com/@smilecaredental',
    linkedin: 'https://linkedin.com/company/smilecare-dental',
    twitter: 'https://twitter.com/smilecaredental',
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Brand & Bio (2 spans on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-teal-300 flex items-center justify-center text-slate-900 shadow-lg shadow-brand-500/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight">
                  SmileCare<span className="text-brand-400">.</span>
                </span>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Dental Clinic & Implant Center
                </p>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed pr-6">
              {clinic?.aboutDescription ||
                'SmileCare is a multi-specialty dental sanctuary in Bengaluru dedicated to gentle, high-precision oral healthcare. Utilizing European Class-B sterilization, 3D CBCT imaging, and pain-free clinical techniques.'}
            </p>

            {/* Accreditations Trust Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs font-semibold text-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Class-B Sterilization</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs font-semibold text-slate-200">
                <Award className="w-4 h-4 text-brand-400" />
                <span>IDA & ISO Certified</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-3">
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-gradient-to-tr hover:from-purple-600 hover:to-pink-500 text-slate-300 hover:text-white flex items-center justify-center transition-all"
                >
                  <InstagramIcon />
                </a>
              )}
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-all"
                >
                  <FacebookIcon />
                </a>
              )}
              {socialLinks.youtube && (
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-all"
                >
                  <YoutubeIcon />
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-blue-700 text-slate-300 hover:text-white flex items-center justify-center transition-all"
                >
                  <LinkedinIcon />
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X Twitter"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-sky-500 text-slate-300 hover:text-white flex items-center justify-center transition-all"
                >
                  <TwitterIcon />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Explore Clinic</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>About Our Clinic</span>
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>Dental Specialists</span>
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>Treatments & Services</span>
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>Transparent Pricing</span>
                </Link>
              </li>
              <li>
                <Link to="/technology" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>3D Tech & Machines</span>
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>Clinic Photo Tour</span>
                </Link>
              </li>
              <li>
                <Link to="/before-after" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>Smile Transformations</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Patient Portal & Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Patient Care</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/booking" className="hover:text-brand-400 transition-colors flex items-center gap-1.5 font-semibold text-brand-300">
                  <ChevronRight className="w-3.5 h-3.5 text-brand-400" />
                  <span>Book Appointment</span>
                </Link>
              </li>
              <li>
                <Link to="/patient-dashboard" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>My Appointments</span>
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>Patient Reviews</span>
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>Frequently Asked Questions</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>Directions & Parking</span>
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>Doctor & Admin Sign In</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Hours */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Clinic & Hours</h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-white font-medium">
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white">
                  {email}
                </a>
              </div>
              <div className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-200">Mon - Sat: 9:00 AM - 8:00 PM</p>
                  <p className="text-slate-400">Sunday: 10:00 AM - 2:00 PM (Emergency by appt)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Medical & Pricing Disclaimer */}
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50 text-xs text-slate-400 leading-relaxed">
          <p className="font-semibold text-slate-300 mb-1">⚕️ Clinical Disclaimer & Pricing Notice:</p>
          <p>
            {clinic?.disclaimer ||
              'Information presented on this website is for general educational and appointment booking purposes and is not a substitute for professional medical or dental diagnosis. Treatment fees shown are starting estimates; exact procedural costs are determined following in-person clinical examination and radiographic evaluation.'}
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} SmileCare™ Dental Clinic. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/about" className="hover:text-white transition-colors">Sterilization Standards</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
