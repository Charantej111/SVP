import React from 'react';
import { CalendarCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ProductCard } from '../shop/ProductCard';
import { PRODUCTS } from '../../data/productsData';

export const MonthlyStockup = ({ onShopMonthlyClick }) => {
  const monthlyItems = PRODUCTS.filter(p => p.isMonthlyEssential).slice(0, 6);

  const checklistPills = [
    "Rice", "Atta", "Dals", "Cooking Oil", "Salt & Spices", "Tea & Coffee", "Detergent", "Bath Soaps"
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
      
      {/* Clean Banner Box */}
      <div className="bg-brand-900 text-white rounded-3xl p-6 sm:p-10 mb-10 shadow-card relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-white/15 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-200 backdrop-blur-xs">
            <CalendarCheck className="w-4 h-4" />
            <span>Monthly Pantry Checklist</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            Stock up for the month
          </h2>

          <p className="text-sm text-emerald-100/90 leading-relaxed font-normal">
            Order your complete household pantry in one go. Pick all monthly staples, cleaning supplies, and personal care essentials without walking through every aisle.
          </p>

          {/* Checklist Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {checklistPills.map((pill, i) => (
              <span key={i} className="bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-lg border border-white/15 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent-500" />
                {pill}
              </span>
            ))}
          </div>

          <div className="pt-3">
            <button
              onClick={onShopMonthlyClick}
              className="bg-accent-500 hover:bg-accent-600 active:scale-95 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all inline-flex items-center gap-2 shadow-subtle"
            >
              <span>Shop Monthly Essentials</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid Sample */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
        {monthlyItems.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </section>
  );
};
