import React, { useState, useEffect, useRef } from 'react';
import { Store, MapPin, Navigation, Clock, ChevronLeft, ChevronRight, Eye, Pause, Play, Sparkles } from 'lucide-react';
import { STORE_CONFIG } from '../../config/storeConfig';

const STORE_SLIDES = [
  {
    id: 1,
    title: "Storefront & Ample Parking",
    subtitle: "Located on Kutukuluru Main Road, Ramavaram",
    description: "Spacious physical supermarket with dedicated customer parking and easy vehicle access from Ramavaram and Kutukuluru.",
    image: "/banner.png",
    badge: "Main Road Frontage",
    highlights: ["Wide Road Access", "Easy Bike & Car Parking", "Air-Cooled Interior"]
  },
  {
    id: 2,
    title: "Organized Grocery & Staples Aisles",
    subtitle: "Premium Brands Replenished Daily",
    description: "Fully stocked shelves with Aashirvaad Atta, Fortune Oils, Tata Dals, Everest Spices, and premium rice varieties at transparent prices.",
    image: "/banner_2.png",
    badge: "100% Genuine Brands",
    highlights: ["Chakki Fresh Atta", "Pure Cooking Oils", "Clean Pulses & Dals"]
  },
  {
    id: 3,
    title: "Fresh Dairy, Bread & Breakfast",
    subtitle: "Heritage, Amul & Daily Essentials",
    description: "Temperature-controlled dairy coolers storing fresh milk packets, curd, paneer, butter, bread, and breakfast items every morning.",
    image: "/Banner_3.png",
    badge: "Fresh Daily Batch",
    highlights: ["Heritage & Amul Milk", "Fresh Paneer & Butter", "Daily Bread & Eggs"]
  }
];

export const StoreGallery = ({ onShopClick, onAboutClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const timerRef = useRef(null);

  // Auto-play timer with pause on hover
  useEffect(() => {
    if (isAutoPlaying && !isHovered) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % STORE_SLIDES.length);
      }, 4000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, isHovered]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + STORE_SLIDES.length) % STORE_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % STORE_SLIDES.length);
  };

  const activeSlide = STORE_SLIDES[currentIndex];

  return (
    <section className="bg-white py-12 sm:py-16 border-t border-gray-100 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-brand-800 font-bold text-xs uppercase tracking-wider mb-1">
              <Store className="w-4 h-4" />
              <span>Physical Supermarket Storefront</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Sri Prasanna Vigneswara Superbazaar
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium max-w-xl">
              Visit our clean, well-stocked supermarket on Kutukuluru Road, Ramavaram. Walk in or order online for fast doorstep delivery.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {onAboutClick && (
              <button
                onClick={onAboutClick}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs sm:text-sm border border-emerald-200 transition-all cursor-pointer shadow-2xs"
              >
                <span>Our Story & Team</span>
              </button>
            )}

            <a
              href={STORE_CONFIG.location.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-bold text-xs sm:text-sm transition-all shadow-subtle cursor-pointer active:scale-95"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
            </a>
          </div>
        </div>

        {/* Animated Main Showcase */}
        <div 
          className="relative rounded-3xl overflow-hidden bg-gray-900 border border-gray-200 shadow-2xl group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Visual Slide with Smooth Crossfade Animation */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-gray-950">
            {STORE_SLIDES.map((slide, idx) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-700 ease-out ${
                  idx === currentIndex 
                    ? 'opacity-100 scale-100 z-10' 
                    : 'opacity-0 scale-105 pointer-events-none z-0'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover brightness-95 transform transition-transform duration-1000 group-hover:scale-105"
                />
                
                {/* Gradient Overlays for High-Contrast Readable Typography */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent hidden sm:block" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 z-20">
                  <div className="max-w-2xl text-white space-y-2.5">
                    
                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/90 text-white text-[11px] font-extrabold uppercase tracking-wide backdrop-blur-xs border border-emerald-500/40 shadow-sm">
                      <Sparkles className="w-3 h-3" />
                      <span>{slide.badge}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-3xl font-black text-white leading-tight">
                      {slide.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 max-w-xl font-normal leading-relaxed">
                      {slide.description}
                    </p>

                    {/* Feature Chips */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      {slide.highlights.map((h, i) => (
                        <span 
                          key={i} 
                          className="text-[11px] font-semibold bg-white/15 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg border border-white/20"
                        >
                          ✓ {h}
                        </span>
                      ))}
                    </div>

                  </div>
                </div>

              </div>
            ))}

            {/* Slide Navigation Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer border border-white/20"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer border border-white/20"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Quick Zoom Button */}
            <button
              onClick={() => setLightboxImage(activeSlide)}
              className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-black/40 hover:bg-black/80 backdrop-blur-md text-white transition-all text-xs font-bold flex items-center gap-1.5 border border-white/20 cursor-pointer"
              title="View full image"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Zoom Photo</span>
            </button>
          </div>

          {/* Bottom Thumbnails & Progress Bar */}
          <div className="bg-gray-950 p-3 sm:p-4 border-t border-white/10 flex items-center justify-between gap-4">
            
            {/* Slide Indicator Dots */}
            <div className="flex items-center gap-2">
              {STORE_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    idx === currentIndex 
                      ? 'w-8 h-2 bg-brand-500' 
                      : 'w-2 h-2 bg-gray-600 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Auto-play toggle & Status */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-gray-400 font-medium hidden sm:inline">
                {currentIndex + 1} of {STORE_SLIDES.length}
              </span>

              <button
                onClick={() => setIsAutoPlaying(prev => !prev)}
                className="text-gray-400 hover:text-white text-xs flex items-center gap-1 cursor-pointer transition-colors p-1"
                title={isAutoPlaying ? "Pause autoplay" : "Resume autoplay"}
              >
                {isAutoPlaying ? (
                  <Pause className="w-3.5 h-3.5" />
                ) : (
                  <Play className="w-3.5 h-3.5" />
                )}
                <span className="text-[10.5px] font-semibold">{isAutoPlaying ? 'Playing' : 'Paused'}</span>
              </button>
            </div>

          </div>
        </div>

        {/* Store Highlights Strip */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-center">
            <div className="text-sm sm:text-base font-extrabold text-brand-900">7 AM – 9:30 PM</div>
            <div className="text-[11px] text-gray-500 font-medium mt-0.5">Open All 7 Days</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-center">
            <div className="text-sm sm:text-base font-extrabold text-brand-900">1000+ FMCG Items</div>
            <div className="text-[11px] text-gray-500 font-medium mt-0.5">Everyday Essentials</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-center">
            <div className="text-sm sm:text-base font-extrabold text-brand-900">10+ Villages</div>
            <div className="text-[11px] text-gray-500 font-medium mt-0.5">Direct Doorstep Delivery</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-center">
            <div className="text-sm sm:text-base font-extrabold text-brand-900">Kutukuluru Road</div>
            <div className="text-[11px] text-gray-500 font-medium mt-0.5">Ramavaram Main Center</div>
          </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl border border-white/20"
          >
            <div className="relative aspect-[16/10] bg-black">
              <img
                src={lightboxImage.image}
                alt={lightboxImage.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-5 sm:p-6 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-gray-900">{lightboxImage.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{lightboxImage.description}</p>
              </div>
              <button
                onClick={() => setLightboxImage(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
