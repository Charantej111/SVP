import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { ProductCard } from '../shop/ProductCard';
import { PRODUCTS } from '../../data/productsData';

export const FreshSection = ({ onSelectSubcategory, onViewAllFresh }) => {
  const freshItems = PRODUCTS.filter(p => p.departmentId === 'fresh-dairy').slice(0, 6);

  const freshCategories = [
    { id: 'fruits-vegetables', name: 'Fruits & Veggies', desc: 'Daily Mandi Fresh' },
    { id: 'milk-dairy', name: 'Milk & Dairy', desc: 'Heritage & Amul' },
    { id: 'bread-bakery', name: 'Bread & Bakery', desc: 'Daily Baked' },
    { id: 'eggs', name: 'Farm Fresh Eggs', desc: 'Tray & Box' }
  ];

  return (
    <section className="bg-emerald-50/40 border-y border-emerald-100/60 py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-700 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Daily Dairy & Produce</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
              Fresh picks for your home
            </h2>
          </div>

          <button
            onClick={onViewAllFresh}
            className="text-xs sm:text-sm font-bold text-brand-800 hover:text-brand-900 flex items-center gap-1 transition-colors"
          >
            <span>See all</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Fresh Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {freshCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectSubcategory(cat.id)}
              className="bg-white border border-emerald-100 rounded-2xl p-4 text-left hover:border-brand-600/40 hover:shadow-card-hover transition-all duration-200 active:scale-95 shadow-subtle group"
            >
              <div className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-brand-800 transition-colors">
                {cat.name}
              </div>
              <div className="text-xs text-brand-700 font-medium mt-1">
                {cat.desc}
              </div>
            </button>
          ))}
        </div>

        {/* Fresh Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {freshItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
