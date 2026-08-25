import React from 'react';
import { ArrowLeft, ShoppingBag, LayoutGrid } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { STORE_CONFIG } from '../../config/storeConfig';

export const MobileBottomNav = ({ currentView, setCurrentView }) => {
  const { totalItemsCount } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E2E7] md:hidden pb-safe shadow-sheet">
      <div className="grid grid-cols-3 h-14 items-center">
        
        {/* Tab 1: Home */}
        <button
          onClick={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
            currentView === 'home' ? 'text-[#02060C] font-extrabold' : 'text-[#686B78] hover:text-[#02060C]'
          }`}
        >
          <div className="w-7 h-7 rounded-full bg-[#F4F4F6] flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-[#02060C]" />
          </div>
          <span className="text-[10px] leading-none font-bold">Home</span>
        </button>

        {/* Tab 2: Instamart / SPV Super Bazar (Center) */}
        <button
          onClick={() => {
            setCurrentView('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors relative cursor-pointer ${
            currentView === 'shop' ? 'text-brand-800 font-extrabold' : 'text-[#686B78] hover:text-[#02060C]'
          }`}
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 ${currentView === 'shop' ? 'stroke-[2.5px] text-brand-800' : ''}`} />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#FC8019] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-white">
                {totalItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] leading-none font-extrabold">{STORE_CONFIG.shortName}</span>
        </button>

        {/* Tab 3: Categories */}
        <button
          onClick={() => {
            setCurrentView('categories');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
            currentView === 'categories' ? 'text-[#02060C] font-extrabold' : 'text-[#686B78] hover:text-[#02060C]'
          }`}
        >
          <LayoutGrid className={`w-5 h-5 ${currentView === 'categories' ? 'stroke-[2.5px] text-[#02060C]' : ''}`} />
          <span className="text-[10px] leading-none font-bold">Categories</span>
        </button>

      </div>
    </nav>
  );
};
