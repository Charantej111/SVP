import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';

export const StickyCartBar = () => {
  const { totalItemsCount, subtotal, isCartOpen, isCheckoutOpen, openCart } = useCart();

  // Only show on mobile devices (md:hidden) when cart has items
  if (totalItemsCount === 0 || isCartOpen || isCheckoutOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-16 left-0 right-0 z-30 px-3 pointer-events-none md:hidden animate-in slide-in-from-bottom-4 duration-200">
      <div className="max-w-md mx-auto pointer-events-auto">
        <button
          onClick={openCart}
          className="w-full bg-brand-800 hover:bg-brand-900 active:scale-[0.99] text-white p-3 sm:p-3.5 rounded-2xl shadow-float flex items-center justify-between transition-all border border-brand-700/80 group cursor-pointer"
        >
          {/* Left: Cart Items & Total */}
          <div className="flex items-center gap-3">
            <div className="bg-brand-900/80 p-2 rounded-xl text-white relative">
              <ShoppingBag className="w-4.5 h-4.5" />
              <span className="absolute -top-1.5 -right-1.5 bg-accent-500 text-white text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center border border-brand-800">
                {totalItemsCount}
              </span>
            </div>
            <div className="text-left">
              <div className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider">
                {totalItemsCount} {totalItemsCount === 1 ? 'Item' : 'Items'} Added
              </div>
              <div className="text-[15px] font-extrabold text-white leading-tight">
                {formatPrice(subtotal)}
              </div>
            </div>
          </div>

          {/* Right: Instamart Style View Cart CTA */}
          <div className="flex items-center gap-1.5 bg-white text-brand-900 font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all shadow-subtle group-hover:bg-gray-100">
            <span>View Cart</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>
      </div>
    </div>
  );
};
