import React from 'react';
import { Phone, MapPin, Clock, ExternalLink, Navigation, Store, ShieldCheck, MessageCircle, User } from 'lucide-react';
import { STORE_CONFIG } from '../../config/storeConfig';

export const ContactPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-14 animate-in fade-in slide-in-from-bottom-3 duration-300">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <div className="text-xs font-bold text-brand-700 uppercase tracking-wider mb-2">
          Get in Touch
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Contact & Store Location
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
          Need help with your grocery order or want to visit us in person? Here is everything you need to reach Sri Prasanna Vigneswara Superbazaar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
        
        {/* Contact Info Cards */}
        <div className="space-y-4 sm:space-y-5">
          
          {/* Card 1: Call Store */}
          <div className="bg-white border border-gray-200/80 rounded-3xl p-5 sm:p-7 shadow-xs hover:shadow-card transition-all duration-300 group">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-gray-900">
                  Call the Store
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5 mb-3.5">
                  For immediate grocery inquiries, stock checks or order assistance.
                </p>
                <a
                  href={`tel:${STORE_CONFIG.contact.phoneNumber}`}
                  className="inline-flex items-center gap-2 bg-brand-800 hover:bg-brand-900 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-subtle active:scale-95 cursor-pointer hover:shadow-md"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {STORE_CONFIG.contact.formattedPhone}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Card 2: WhatsApp Chat */}
          <div className="bg-white border border-gray-200/80 rounded-3xl p-5 sm:p-7 shadow-xs hover:shadow-card transition-all duration-300 group">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-green-50 text-[#25D366] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-gray-900">
                  WhatsApp Support & Orders
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5 mb-3.5">
                  Send your shopping list or questions directly to our store team.
                </p>
                <a
                  href={`https://wa.me/${STORE_CONFIG.contact.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-subtle cursor-pointer active:scale-95 hover:shadow-md"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp Message</span>
                </a>
              </div>
            </div>
          </div>

          {/* Card 3: Address & Working Hours */}
          <div className="bg-white border border-gray-200/80 rounded-3xl p-5 sm:p-7 shadow-xs hover:shadow-card transition-all duration-300 space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Store Address
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 font-medium mt-0.5">
                  {STORE_CONFIG.location.fullAddress}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-3 border-t border-gray-100">
              <Clock className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Store Timings
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 font-medium mt-0.5">
                  {STORE_CONFIG.contact.timings}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-3 border-t border-gray-100">
              <User className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Proprietor
                </h3>
                <p className="text-xs sm:text-sm text-gray-800 font-bold mt-0.5">
                  {STORE_CONFIG.leadership.proprietor}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={STORE_CONFIG.location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs sm:text-sm font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 border border-gray-200 active:scale-[0.99]"
              >
                <Navigation className="w-4 h-4 text-brand-700" />
                <span>Get Google Maps Directions</span>
              </a>
            </div>
          </div>

        </div>

        {/* Right: Embedded Google Map */}
        <div className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-xs hover:shadow-card transition-all duration-300">
          <div className="p-4 sm:p-5 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-wider">
              <Store className="w-4 h-4 text-brand-700" />
              <span>Location on Map</span>
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

          <div className="w-full h-80 sm:h-96 bg-gray-100">
            <iframe
              title="Sri Prasanna Vigneswara Superbazaar Map"
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

          <div className="p-4 sm:p-5 bg-gray-50/70 border-t border-gray-100 text-xs text-gray-500 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
            <span>
              {STORE_CONFIG.policies.deliveryDisclaimer}
            </span>
          </div>
        </div>

      </div>

      {/* Small Developer Contact Option */}
      <div className="mt-8 pt-4 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-500">
          Website & Digital Commerce Development:{' '}
          <a
            href="https://charan.ofzen.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-800 hover:text-emerald-900 font-semibold hover:underline inline-flex items-center gap-1"
          >
            <span>Charan Tej Neelam</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </p>
      </div>

    </div>
  );
};
