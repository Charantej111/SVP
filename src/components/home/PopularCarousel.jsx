import React from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import { ProductCard } from '../shop/ProductCard';
import { PRODUCTS } from '../../data/productsData';

export const PopularCarousel = ({ onViewAll }) => {
  const popularProducts = PRODUCTS.filter(p => p.isPopular).slice(0, 8);

  return (
    <section className="bg-gray-50/80 border-y border-gray-200/60 py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100/80 text-orange-600 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                Popular in the kitchen
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Frequently bought daily groceries & pantry essentials
              </p>
            </div>
          </div>

          <button
            onClick={onViewAll}
            className="text-xs sm:text-sm font-bold text-brand-800 hover:text-brand-900 flex items-center gap-1 transition-colors"
          >
            <span>See all</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
