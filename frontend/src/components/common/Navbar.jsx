import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Phone,
  Clock,
  Search,
  Calendar,
  User,
  LogOut,
  Shield,
  Menu,
  X,
  MessageCircle,
  AlertCircle,
  ChevronDown,
  Sparkles,
  HeartHandshake
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GlobalSearchModal } from './GlobalSearchModal';
import { EmergencyModal } from './EmergencyModal';
import api from '../../services/api';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [clinicData, setClinicData] = useState(null);
  const [openStatus, setOpenStatus] = useState({ isOpen: true, statusText: 'Open Today' });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClinicInfo = async () => {
      try {
        const res = await api.get('/clinic');
        if (res.success) {
          setClinicData(res.settings);
          if (res.openStatus) setOpenStatus(res.openStatus);
        }
      } catch (err) {
        console.error('Error loading clinic status:', err);
      }
    };

    fetchClinicInfo();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Keyboard shortcut for search (Ctrl+K or Cmd+K)
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'Services', path: '/services' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Technology', path: '/technology' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Before & After', path: '/before-after' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Location & Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
  ];

  // SmileCare contact number
  const phoneDisplay = '+91 7483910280';
  const phoneNumber = '7483910280';
  const whatsappNum = '917483910280';

  return (
    <>
      <header className="sticky top-0 z-40 w-full transition-all duration-200">
        {/* Top Emergency & Opening Hours Bar */}
        <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Live Clinic Open/Closed Indicator */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    openStatus.isOpen ? 'bg-emerald-400' : 'bg-rose-400'
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    openStatus.isOpen ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                ></span>
              </span>
              <span className="font-semibold text-white">
                {openStatus.statusText || (openStatus.isOpen ? 'Open Now' : 'Closed')}
              </span>
              <span className="hidden sm:inline text-slate-400">
                • {openStatus.message || 'Mon-Sat: 9:00 AM - 8:00 PM'}
              </span>
            </div>

            {/* Quick Actions & Emergency */}
            <div className="flex items-center gap-4 sm:gap-6">
              <a
                href={`tel:${phoneNumber}`}
                className="hidden md:flex items-center gap-1.5 hover:text-brand-300 transition-colors font-medium text-white"
              >
                <Phone className="w-3.5 h-3.5 text-brand-400" />
                <span>{phoneDisplay}</span>
              </a>

              <a
                href={`https://wa.me/${whatsappNum}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-emerald-400 transition-colors text-slate-300 font-medium"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>

              <button
                onClick={() => setIsEmergencyOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-600/30 text-rose-300 hover:bg-rose-600 hover:text-white transition-all text-xs font-bold border border-rose-500/40 animate-pulse"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Emergency Dental</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <nav
          className={`w-full transition-all duration-300 ${
            isScrolled
              ? 'glass-nav shadow-lg border-b border-slate-100 py-3'
              : 'bg-white border-b border-slate-100 py-4'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-md shadow-brand-500/30 group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-brand-900 to-brand-700 bg-clip-text text-transparent">
                  SmileCare<span className="text-brand-600">.</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Dental Clinic & Implant Center
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navLinks.slice(0, 7).map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'text-brand-600 bg-brand-50/80 shadow-sm'
                        : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              {/* More Dropdown */}
              <div className="relative group">
                <button className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-brand-600 hover:bg-slate-50 flex items-center gap-1 transition-all">
                  <span>More</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute top-full right-0 w-48 py-2 bg-white rounded-2xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {navLinks.slice(7).map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? 'text-brand-600 bg-brand-50'
                            : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>

            {/* Right CTAs */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Modal Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-xl text-slate-600 hover:text-brand-600 hover:bg-slate-100 transition-colors flex items-center gap-2"
                title="Search (Ctrl + K)"
              >
                <Search className="w-5 h-5" />
                <span className="hidden xl:inline-flex text-xs bg-slate-100 px-2 py-0.5 rounded-md font-mono text-slate-400 border border-slate-200">
                  ⌘K
                </span>
              </button>

              {/* Primary Book Appointment Button */}
              <Link
                to="/booking"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-bold text-sm shadow-md shadow-brand-500/25 hover:shadow-lg hover:shadow-brand-500/30 transition-all transform hover:-translate-y-0.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </Link>

              {/* User Account / Profile Dropdown */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors text-slate-800 text-sm font-bold"
                  >
                    <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden md:inline max-w-[100px] truncate">{user?.name?.split(' ')[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {isUserMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-brand-100 text-brand-700">
                          {user?.role}
                        </span>
                      </div>

                      {isAdmin ? (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 font-medium"
                        >
                          <Shield className="w-4 h-4 text-brand-600" />
                          <span>Admin Control Center</span>
                        </Link>
                      ) : (
                        <Link
                          to="/patient-dashboard"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 font-medium"
                        >
                          <Calendar className="w-4 h-4 text-brand-600" />
                          <span>My Appointments</span>
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 font-medium transition-colors border-t border-slate-100"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-700 hover:text-brand-600 hover:bg-slate-100 transition-colors text-sm font-bold"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer Navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 animate-fadeIn max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-2 pb-4 border-b border-slate-100">
                <Link
                  to="/booking"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="col-span-2 py-3 text-center bg-brand-600 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment Online</span>
                </Link>
              </div>

              <div className="py-2 space-y-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        isActive
                          ? 'text-brand-600 bg-brand-50'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-500">
                <div className="flex items-center justify-between gap-3">
                  <a
                    href={`tel:${phoneNumber}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 font-semibold text-slate-700 hover:text-brand-600 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-brand-600" />
                    <span>Call: {phoneDisplay}</span>
                  </a>

                  <a
                    href={`https://wa.me/${whatsappNum}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsEmergencyOpen(true);
                  }}
                  className="w-full text-center text-rose-600 font-bold py-2 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  🚨 Emergency Care
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Global Modals */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        clinicInfo={clinicData}
      />
    </>
  );
};
