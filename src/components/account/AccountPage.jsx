import React, { useState, useEffect } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Home, 
  Compass, 
  LogOut, 
  ArrowLeft, 
  Check, 
  Edit3, 
  ShieldCheck, 
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const AccountPage = ({ onShopClick }) => {
  const { user, logout, updateProfile, openCustomerAuthModal } = useAuth();
  const { deliveryLocation, openLocationModal, customerDetails, setCustomerDetails } = useCart();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state from user or customerDetails
  useEffect(() => {
    if (user) {
      setName(user.name || customerDetails?.name || '');
      setPhone(user.phone || customerDetails?.phone || '');
      setAddress(user.address || customerDetails?.address || deliveryLocation?.formattedAddress || '');
      setLandmark(user.landmark || customerDetails?.landmark || '');
    }
  }, [user, customerDetails, deliveryLocation]);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-800 flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">My Account</h1>
        <p className="text-sm text-gray-500 mb-6">
          Sign in to manage your profile, delivery address, and fast WhatsApp checkout preferences.
        </p>
        <button
          onClick={() => openCustomerAuthModal('account')}
          className="bg-brand-800 hover:bg-brand-900 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-subtle cursor-pointer active:scale-95"
        >
          Sign in with Email OTP
        </button>
      </div>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        landmark: landmark.trim(),
        deliveryLocation: deliveryLocation || null
      });

      // Update CartContext so checkout is instantly prefilled
      setCustomerDetails(prev => ({
        ...prev,
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        landmark: landmark.trim()
      }));

      setIsEditing(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 animate-in fade-in duration-300">
      
      {/* Back button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onShopClick}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-brand-800 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Shopping</span>
        </button>

        <button
          onClick={logout}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer border border-red-200/60"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main Account Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
        
        {/* Header Profile Badge */}
        <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
          <div className="w-14 h-14 rounded-2xl bg-brand-800 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-md">
            {(user.name || user.email || 'U')[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              {user.name || 'SPV Customer'}
            </h1>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
              <span>{user.email}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="text-emerald-700 font-bold capitalize">{user.role}</span>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          )}
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile & Delivery details saved! These will automatically prefill during checkout.</span>
          </div>
        )}

        {/* Profile & Address Details Form or View */}
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Padala Venkat Rao"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 pl-10 pr-3.5 bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full h-11 pl-10 pr-3.5 bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand-800"
                  />
                </div>
              </div>
            </div>

            {/* Actual Delivery Address */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Delivery Address (Door No, Street, Village/Area) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Home className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. D.No 4-12/1, Main Bazaar Street, Ramavaram"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2 bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand-800"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                This exact address will be prefilled on checkout for home delivery.
              </p>
            </div>

            {/* Landmark */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Nearby Landmark (Optional)
              </label>
              <div className="relative">
                <Compass className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Near Vinayaka Temple / Beside Panchayat Office"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full h-11 pl-10 pr-3.5 bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand-800"
                />
              </div>
            </div>

            {/* Delivery Location Pill */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-gray-500 uppercase">Selected Delivery Area</div>
                <div className="text-xs font-bold text-gray-900 truncate">
                  {deliveryLocation?.shortAddress || deliveryLocation?.formattedAddress || 'Ramavaram, Kutukuluru (Default)'}
                </div>
              </div>
              <button
                type="button"
                onClick={openLocationModal}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-brand-800 text-xs font-bold border border-gray-200 cursor-pointer shadow-2xs shrink-0"
              >
                Change Area
              </button>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-brand-800 hover:bg-brand-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow-subtle cursor-pointer transition-all active:scale-95"
              >
                {saving ? 'Saving Details...' : 'Save & Prefill Checkout'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </form>
        ) : (
          <div className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Full Name</div>
                <div className="text-sm font-extrabold text-gray-900">{user.name || 'Not provided'}</div>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Phone Number</div>
                <div className="text-sm font-extrabold text-gray-900">{user.phone || 'Not provided'}</div>
              </div>
            </div>

            {/* Saved Delivery Address Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-950">
                  <Home className="w-4 h-4 text-emerald-700" />
                  <span>Saved Delivery Address</span>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-emerald-800 font-bold hover:underline cursor-pointer"
                >
                  Edit Address
                </button>
              </div>

              <div className="text-xs font-semibold text-gray-800 leading-relaxed">
                {user.address || customerDetails?.address ? (
                  <p>{user.address || customerDetails?.address}</p>
                ) : (
                  <p className="text-gray-500 font-normal italic">
                    No door/street address saved yet. Click "Edit Details" to set your delivery address for automatic checkout.
                  </p>
                )}
              </div>

              {(user.landmark || customerDetails?.landmark) && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium pt-1">
                  <Compass className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Landmark: <strong>{user.landmark || customerDetails?.landmark}</strong></span>
                </div>
              )}

              <div className="pt-2 border-t border-emerald-100/60 flex items-center justify-between text-xs text-emerald-900">
                <span className="text-[11px] text-gray-500">Mandal Area:</span>
                <span className="font-bold">{deliveryLocation?.shortAddress || 'Ramavaram, Kutukuluru'}</span>
              </div>
            </div>

          </div>
        )}

        {/* WhatsApp Direct Ordering Information */}
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3 text-xs text-gray-600">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-gray-900">Automatic Fast Checkout Active</div>
            <p className="text-gray-500 leading-relaxed">
              When ordering on SPV Super Bazaar, your saved name, phone number, and address are automatically loaded into your WhatsApp message.
            </p>
          </div>
        </div>

        {/* Shop Now CTA */}
        <div className="pt-2">
          <button
            onClick={onShopClick}
            className="w-full h-11 bg-brand-800 hover:bg-brand-900 text-white font-bold text-sm rounded-xl transition-all shadow-subtle flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Browse Supermarket Groceries</span>
          </button>
        </div>

      </div>

    </div>
  );
};
