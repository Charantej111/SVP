import React from 'react';
import { MapPin, Phone, MessageCircle, Navigation } from 'lucide-react';
import { STORE_CONFIG } from '../../config/storeConfig';

export const Footer = ({ setCurrentView, onSelectDepartment }) => {
  const handleNav = (view) => {
    if (setCurrentView) setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-gray-400 py-10 pb-24 md:pb-10 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Compact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pb-8 border-b border-gray-800">
          
          {/* Col 1: Store Brand */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt={STORE_CONFIG.name} 
                className="h-10 w-auto object-contain brightness-110" 
              />
              <span className="text-sm font-bold text-white leading-tight">
                {STORE_CONFIG.name}
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Kutukuluru Road, Ramavaram, Kutukuluru, Andhra Pradesh 533264
            </p>
            <p className="text-xs text-gray-500">
              Timings: {STORE_CONFIG.contact.timings}
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleNav('home')}
                className="text-left hover:text-white transition-colors cursor-pointer"
              >
                Home
              </button>
              <button
                onClick={() => handleNav('shop')}
                className="text-left hover:text-white transition-colors cursor-pointer"
              >
                Shop All
              </button>
              <button
                onClick={() => handleNav('categories')}
                className="text-left hover:text-white transition-colors cursor-pointer"
              >
                Categories
              </button>
              <button
                onClick={() => handleNav('about')}
                className="text-left hover:text-emerald-400 text-emerald-400 font-semibold transition-colors cursor-pointer"
              >
                About Us
              </button>
              <button
                onClick={() => handleNav('contact')}
                className="text-left hover:text-white transition-colors cursor-pointer"
              >
                Contact
              </button>
              <button
                onClick={() => handleNav('admin')}
                className="text-left text-gray-500 hover:text-emerald-400 font-semibold transition-colors cursor-pointer"
              >
                Staff Portal
              </button>
            </div>
          </div>

          {/* Col 3: Contact & Directions */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">
              Store Help & Orders
            </h4>
            <div className="space-y-2 text-xs">
              <a 
                href={`tel:${STORE_CONFIG.contact.phoneNumber}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Call Store: {STORE_CONFIG.contact.formattedPhone}</span>
              </a>

              <a 
                href={`https://wa.me/${STORE_CONFIG.contact.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                <span>WhatsApp: {STORE_CONFIG.contact.formattedWhatsApp}</span>
              </a>

              <a 
                href={STORE_CONFIG.location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Google Maps Directions</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span>© {new Date().getFullYear()} {STORE_CONFIG.name}.</span>
            <span>•</span>
            <button
              onClick={() => handleNav('admin')}
              className="text-gray-500 hover:text-emerald-400 font-medium transition-colors cursor-pointer"
            >
              Staff Portal
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end text-gray-500">
            <span>Proprietor: <span className="text-gray-400">{STORE_CONFIG.leadership.proprietor}</span></span>
            <span className="hidden sm:inline text-gray-700">•</span>
            <span>
              Developed by{' '}
              <a 
                href="https://charan.ofzen.in/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline transition-colors inline-flex items-center gap-0.5"
              >
                Charan Tej Neelam
              </a>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
