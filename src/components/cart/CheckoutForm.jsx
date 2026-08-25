import React, { useState } from 'react';
import { X, ArrowLeft, Truck, Store, MapPin, Phone, User, AlertCircle, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
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
    setOrderSuccessData
  } = useCart();

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    const waUrl = createWhatsAppUrl(cartItems, customerDetails);
    const orderText = buildWhatsAppMessage(cartItems, customerDetails);

    setOrderSuccessData({
      waUrl,
      orderText,
      totalItemsCount,
      subtotal,
      customerDetails: { ...customerDetails }
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
                placeholder="e.g. Ramesh Varma"
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
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-700 transition-all"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-gray-100 space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[52px] bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.99] text-white font-extrabold text-[15px] rounded-2xl shadow-subtle transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              {/* User Provided Official WhatsApp SVG Logo */}
              <svg 
                viewBox="-2.73 0 1225.016 1225.016" 
                className="w-6 h-6" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fill="#E0E0E0" d="M1041.858 178.02C927.206 63.289 774.753.07 612.325 0 277.617 0 5.232 272.298 5.098 606.991c-.039 106.986 27.915 211.42 81.048 303.476L0 1225.016l321.898-84.406c88.689 48.368 188.547 73.855 290.166 73.896h.258.003c334.654 0 607.08-272.346 607.222-607.023.056-162.208-63.052-314.724-177.689-429.463zm-429.533 933.963h-.197c-90.578-.048-179.402-24.366-256.878-70.339l-18.438-10.93-191.021 50.083 51-186.176-12.013-19.087c-50.525-80.336-77.198-173.175-77.16-268.504.111-278.186 226.507-504.503 504.898-504.503 134.812.056 261.519 52.604 356.814 147.965 95.289 95.36 147.728 222.128 147.688 356.948-.118 278.195-226.522 504.543-504.693 504.543z"/>
                <linearGradient id="a" gradientUnits="userSpaceOnUse" x1="609.77" y1="1190.114" x2="609.77" y2="21.084">
                  <stop offset="0" stop-color="#20b038"/>
                  <stop offset="1" stop-color="#60d66a"/>
                </linearGradient>
                <path fill="url(#a)" d="M27.875 1190.114l82.211-300.18c-50.719-87.852-77.391-187.523-77.359-289.602.133-319.398 260.078-579.25 579.469-579.25 155.016.07 300.508 60.398 409.898 169.891 109.414 109.492 169.633 255.031 169.57 409.812-.133 319.406-260.094 579.281-579.445 579.281-.023 0 .016 0 0 0h-.258c-96.977-.031-192.266-24.375-276.898-70.5l-307.188 80.548z"/>
                <path fill-rule="evenodd" clip-rule="evenodd" fill="#FFF" d="M462.273 349.294c-11.234-24.977-23.062-25.477-33.75-25.914-8.742-.375-18.75-.352-28.742-.352-10 0-26.25 3.758-39.992 18.766-13.75 15.008-52.5 51.289-52.5 125.078 0 73.797 53.75 145.102 61.242 155.117 7.5 10 103.758 166.266 256.203 226.383 126.695 49.961 152.477 40.023 179.977 37.523s88.734-36.273 101.234-71.297c12.5-35.016 12.5-65.031 8.75-71.305-3.75-6.25-13.75-10-28.75-17.5s-88.734-43.789-102.484-48.789-23.75-7.5-33.75 7.516c-10 15-38.727 48.773-47.477 58.773-8.75 10.023-17.5 11.273-32.5 3.773-15-7.523-63.305-23.344-120.609-74.438-44.586-39.75-74.688-88.844-83.438-103.859-8.75-15-.938-23.125 6.586-30.602 6.734-6.719 15-17.508 22.5-26.266 7.484-8.758 9.984-15.008 14.984-25.008 5-10.016 2.5-18.773-1.25-26.273s-32.898-81.67-46.234-111.326z"/>
                <path fill="#FFF" d="M1036.898 176.091C923.562 62.677 772.859.185 612.297.114 281.43.114 12.172 269.286 12.039 600.137 12 705.896 39.633 809.13 92.156 900.13L7 1211.067l318.203-83.438c87.672 47.812 186.383 73.008 286.836 73.047h.255.003c330.812 0 600.109-269.219 600.25-600.055.055-160.343-62.328-311.108-175.649-424.53zm-424.601 923.242h-.195c-89.539-.047-177.344-24.086-253.93-69.531l-18.227-10.805-188.828 49.508 50.414-184.039-11.875-18.867c-49.945-79.414-76.312-171.188-76.273-265.422.109-274.992 223.906-498.711 499.102-498.711 133.266.055 258.516 52 352.719 146.266 94.195 94.266 146.031 219.578 145.992 352.852-.118 274.999-223.923 498.749-498.899 498.749z"/>
              </svg>
              <span>Send Order to WhatsApp</span>
            </button>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
              <span>Saved locally for convenience.</span>
              <button
                type="button"
                onClick={clearSavedCustomerDetails}
                className="text-gray-500 hover:text-red-500 font-medium underline cursor-pointer"
              >
                Clear Details
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
