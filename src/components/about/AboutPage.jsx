import React, { useState } from 'react';
import { 
  Store, 
  MapPin, 
  Phone, 
  Clock, 
  Navigation, 
  ShoppingBag, 
  MessageCircle, 
  ArrowLeft, 
  User
} from 'lucide-react';
import { STORE_CONFIG } from '../../config/storeConfig';

const STORE_PHOTOS = [
  {
    id: 'gallery-1',
    src: '/gallery_1.png',
    fallback: '/banner.png'
  },
  {
    id: 'gallery-2',
    src: '/gallery_2.png',
    fallback: '/banner_2.png'
  },
  {
    id: 'gallery-3',
    src: '/gallery_3.png',
    fallback: '/Banner_3.png'
  }
];

export const AboutPage = ({ onShopClick }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-3 duration-300">
      
      {/* Top Back Link */}
      <div className="mb-6">
        <button
          onClick={onShopClick}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-emerald-800 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Groceries</span>
        </button>
      </div>

      {/* Main About Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <img
              src="/logo.png"
              alt={STORE_CONFIG.name}
              className="h-16 w-auto object-contain shrink-0"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {STORE_CONFIG.name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Kutukuluru Road, Ramavaram • PIN 533264
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <a
              href={STORE_CONFIG.location.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer hover:shadow-md"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Directions</span>
            </a>

            <a
              href={`https://wa.me/${STORE_CONFIG.contact.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer hover:shadow-md"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Short & Clean Store Description */}
        <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <p>
            <strong>Sri Prasanna Vigneswara Superbazaar</strong> (SPV Super Bazar) is a registered retail supermarket located on Kutukuluru Road, Ramavaram (Konaseema District, Andhra Pradesh).
          </p>
          <p>
            We supply everyday groceries, branded staples (Aashirvaad Atta, Tata Dals, Fortune Oils, Freedom Sunflower Oil), fresh packaged milk & dairy (Heritage, Amul), beverages, biscuits, soaps, detergents, and household cleaning essentials.
          </p>
          <p>
            Customers can shop directly in our Ramavaram store or place orders via WhatsApp for doorstep delivery across surrounding villages.
          </p>
        </div>

        {/* Store & Contact Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          
          <div className="p-4 rounded-2xl bg-gray-50 hover:bg-gray-50/80 border border-gray-200/80 space-y-2 text-xs sm:text-sm transition-all duration-200 hover:shadow-xs">
            <div className="flex items-start gap-2.5 text-gray-800">
              <MapPin className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-gray-900">Store Address</div>
                <div className="text-xs text-gray-600 mt-0.5">{STORE_CONFIG.location.fullAddress}</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-gray-800 pt-2 border-t border-gray-200">
              <Clock className="w-4 h-4 text-emerald-800 shrink-0" />
              <div>
                <div className="font-bold text-gray-900">Working Hours</div>
                <div className="text-xs text-gray-600 mt-0.5">7:00 AM – 9:30 PM (All 7 Days)</div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 hover:bg-gray-50/80 border border-gray-200/80 space-y-2 text-xs sm:text-sm transition-all duration-200 hover:shadow-xs">
            <div className="flex items-start gap-2.5 text-gray-800">
              <Phone className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-gray-900">Contact / WhatsApp</div>
                <div className="text-xs text-gray-600 mt-0.5">{STORE_CONFIG.contact.formattedPhone}</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-gray-800 pt-2 border-t border-gray-200">
              <User className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-gray-900">Padala Venkata Jayapal Reddy</div>
                <div className="text-xs text-gray-600 mt-0.5">Proprietor • Sri Prasanna Vigneswara Superbazaar</div>
              </div>
            </div>
          </div>

        </div>

        {/* Store Photos (Clean, No Names / Labels) */}
        <div className="pt-2">
          <h2 className="text-sm font-bold text-gray-900 mb-3">
            Store Gallery
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {STORE_PHOTOS.map((photo) => (
              <div 
                key={photo.id} 
                onClick={() => setSelectedPhoto(photo.src)}
                className="group rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer aspect-[16/11]"
              >
                <img
                  src={photo.src}
                  alt="SPV Super Bazar Store Photo"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = photo.fallback;
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Coverage */}
        <div className="pt-2">
          <h2 className="text-sm font-bold text-gray-900 mb-2">
            Delivery Coverage
          </h2>
          <div className="flex flex-wrap gap-2 text-xs text-gray-700">
            {['Ramavaram (533264)', 'Kutukuluru (533264)', 'Someswaram (533261)', 'Machavaram (533261)', 'Rayavaram (533346)', 'Mandapeta (533308)', 'Pasalapudi (533261)', 'Chelluru (533308)'].map((village) => (
              <span key={village} className="px-3 py-1 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-200/70 font-medium">
                {village}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-gray-100 text-center">
          <button
            onClick={onShopClick}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-subtle cursor-pointer hover:shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Browse Online Products</span>
          </button>
        </div>

      </div>

      {/* Lightbox Modal for Photo Zoom */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl border border-white/20"
          >
            <div className="relative aspect-[16/10] bg-black">
              <img
                src={selectedPhoto}
                alt="Store View"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 flex justify-end">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
