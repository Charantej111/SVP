import React, { useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '../shop/ProductCard';

export const CategoryProductShelf = ({ 
  title, 
  subtitle, 
  products, 
  onViewAll, 
  bgLight = false 
}) => {
  const scrollContainerRef = useRef(null);

  if (!products || products.length === 0) return null;

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  return (
    <section className={`py-5 sm:py-7 border-b border-[#E2E2E7]/80 ${bgLight ? 'bg-[#F8F9FA]' : 'bg-white'}`}>
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        
        {/* Shelf Header */}
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-[17px] sm:text-[20px] font-extrabold text-[#02060C] tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[11px] sm:text-[12px] text-[#686B78] font-medium mt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Desktop Navigation Chevrons */}
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={scrollLeft}
                aria-label="Scroll Left"
                className="w-7 h-7 rounded-full bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 flex items-center justify-center transition-colors shadow-2xs cursor-pointer active:scale-90"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={scrollRight}
                aria-label="Scroll Right"
                className="w-7 h-7 rounded-full bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 flex items-center justify-center transition-colors shadow-2xs cursor-pointer active:scale-90"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {onViewAll && (
              <button
                onClick={onViewAll}
                className="text-[11px] sm:text-[12px] font-extrabold text-[#0C831F] hover:text-[#0A6E1A] flex items-center gap-1 transition-colors group shrink-0 cursor-pointer pl-1"
              >
                <span>See all</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* Instamart Horizontal Product Carousel with Snap Scroll */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-2.5 sm:gap-3.5 pb-2 pt-1 -mx-3 px-3 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-none scroll-smooth"
        >
          {products.map((product) => (
            <div 
              key={product.id} 
              className="w-[155px] sm:w-[190px] shrink-0 snap-start flex flex-col"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
