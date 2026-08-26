import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';

export const InstamartHeroBanner = ({ onShopClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const bannerImages = [
    '/banner.png',
    '/banner_2.png',
    '/Banner_3.png'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bannerImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [bannerImages.length]);

  return (
    <section className="bg-white py-3 sm:py-5 border-b border-[#E2E2E7]">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        
        {/* User's Custom Hero Banners Slider Container (Cropped only at the bottom, zero left/right cropping) */}
        <div 
          onClick={onShopClick}
          className="w-full aspect-[22/10] sm:aspect-[23/9] rounded-2xl sm:rounded-[28px] overflow-hidden shadow-card border border-[#E2E2E7] bg-[#F8F9FA] relative group cursor-pointer active:scale-[0.99] transition-transform duration-200"
        >
          {/* Official Banner Images (w-full h-auto ensures 100% width is visible on all screens, bottom is overflow-hidden clipped) */}
          {bannerImages.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`SPV Super Bazar Banner ${index + 1}`}
              className={`absolute top-0 left-0 w-full h-auto transition-all duration-700 ease-in-out ${
                index === currentSlide 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-95 pointer-events-none'
              }`}
              loading={index === 0 ? "eager" : "lazy"}
            />
          ))}

          {/* Quick Clickable Shop Overlay Pill */}
          <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShopClick();
              }}
              className="bg-brand-800 hover:bg-brand-900 text-white font-extrabold text-[11px] sm:text-[14px] px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg transition-all flex items-center gap-1.5 active:scale-95 uppercase tracking-tight cursor-pointer font-sans"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>SHOP NOW</span>
            </button>
          </div>
        </div>

        {/* Instamart Page Indicator Dots (Only the interactive web dots are visible now) */}
        <div className="flex justify-center items-center gap-2 mt-3">
          {bannerImages.map((_, index) => (
            <button 
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(index);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                index === currentSlide ? 'bg-brand-800 w-5' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
