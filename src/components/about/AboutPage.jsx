import React from 'react';
import { ShieldCheck, HeartHandshake, Truck } from 'lucide-react';
import { STORE_CONFIG } from '../../config/storeConfig';

export const AboutPage = ({ onShopClick, onContactClick }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
      
      {/* Header with Official Logo */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="flex justify-center mb-5">
          <img 
            src="/logo.png" 
            alt={STORE_CONFIG.name} 
            className="h-20 sm:h-24 w-auto object-contain drop-shadow-sm" 
          />
        </div>
        <div className="text-xs font-bold text-brand-700 uppercase tracking-wider mb-2">
          Local Supermarket
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          About {STORE_CONFIG.name}
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-3 leading-relaxed">
          Serving households across Kutukuluru, Ramavaram, and nearby areas with quality groceries, packaged foods, fresh daily essentials and household products.
        </p>
      </div>

      {/* Main Narrative Card */}
      <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-card mb-10 space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
            Your Neighbourhood Supermarket, Now on Your Phone
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed font-normal">
            {STORE_CONFIG.name} was established to provide local families in Ramavaram and Kutukuluru with a clean, well-stocked, and organized supermarket experience. Instead of traveling far or waiting in long lines, our customers can find all everyday pantry items, trusted FMCG brands, fresh dairy, and cleaning supplies under one roof.
          </p>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <h3 className="text-base font-bold text-gray-900 mb-3">
            How Our Online Ordering Works
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed font-normal">
            We believe grocery shopping should be simple and personal. With our digital storefront, you can browse all departments from home, add your items to the cart, specify your delivery address or choose store pickup, and send the complete order directly to our WhatsApp. Our team reviews your items, verifies product stock, and confirms the final bill and delivery time directly with you.
          </p>
        </div>
      </div>

      {/* 3 Core Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white border border-gray-200/80 rounded-3xl p-7 shadow-card hover:shadow-card-hover transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-2">
            100% Genuine Brands
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            We stock verified, authentic products from leading manufacturers like Aashirvaad, Tata, Amul, Britannia, Fortune, and Surf Excel.
          </p>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-3xl p-7 shadow-card hover:shadow-card-hover transition-all">
          <div className="w-12 h-12 rounded-2xl bg-accent-50 text-accent-600 flex items-center justify-center mb-5">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-2">
            Familiar & Friendly
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Personal service from a local team that knows your preferences and values your family’s everyday pantry needs.
          </p>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-3xl p-7 shadow-card hover:shadow-card-hover transition-all">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-5">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-2">
            Pickup & Delivery
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Quick zero-wait store counter pickup or possible direct delivery to your address upon store confirmation.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-brand-900 text-white rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-card">
        <h3 className="text-xl sm:text-2xl font-extrabold">Ready to start shopping?</h3>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-md mx-auto leading-relaxed">
          Explore our complete catalogue of grocery items or visit us in person at Kutukuluru Rd, Ramavaram.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <button
            onClick={onShopClick}
            className="bg-accent-500 hover:bg-accent-600 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-colors active:scale-95 shadow-subtle"
          >
            Shop Groceries
          </button>
          <button
            onClick={onContactClick}
            className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl border border-white/20 transition-colors"
          >
            Contact Store
          </button>
        </div>
      </div>

    </div>
  );
};
