import React, { useState } from 'react';
import { ArrowRight, Percent } from 'lucide-react';
import { ProductCard } from '../shop/ProductCard';
import { PRODUCTS } from '../../data/productsData';

export const OffersSection = ({ onViewAllOffers }) => {
  const [activeOfferTab, setActiveOfferTab] = useState('All');

  const offerTabs = [
    'All',
    'Monthly Grocery Savings',
    'Snacks & Beverages',
    'Home Care',
    'Personal Care'
  ];

  const offerProducts = PRODUCTS.filter(p => {
    if (!p.isOffer) return false;
    if (activeOfferTab === 'All') return true;
    return p.offerCategory === activeOfferTab;
  });

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div>
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 uppercase tracking-wider mb-1">
            <Percent className="w-3.5 h-3.5" />
            <span>Store Promotions</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
            Good deals for your everyday shopping
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Special pricing on selected groceries & household brands
          </p>
        </div>

        {onViewAllOffers && (
          <button
            onClick={onViewAllOffers}
            className="text-xs sm:text-sm font-bold text-brand-800 hover:text-brand-900 flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>See all deals</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Offer Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-4">
        {offerTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveOfferTab(tab)}
            className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shrink-0 transition-all border shadow-subtle ${
              activeOfferTab === tab
                ? 'bg-brand-800 text-white border-brand-800 shadow-card'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Offer Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
        {offerProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </section>
  );
};
