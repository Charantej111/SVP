import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '../shop/ProductCard';

export const CategoryProductShelf = ({ 
  title, 
  subtitle, 
  products, 
  onViewAll, 
  bgLight = false 
}) => {
  if (!products || products.length === 0) return null;

  return (
    <section className={`py-6 sm:py-8 border-b border-[#E2E2E7]/80 ${bgLight ? 'bg-[#F4F4F6]' : 'bg-white'}`}>
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Shelf Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[18px] sm:text-[22px] font-extrabold text-[#02060C] tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[12px] text-[#686B78] font-medium mt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-[12px] sm:text-[13px] font-extrabold text-[#0C831F] hover:text-[#0A6E1A] flex items-center gap-1 transition-colors group shrink-0 cursor-pointer"
            >
              <span>See all</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        {/* Instamart Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
