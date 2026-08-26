import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import banner1 from '../../assets/banner_1.png';
import banner2 from '../../assets/banner_2.png';
import banner3 from '../../assets/Banner_3.png';

export const InstamartHeroBanner = ({ onShopClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const bannerImages = [
    banner1,
    banner2,
    banner3
  ];

  // Auto slide with pause on hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bannerImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [bannerImages.length, isPaused]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setCurrentSlide(prev => (prev + 1) % bannerImages.length);
    } else if (isRightSwipe) {
      setCurrentSlide(prev => (prev - 1 + bannerImages.length) % bannerImages.length);
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide(prev => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide(prev => (prev + 1) % bannerImages.length);
  };

  return (
    <section className="bg-white py-3 sm:py-5 border-b border-[#E2E2E7]">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        
        {/* Banner Container with Swipe & Hover Controls */}
        <div 
          onClick={onShopClick}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-full aspect-[22/10] sm:aspect-[23/9] rounded-2xl sm:rounded-[28px] overflow-hidden shadow-card border border-[#E2E2E7] bg-[#F8F9FA] relative group cursor-pointer active:scale-[0.99] transition-all duration-300"
        >
          {/* Banner Images with Smooth Cross-Fade */}
          {bannerImages.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`SPV Super Bazar Banner ${index + 1}`}
              className={`absolute top-0 left-0 w-full h-auto transition-all duration-700 ease-in-out select-none ${
                index === currentSlide 
                  ? 'opacity-100 scale-100 z-1' 
                  : 'opacity-0 scale-95 pointer-events-none z-0'
              }`}
              loading={index === 0 ? "eager" : "lazy"}
            />
          ))}

          {/* Desktop Previous / Next Controls */}
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md backdrop-blur-xs hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md backdrop-blur-xs hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Quick Clickable Shop Overlay Pill */}
          <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 z-20">
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

        {/* Page Indicator Dots */}
        <div className="flex justify-center items-center gap-2 mt-3">
          {bannerImages.map((_, index) => (
            <button 
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(index);
              }}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentSlide ? 'bg-brand-800 w-6' : 'bg-gray-300 hover:bg-gray-400 w-2'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
