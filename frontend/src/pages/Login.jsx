import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Lock, Mail, User, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Login = () => {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);
      toast.success(`Welcome back, ${res.user.name}!`);
      if (res.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(from === '/' ? '/patient-dashboard' : from);
      }
    } catch (err) {
      toast.error(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-card">
        {/* Header Logo & Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center mx-auto text-white shadow-md shadow-brand-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign In to SmileCare</h2>
          <p className="text-xs text-slate-500">Access your dental appointments, treatment records, and profile</p>
        </div>

        {/* Demo Fast Logins Box */}
        <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-100 space-y-2">
          <span className="text-[11px] font-bold text-brand-800 uppercase tracking-wider block">
            ⚡ Quick 1-Click Demo Accounts:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('patient@smilecare.com', 'Patient@123')}
              className="p-2 rounded-xl bg-white hover:bg-brand-100/50 border border-brand-200 text-left text-[11px] font-semibold text-slate-700 transition-colors flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-brand-600" />
              <span>Demo Patient</span>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo('admin@smilecare.com', 'Admin@123')}
              className="p-2 rounded-xl bg-white hover:bg-brand-100/50 border border-brand-200 text-left text-[11px] font-semibold text-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-purple-600" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. name@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700">Password</label>
              <Link to="/login" onClick={() => toast.info('For demo: Use Patient@123 or Admin@123')} className="text-[11px] text-brand-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Don't have an account? </span>
          <Link to="/register" className="font-bold text-brand-600 hover:underline">
            Register as a New Patient
          </Link>
        </div>
      </div>
    </div>
  );
};
