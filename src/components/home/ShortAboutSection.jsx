import React from 'react';
import { ShieldCheck, HeartHandshake, Truck, Store, MapPin, Phone, MessageCircle, ArrowRight } from 'lucide-react';
import { STORE_CONFIG } from '../../config/storeConfig';

export const ShortAboutSection = ({ onShopClick, onAboutClick }) => {
  return (
    <section className="bg-white py-14 sm:py-18">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl">
          
          {/* Subtle Background Pattern Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-700/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/20 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-emerald-200 text-xs font-bold uppercase tracking-wider">
                <Store className="w-3.5 h-3.5" />
                <span>About Sri Prasanna Vigneswara Superbazaar</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                Everything your home needs, close to home.
              </h2>

              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
                Serving families across <span className="text-white font-bold">Ramavaram, Kutukuluru, Someswaram, Machavaram, Rayavaram, Mandapeta</span> and surrounding villages. We bring the convenience of a modern supermarket with fair local pricing and trusted quality.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <ShieldCheck className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white">100% Genuine Brands</div>
                    <div className="text-[11px] text-emerald-200/80 mt-0.5 leading-tight">Aashirvaad, Tata, Heritage & Amul</div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <Truck className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white">Village Doorstep Delivery</div>
                    <div className="text-[11px] text-emerald-200/80 mt-0.5 leading-tight">Fast delivery across local mandals</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={onShopClick}
                  className="px-5 py-3 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 font-extrabold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Start Shopping Online</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={STORE_CONFIG.location.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-emerald-300" />
                  <span>Locate Store on Google Maps</span>
                </a>
              </div>
            </div>

            {/* Right Card: Quick Contact & Storefront Info */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-3 pb-3 border-b border-white/15">
                <img
                  src="/logo.png"
                  alt={STORE_CONFIG.name}
                  className="h-12 w-auto object-contain brightness-110 shrink-0"
                />
                <div>
                  <div className="text-sm font-extrabold text-white">{STORE_CONFIG.shortName}</div>
                  <div className="text-xs text-emerald-200">Physical Store & Express Pickup</div>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-emerald-100">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                  <span>{STORE_CONFIG.location.fullAddress}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Store className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>Timings: {STORE_CONFIG.contact.timings}</span>
                </div>
              </div>

              <div className="pt-2 grid grid-cols-2 gap-2">
                <a
                  href={`tel:${STORE_CONFIG.contact.phoneNumber}`}
                  className="py-2.5 px-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-center font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Store</span>
                </a>

                <a
                  href={`https://wa.me/${STORE_CONFIG.contact.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-center font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
