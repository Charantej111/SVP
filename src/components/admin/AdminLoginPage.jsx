import React, { useState } from 'react';
import { Lock, Mail, ShieldAlert, ArrowRight, RefreshCw, KeyRound, Store } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminLogin } from '../../services/authService';

export const AdminLoginPage = ({ onLoginSuccess, onBackToStore }) => {
  const { setUser, isConfigured } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await adminLogin(email, password);
      setUser(result.user);
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Invalid admin credentials or unauthorized account.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@spvsuperbazaar.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-center items-center px-4 py-12 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Container */}
      <div className="w-full max-w-md space-y-6 animate-in fade-in duration-300">
        
        {/* Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs mb-1">
            <img 
              src="/logo.png" 
              alt="SPV Super Bazaar" 
              className="h-10 w-auto object-contain"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            SPV Store Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Staff management portal for inventory & catalog control
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!isConfigured && (
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs space-y-1.5">
              <div className="font-bold flex items-center gap-1.5">
                <span>Demo Admin Mode Active</span>
              </div>
              <p className="text-[11px] text-amber-800/80 leading-relaxed">
                Connect Supabase in <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono">.env.local</code> for production database.
              </p>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-[11px] font-extrabold text-emerald-800 hover:underline pt-0.5 cursor-pointer block"
              >
                Auto-fill Demo Credentials (admin@spvsuperbazaar.com / admin123)
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Staff Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@spvsuperbazaar.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-3.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-brand-800 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-800/20 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-3.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-brand-800 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-800/20 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-brand-800 hover:bg-brand-900 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl transition-all shadow-subtle flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In to Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>

        {/* Back to public store */}
        <div className="text-center">
          <button
            onClick={onBackToStore}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-800 transition-colors cursor-pointer"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Return to SPV Super Bazaar Public Store</span>
          </button>
        </div>

      </div>

    </div>
  );
};
