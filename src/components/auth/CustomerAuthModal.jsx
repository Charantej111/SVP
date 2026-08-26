import React, { useState, useEffect } from 'react';
import { X, Mail, KeyRound, User, Phone, MapPin, ArrowRight, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { sendCustomerEmailOtp, verifyCustomerEmailOtp, updateCustomerProfile } from '../../services/authService';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';

export const CustomerAuthModal = () => {
  const { 
    isAuthModalOpen, 
    closeCustomerAuthModal, 
    setUser, 
    pendingDestination, 
    isConfigured 
  } = useAuth();
  
  const { 
    customerDetails, 
    setCustomerDetails, 
    deliveryLocation, 
    openLocationModal,
    openCheckout,
    openCart
  } = useCart();

  // Steps: 'email' | 'otp' | 'profile'
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [demoCodeHint, setDemoCodeHint] = useState('');

  // Reset state on open
  useEffect(() => {
    if (isAuthModalOpen) {
      setStep('email');
      setError('');
      setOtp('');
      setDemoCodeHint('');
    }
  }, [isAuthModalOpen]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const result = await sendCustomerEmailOtp(email.trim());
      setStep('otp');
      setResendTimer(45);
      if (result.demoCode) {
        setDemoCodeHint(result.demoCode);
      }
    } catch (err) {
      setError(err.message || 'Failed to send OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    setError('');

    if (!otp || otp.trim().length !== 6) {
      setError('Please enter the 6-digit OTP code sent to your email.');
      return;
    }

    setLoading(true);
    try {
      const result = await verifyCustomerEmailOtp(email.trim(), otp.trim());
      setUser(result.user);

      if (result.user.name) {
        setCustomerDetails(prev => ({
          ...prev,
          name: result.user.name,
          phone: result.user.phone || prev.phone,
          address: result.user.address || prev.address,
          landmark: result.user.landmark || prev.landmark
        }));
      }

      // If new user or profile incomplete, prompt for Name & Details
      if (result.isNewUser || !result.user.name) {
        setStep('profile');
      } else {
        handleCompleteLogin(result.user);
      }
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    setError('');

    if (!name || name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }

    const cleanedPhone = phone.replace(/[^0-9]/g, '');
    if (cleanedPhone && cleanedPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      let currentAuthId = 'demo-customer-auth-id';
      if (isSupabaseConfigured()) {
        const { data: { user: currentAuthUser } } = await supabase.auth.getUser();
        if (currentAuthUser) currentAuthId = currentAuthUser.id;
      }

      const updated = await updateCustomerProfile(currentAuthId, {
        name: name.trim(),
        phone: cleanedPhone,
        address: address.trim(),
        landmark: landmark.trim(),
        deliveryLocation: deliveryLocation || null
      });

      setUser(prev => ({
        ...prev,
        name: name.trim(),
        phone: cleanedPhone,
        address: address.trim(),
        landmark: landmark.trim(),
        deliveryLocation: deliveryLocation || prev?.deliveryLocation
      }));

      setCustomerDetails(prev => ({
        ...prev,
        name: name.trim(),
        phone: cleanedPhone,
        address: address.trim() || prev.address,
        landmark: landmark.trim() || prev.landmark
      }));

      handleCompleteLogin({ name: name.trim(), phone: cleanedPhone });
    } catch (err) {
      setError(err.message || 'Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteLogin = (loggedInUser) => {
    closeCustomerAuthModal();

    // Preserve user destination
    if (pendingDestination === 'checkout') {
      openCheckout();
    } else if (pendingDestination === 'cart') {
      openCart();
    } else if (pendingDestination === 'account') {
      window.history.pushState(null, '', '/account');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100 relative">
        
        {/* Close Button */}
        <button
          onClick={closeCustomerAuthModal}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="bg-brand-900 text-white p-6 sm:p-7 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="SPV Super Bazaar" 
              className="h-10 w-auto object-contain brightness-110"
            />
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight">
                {step === 'email' && 'Welcome to SPV'}
                {step === 'otp' && 'Verify Your Email'}
                {step === 'profile' && 'Complete Profile'}
              </h2>
              <p className="text-xs text-emerald-200/90 font-medium mt-0.5">
                {step === 'email' && 'Sign in with one-time password'}
                {step === 'otp' && `Code sent to ${email}`}
                {step === 'profile' && 'Tell us your name for orders'}
              </p>
            </div>
          </div>

          {!isConfigured && (
            <div className="mt-3 text-[11px] bg-amber-500/20 text-amber-200 px-3 py-1 rounded-lg border border-amber-400/30 flex items-center gap-1.5">
              <span>Demo Mode Active</span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-5">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold animate-in fade-in">
              {error}
            </div>
          )}

          {/* STEP 1: EMAIL INPUT */}
          {step === 'email' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 pl-10 pr-3.5 bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand-800 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-800/20 transition-all font-medium"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">
                  We'll send a 6-digit security code. No password required.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-brand-800 hover:bg-brand-900 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-subtle flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Continue with Email OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    6-Digit Security Code
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="text-xs text-brand-800 hover:underline font-semibold cursor-pointer"
                  >
                    Change Email
                  </button>
                </div>

                <div className="relative">
                  <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full h-12 pl-10 pr-3.5 tracking-[0.4em] font-mono text-center bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand-800 rounded-xl text-lg font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-800/20 transition-all"
                    autoFocus
                  />
                </div>

                {demoCodeHint && (
                  <div className="mt-2 p-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium flex items-center justify-between">
                    <span>Demo OTP Code: <strong className="font-mono font-bold">{demoCodeHint}</strong></span>
                    <button
                      type="button"
                      onClick={() => setOtp(demoCodeHint)}
                      className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
                    >
                      Fill Code
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                <span>Didn't receive code?</span>
                {resendTimer > 0 ? (
                  <span className="font-semibold text-gray-400">Resend in {resendTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-brand-800 font-bold hover:underline cursor-pointer"
                  >
                    Resend Code
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full h-11 bg-brand-800 hover:bg-brand-900 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-subtle flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Sign In</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 3: PROFILE COMPLETION (NAME & PHONE) */}
          {step === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Venkat Rao"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 pl-10 pr-3.5 bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand-800 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-800/20 transition-all font-medium"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Mobile Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full h-11 pl-10 pr-3.5 bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand-800 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-800/20 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Delivery Address (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Door No, Street Name, Village/Area"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-11 px-3.5 bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand-800 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-800/20 transition-all font-medium"
                />
              </div>

              {/* Landmark */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Nearby Landmark (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Temple / School"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full h-11 px-3.5 bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand-800 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-800/20 transition-all font-medium"
                />
              </div>

              {/* Optional Delivery Location Pill */}
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                    <MapPin className="w-3.5 h-3.5 text-brand-800" />
                    <span>Delivery Location</span>
                  </div>
                  <button
                    type="button"
                    onClick={openLocationModal}
                    className="text-xs text-brand-800 font-bold hover:underline cursor-pointer"
                  >
                    {deliveryLocation ? 'Change' : 'Set Location'}
                  </button>
                </div>
                <div className="text-xs text-gray-600 truncate">
                  {deliveryLocation?.shortAddress || deliveryLocation?.formattedAddress || 'Optional: You can also set this later during checkout.'}
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2.5">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-11 bg-brand-800 hover:bg-brand-900 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-subtle flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Save & Get Started</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Privacy Note */}
          <div className="pt-2 border-t border-gray-100 flex items-center gap-2 text-[11px] text-gray-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Secure passwordless authentication with zero spam.</span>
          </div>

        </div>

      </div>
    </div>
  );
};
