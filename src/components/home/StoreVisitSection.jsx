import React from 'react';
import { MapPin, Phone, Clock, ExternalLink, Navigation } from 'lucide-react';
import { STORE_CONFIG } from '../../config/storeConfig';

export const StoreVisitSection = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 py-14 md:py-20">
      
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <div className="text-xs font-bold text-brand-700 uppercase tracking-wider mb-1.5">
          Store Experience
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Come visit us in Ramavaram
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
          A convenient, well-organized place for everyday groceries and household essentials in Kutukuluru.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Physical Store Cards */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Main Storefront Frame */}
          <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-card">
            <div className="flex items-center gap-4 mb-5">
              <img 
                src="/logo.png" 
                alt={STORE_CONFIG.name} 
                className="h-12 sm:h-14 w-auto object-contain shrink-0" 
              />
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  {STORE_CONFIG.name}
                </h3>
                <p className="text-xs text-gray-500">
                  Physical Storefront & Express Pickup Counter
                </p>
              </div>
            </div>

            {/* Clean Section Visuals */}
            <div className="grid grid-cols-2 gap-3 my-6">
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center">
                <div className="text-sm font-bold text-gray-900">Grocery Aisles</div>
                <div className="text-xs text-gray-500 mt-0.5">Spices, Rice & Dals</div>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center">
                <div className="text-sm font-bold text-gray-900">Dairy Counter</div>
                <div className="text-xs text-gray-500 mt-0.5">Milk, Curd & Bread</div>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center">
                <div className="text-sm font-bold text-gray-900">Household Care</div>
                <div className="text-xs text-gray-500 mt-0.5">Soaps & Cleaners</div>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center">
                <div className="text-sm font-bold text-gray-900">Pickup Counter</div>
                <div className="text-xs text-gray-500 mt-0.5">Ready WhatsApp Orders</div>
              </div>
            </div>

            {/* Address Details */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5 text-gray-800">
                <MapPin className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                <span className="font-medium">{STORE_CONFIG.location.fullAddress}</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-500">
                <Clock className="w-4 h-4 text-accent-500 shrink-0" />
                <span>Store Hours: {STORE_CONFIG.contact.timings}</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-3.5 mt-6">
              <a
                href={STORE_CONFIG.location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-800 hover:bg-brand-900 text-white font-bold text-xs sm:text-sm py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-subtle text-center"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </a>

              <a
                href={`tel:${STORE_CONFIG.contact.phoneNumber}`}
                className="bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs sm:text-sm py-3.5 px-4 rounded-xl border border-gray-200 transition-colors flex items-center justify-center gap-2 text-center shadow-subtle"
              >
                <Phone className="w-4 h-4 text-brand-700" />
                <span>Call Store</span>
              </a>
            </div>

          </div>

        </div>

        {/* Right: Embedded Google Map */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-card">
            
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-700" />
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Store Location Map
                </span>
              </div>
              <a
                href={STORE_CONFIG.location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-brand-800 hover:underline flex items-center gap-1"
              >
                <span>Enlarge Map</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Map Iframe */}
            <div className="w-full h-80 sm:h-96 bg-gray-100 relative">
              <iframe
                title="Sri Prasanna Vigneswara Superbazaar Location"
                src="https://maps.google.com/maps?q=Kutukuluru+Rd,+Ramavaram,+Kutukuluru,+Andhra+Pradesh+533264&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-600 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-700 shrink-0" />
              <span>Located on Kutukuluru Main Road, Ramavaram. Ample parking space available in front of the store.</span>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
};
