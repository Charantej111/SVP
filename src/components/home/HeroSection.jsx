import React from 'react';
import { ShoppingBag, MapPin, CheckCircle2 } from 'lucide-react';
import { STORE_CONFIG } from '../../config/storeConfig';
import { CategoryBannerImage } from '../common/CategoryBannerImage';

export const HeroSection = ({ onShopClick, onDirectionsClick }) => {
  return (
    <section className="bg-gradient-to-b from-gray-50/60 to-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column */}
          <div className="md:col-span-7 space-y-5">
            
            {/* Pill */}
            <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 px-3.5 py-1.5 rounded-full text-xs font-semibold text-brand-800">
              <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse"></span>
              <span>Neighbourhood Supermarket • Kutukuluru & Ramavaram</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
              Everything your home needs, <br />
              <span className="text-brand-800">close to home.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-gray-600 max-w-lg leading-relaxed font-normal">
              Fresh groceries, everyday staples, dairy and household essentials from <strong className="font-semibold text-gray-900">Sri Prasanna Vigneswara Superbazaar</strong>. Build your cart from home and send your order straight to WhatsApp.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onShopClick}
                className="bg-brand-800 hover:bg-brand-900 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-subtle transition-all flex items-center gap-2 active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop Groceries</span>
              </button>

              <button
                onClick={onDirectionsClick}
                className="bg-white hover:bg-gray-50 text-gray-800 font-semibold text-xs sm:text-sm px-5 py-3.5 rounded-xl border border-gray-200 shadow-subtle transition-all flex items-center gap-2 active:scale-95"
              >
                <MapPin className="w-4 h-4 text-accent-500" />
                <span>Get Directions</span>
              </button>
            </div>

            {/* Trust Points */}
            <div className="pt-2 flex flex-wrap items-center gap-5 text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                100% Genuine FMCG Brands
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                WhatsApp Order & Delivery
              </span>
            </div>

          </div>

          {/* Right Column: Visual Frame with Logo */}
          <div className="md:col-span-5">
            <div className="bg-white border border-gray-200/80 rounded-3xl p-5 sm:p-6 shadow-card hover:shadow-card-hover transition-all duration-300">
              
              {/* Official Store Logo */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <img 
                  src="/logo.png" 
                  alt="Sri Prasanna Vigneswara Superbazaar Logo" 
                  className="h-12 sm:h-14 w-auto object-contain"
                />
                <div className="bg-brand-50 text-brand-800 text-xs font-semibold px-2.5 py-1 rounded-lg border border-brand-100 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-brand-700" />
                  <span>Ramavaram</span>
                </div>
              </div>

              {/* Showcase Banner */}
              <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden bg-gray-50/80 border border-gray-100 mb-4 flex items-center justify-center">
                <CategoryBannerImage categoryId="staples" />
              </div>

              {/* Bottom store info */}
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Hours: {STORE_CONFIG.contact.timings}</span>
                <span className="font-semibold text-brand-700">Open Daily</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
