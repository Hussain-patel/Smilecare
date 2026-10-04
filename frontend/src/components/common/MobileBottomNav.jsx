import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Stethoscope, Calendar, Star, User, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MobileBottomNav = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  const profileRoute = isAuthenticated
    ? isAdmin
      ? '/admin'
      : '/patient-dashboard'
    : '/login';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-slate-200 px-2 py-2 shadow-2xl safe-bottom">
      <div className="flex items-center justify-around">
        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors py-1 px-2 ${
              isActive ? 'text-brand-600' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </NavLink>

        {/* Services */}
        <NavLink
          to="/services"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors py-1 px-2 ${
              isActive ? 'text-brand-600' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          <Stethoscope className="w-5 h-5" />
          <span>Services</span>
        </NavLink>

        {/* Book (Elevated Center Button) */}
        <NavLink
          to="/booking"
          className="flex flex-col items-center -mt-6 group"
        >
          <div className="w-13 h-13 p-3.5 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 text-white shadow-lg shadow-brand-500/40 transform group-hover:scale-105 transition-transform flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold text-brand-700 mt-1">Book</span>
        </NavLink>

        {/* Reviews */}
        <NavLink
          to="/reviews"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors py-1 px-2 ${
              isActive ? 'text-brand-600' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          <Star className="w-5 h-5" />
          <span>Reviews</span>
        </NavLink>

        {/* Profile / Admin */}
        <NavLink
          to={profileRoute}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors py-1 px-2 ${
              isActive ? 'text-brand-600' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          {isAdmin ? <Shield className="w-5 h-5 text-purple-600" /> : <User className="w-5 h-5" />}
          <span>{isAuthenticated ? (isAdmin ? 'Admin' : 'Account') : 'Sign In'}</span>
        </NavLink>
      </div>
    </div>
  );
};
