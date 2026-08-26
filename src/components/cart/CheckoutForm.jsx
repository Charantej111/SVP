import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, Truck, Store, MapPin, Phone, User, AlertCircle, ShieldCheck, Edit3, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { STORE_CONFIG } from '../../config/storeConfig';
import { formatPrice } from '../../utils/formatters';
import { createWhatsAppUrl, buildWhatsAppMessage } from '../../utils/whatsappBuilder';

export const CheckoutForm = () => {
  const { 
    isCheckoutOpen, 
    closeCheckout, 
    openCart, 
    cartItems, 
    subtotal, 
    totalItemsCount,
    customerDetails,
    setCustomerDetails,
    clearSavedCustomerDetails,
    setOrderSuccessData,
    deliveryLocation,
    openLocationModal
  } = useCart();

  const { user } = useAuth();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-populate customer details from user profile if available
  useEffect(() => {
    if (isCheckoutOpen && user) {
      setCustomerDetails(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        phone: prev.phone || user.phone || '',
        address: prev.address || user.address || deliveryLocation?.formattedAddress || '',
        landmark: prev.landmark || user.landmark || ''
      }));
    } else if (isCheckoutOpen && customerDetails.orderType === 'delivery' && (!customerDetails.address || !customerDetails.address.trim()) && deliveryLocation?.formattedAddress) {
      setCustomerDetails(prev => ({
        ...prev,
        address: deliveryLocation.formattedAddress
      }));
    }
  }, [isCheckoutOpen, user, deliveryLocation, setCustomerDetails]);

  if (!isCheckoutOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!customerDetails.name || !customerDetails.name.trim()) {
      newErrors.name = 'Please enter your full name';
    }

    const cleanedPhone = (customerDetails.phone || '').replace(/[^0-9]/g, '');
    if (!cleanedPhone) {
      newErrors.phone = 'Please enter your mobile phone number';
    } else if (cleanedPhone.length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    } else if (!/^[6-9]\d{9}$/.test(cleanedPhone.slice(-10))) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (customerDetails.orderType === 'delivery') {
      if (!customerDetails.address || !customerDetails.address.trim()) {
        newErrors.address = 'Please enter your complete delivery address (Door No, Street, Village/Area)';
      } else if (customerDetails.address.trim().length < 8) {
        newErrors.address = 'Please provide a detailed address for delivery';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setCustomerDetails(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleProceedToWhatsApp = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const waUrl = createWhatsAppUrl(cartItems, customerDetails, deliveryLocation);
    const orderText = buildWhatsAppMessage(cartItems, customerDetails, deliveryLocation);

    setOrderSuccessData({
      waUrl,
      orderText,
      totalItemsCount,
      subtotal,
      customerDetails: { ...customerDetails },
      deliveryLocation: deliveryLocation ? { ...deliveryLocation } : null
    });

    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden my-6 border border-gray-100">
        
        {/* Modal Header */}
        <div className="bg-brand-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                closeCheckout();
                openCart();
              }}
              className="p-2 rounded-xl hover:bg-brand-800 text-white transition-colors cursor-pointer"
              aria-label="Back to cart"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Order & Delivery Details</h2>
              <p className="text-xs text-brand-200 font-medium">
                {totalItemsCount} items • {formatPrice(subtotal)}
              </p>
            </div>
          </div>

          <button
            onClick={closeCheckout}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-brand-800 transition-colors cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleProceedToWhatsApp} className="p-6 sm:p-7 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Order Type Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
              Select Order Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              
              {/* Home Delivery */}
              <button
                type="button"
                onClick={() => handleInputChange('orderType', 'delivery')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  customerDetails.orderType === 'delivery'
                    ? 'border-brand-700 bg-brand-50/70 ring-2 ring-brand-700/20'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 ${customerDetails.orderType === 'delivery' ? 'bg-brand-800 text-white' : 'bg-gray-100 text-gray-700'}`}>
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-gray-900">
                    Home Delivery
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-tight">
                    To your doorstep
                  </div>
                </div>
              </button>

              {/* Store Pickup */}
              <button
                type="button"
                onClick={() => handleInputChange('orderType', 'pickup')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  customerDetails.orderType === 'pickup'
                    ? 'border-brand-700 bg-brand-50/70 ring-2 ring-brand-700/20'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 ${customerDetails.orderType === 'pickup' ? 'bg-brand-800 text-white' : 'bg-gray-100 text-gray-700'}`}>
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-gray-900">
                    Store Pickup
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-tight">
                    Collect at store
                  </div>
                </div>
              </button>

            </div>
          </div>

          {/* Customer Name */}
          <div>
            <label htmlFor="cust-name" className="block text-xs font-bold text-gray-900 mb-1.5">
              Your Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="cust-name"
                type="text"
                placeholder="e.g. S. Rama Krishna"
                value={customerDetails.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full pl-10 pr-3 py-3 bg-gray-50 border rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-brand-700'
                }`}
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="cust-phone" className="block text-xs font-bold text-gray-900 mb-1.5">
              Mobile Phone Number (WhatsApp) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="cust-phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="10-digit mobile number (e.g. 9551624444)"
                value={customerDetails.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full pl-10 pr-3 py-3 bg-gray-50 border rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-brand-700'
                }`}
              />
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {errors.phone ? (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.phone}</span>
              </p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                Store will contact this number to confirm item availability and final bill.
              </p>
            )}
          </div>

          {/* Conditional Delivery Address Section */}
          {customerDetails.orderType === 'delivery' && (
            <div className="space-y-4 pt-2 border-t border-gray-100">
              
              {/* Delivery Location Summary Card */}
              {deliveryLocation && (
                <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="p-2 rounded-xl bg-emerald-800 text-white shrink-0 mt-0.5 shadow-2xs">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-gray-900">
                          {deliveryLocation.shortAddress || deliveryLocation.village || 'Delivery Area'}
                        </span>
                        {deliveryLocation.isSpvPriority && (
                          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                            Direct Delivery Area
                          </span>
                        )}
                        {deliveryLocation.accuracy && (
                          <span className="text-[10px] font-medium text-gray-600 bg-white border border-gray-200 px-1.5 py-0.5 rounded">
                            ~{Math.round(deliveryLocation.accuracy)}m GPS
                          </span>
                        )}
                      </div>
                      <p className="text-[11.5px] text-gray-600 font-medium line-clamp-1 mt-0.5">
                        {deliveryLocation.formattedAddress}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      closeCheckout();
                      openLocationModal();
                    }}
                    className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-white hover:bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Change</span>
                  </button>
                </div>
              )}

              {/* Complete Delivery Address Input */}
              <div>
                <label htmlFor="cust-address" className="block text-xs font-bold text-gray-900 mb-1.5">
                  Complete Delivery Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    id="cust-address"
                    rows={2}
                    placeholder="House / Door No., Street Name, Colony / Village (e.g. Main Bazar, Ramavaram)"
                    value={customerDetails.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full p-3 bg-gray-50 border rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      errors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-brand-700'
                    }`}
                  />
                </div>

                {deliveryLocation?.formattedAddress && customerDetails.address !== deliveryLocation.formattedAddress && (
                  <button
                    type="button"
                    onClick={() => handleInputChange('address', deliveryLocation.formattedAddress)}
                    className="mt-1.5 text-left text-[11.5px] font-bold text-brand-800 hover:text-brand-900 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer max-w-full"
                  >
                    <MapPin className="w-3.5 h-3.5 text-brand-800 shrink-0" />
                    <span className="truncate">Auto-fill saved address: {deliveryLocation.shortAddress || deliveryLocation.formattedAddress}</span>
                  </button>
                )}

                {errors.address && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.address}</span>
                  </p>
                )}
              </div>

              {/* Landmark */}
              <div>
                <label htmlFor="cust-landmark" className="block text-xs font-bold text-gray-900 mb-1.5">
                  Nearby Landmark <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    id="cust-landmark"
                    type="text"
                    placeholder="e.g. Near Water Tank, Opposite Temple"
                    value={customerDetails.landmark || ''}
                    onChange={(e) => handleInputChange('landmark', e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-700 transition-all"
                  />
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Delivery Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-900 leading-relaxed font-medium">
                  {STORE_CONFIG.policies.deliveryDisclaimer}
                </p>
              </div>

            </div>
          )}

          {/* Store Pickup Notice */}
          {customerDetails.orderType === 'pickup' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-2.5">
              <Store className="w-4 h-4 text-brand-800 shrink-0 mt-0.5" />
              <div className="text-xs text-brand-900 leading-relaxed">
                <span className="font-bold">Store Pickup Point:</span> {STORE_CONFIG.location.fullAddress}. Your order will be packed and ready for quick pickup.
              </div>
            </div>
          )}

          {/* Order Notes */}
          <div>
            <label htmlFor="cust-instructions" className="block text-xs font-bold text-gray-900 mb-1.5">
              Order Notes / Brand Preference <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              id="cust-instructions"
              type="text"
              placeholder="e.g. Please deliver fresh bread batch"
              value={customerDetails.instructions || ''}
              onChange={(e) => handleInputChange('instructions', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-700 transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 space-y-2 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-800 hover:bg-brand-900 text-white font-bold text-sm sm:text-base py-3.5 px-4 rounded-xl transition-all shadow-subtle flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer disabled:opacity-70"
            >
              <span>Review Order on WhatsApp</span>
              <span className="bg-brand-950/40 text-xs px-2 py-0.5 rounded-md">
                {formatPrice(subtotal)}
              </span>
            </button>

            <p className="text-[11px] text-center text-gray-400">
              No immediate online payment required • Pay on Delivery or Store Counter
            </p>
          </div>

        </form>

      </div>
    </div>
  );
};
