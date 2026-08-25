import React from 'react';
import { MapPin, Phone, Clock, ShieldCheck, ExternalLink } from 'lucide-react';
import { STORE_CONFIG } from '../../config/storeConfig';
import { DEPARTMENTS } from '../../data/categoriesData';

export const Footer = ({ setCurrentView, onSelectDepartment }) => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-24 md:pb-16 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Store Info with Official Logo */}
          <div className="space-y-3">
            <div className="bg-white/10 p-2.5 rounded-2xl inline-block mb-3 border border-white/10">
              <img 
                src="/logo.png" 
                alt={STORE_CONFIG.name} 
                className="h-12 w-auto object-contain brightness-105"
              />
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              {STORE_CONFIG.description}
            </p>
            <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-400 pt-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{STORE_CONFIG.location.fullAddress}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{STORE_CONFIG.contact.timings}</span>
            </div>
          </div>

          {/* Quick Departments */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Departments
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-gray-400">
              {DEPARTMENTS.map(dept => (
                <li key={dept.id}>
                  <button
                    onClick={() => {
                      if (onSelectDepartment) onSelectDepartment(dept.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors text-left font-medium cursor-pointer"
                  >
                    {dept.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support with Official WhatsApp Icon */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Store & Orders
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-gray-400 font-medium">
              <li>
                <a 
                  href={`tel:${STORE_CONFIG.contact.phoneNumber}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-brand-500" />
                  <span>Call: {STORE_CONFIG.contact.formattedPhone}</span>
                </a>
              </li>
              <li>
                <a 
                  href={`https://wa.me/${STORE_CONFIG.contact.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  {/* User Provided Official WhatsApp SVG Logo */}
                  <svg 
                    viewBox="-2.73 0 1225.016 1225.016" 
                    className="w-4 h-4" 
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
                  <span>WhatsApp: {STORE_CONFIG.contact.formattedWhatsApp}</span>
                </a>
              </li>
              <li>
                <a 
                  href={STORE_CONFIG.location.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-emerald-400 hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open in Google Maps</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Delivery Note */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Ordering & Delivery
            </h4>
            <div className="bg-gray-800/80 border border-gray-700 rounded-2xl p-4">
              <div className="flex items-start gap-2.5 text-xs text-gray-300 leading-relaxed font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {STORE_CONFIG.policies.deliveryDisclaimer}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3.5 leading-relaxed">
              Order via website cart, send to WhatsApp, and our staff will confirm item availability and final bill.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <div>
            © {new Date().getFullYear()} {STORE_CONFIG.name}. All rights reserved.
          </div>
          <div>
            Kutukuluru Rd, Ramavaram, Kutukuluru, Andhra Pradesh 533264
          </div>
        </div>

      </div>
    </footer>
  );
};
