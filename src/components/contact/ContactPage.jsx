import React from 'react';
import { Phone, MapPin, Clock, ExternalLink, Navigation, Store, ShieldCheck } from 'lucide-react';
import { STORE_CONFIG } from '../../config/storeConfig';

export const ContactPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="text-xs font-bold text-brand-700 uppercase tracking-wider mb-2">
          Get in Touch
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Contact & Store Location
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-2 leading-relaxed">
          Need help with your grocery order or want to visit us in person? Here is everything you need to reach Sri Prasanna Vigneswara Superbazaar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Contact Info Cards */}
        <div className="space-y-5">
          
          {/* Card 1: Call Store */}
          <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-7 shadow-card">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-gray-900">
                  Call the Store
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-4">
                  For immediate grocery inquiries, stock checks or order assistance.
                </p>
                <a
                  href={`tel:${STORE_CONFIG.contact.phoneNumber}`}
                  className="inline-flex items-center gap-2 bg-brand-800 hover:bg-brand-900 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition-colors shadow-subtle"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {STORE_CONFIG.contact.formattedPhone}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Card 2: WhatsApp Chat (Using User Provided Official WhatsApp Logo) */}
          <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-7 shadow-card">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-[#25D366] flex items-center justify-center shrink-0">
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
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-gray-900">
                  WhatsApp Support & Orders
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-4">
                  Send your shopping list or questions directly to our store team.
                </p>
                <a
                  href={`https://wa.me/${STORE_CONFIG.contact.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition-colors shadow-subtle cursor-pointer"
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
                  <span>WhatsApp Message</span>
                </a>
              </div>
            </div>
          </div>

          {/* Card 3: Address & Working Hours */}
          <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-7 shadow-card space-y-4">
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

            <div className="pt-2">
              <a
                href={STORE_CONFIG.location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs sm:text-sm font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 border border-gray-200"
              >
                <Navigation className="w-4 h-4 text-brand-700" />
                <span>Get Google Maps Directions</span>
              </a>
            </div>
          </div>

        </div>

        {/* Right: Embedded Google Map */}
        <div className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-card">
          <div className="p-5 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between">
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

    </div>
  );
};
