import React from 'react';
import { Home, ShoppingBag, LayoutGrid, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { STORE_CONFIG } from '../../config/storeConfig';

export const MobileBottomNav = ({ currentView, setCurrentView }) => {
  const { totalItemsCount } = useCart();
  const { user, isAuthenticated, openCustomerAuthModal } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E2E7] md:hidden pb-safe shadow-sheet">
      <div className="grid grid-cols-4 h-14 items-center px-1">
        
        {/* Tab 1: Home */}
        <button
          onClick={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
            currentView === 'home' ? 'text-brand-800 font-extrabold' : 'text-[#686B78] hover:text-[#02060C]'
          }`}
        >
          <Home className={`w-5 h-5 ${currentView === 'home' ? 'stroke-[2.5px] text-brand-800' : 'text-gray-600'}`} />
          <span className="text-[10px] leading-none font-bold">Home</span>
        </button>

        {/* Tab 2: Shop */}
        <button
          onClick={() => {
            setCurrentView('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center gap-1 transition-colors relative cursor-pointer ${
            currentView === 'shop' ? 'text-brand-800 font-extrabold' : 'text-[#686B78] hover:text-[#02060C]'
          }`}
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 ${currentView === 'shop' ? 'stroke-[2.5px] text-brand-800' : 'text-gray-600'}`} />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#FC8019] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-white">
                {totalItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] leading-none font-bold">Shop</span>
        </button>

        {/* Tab 3: Categories */}
        <button
          onClick={() => {
            setCurrentView('categories');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
            currentView === 'categories' ? 'text-brand-800 font-extrabold' : 'text-[#686B78] hover:text-[#02060C]'
          }`}
        >
          <LayoutGrid className={`w-5 h-5 ${currentView === 'categories' ? 'stroke-[2.5px] text-brand-800' : 'text-gray-600'}`} />
          <span className="text-[10px] leading-none font-bold">Categories</span>
        </button>

        {/* Tab 4: Account / Sign In */}
        <button
          onClick={() => {
            if (isAuthenticated) {
              setCurrentView('account');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              openCustomerAuthModal('account');
            }
          }}
          className={`flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
            currentView === 'account' ? 'text-brand-800 font-extrabold' : 'text-[#686B78] hover:text-[#02060C]'
          }`}
        >
          {isAuthenticated ? (
            <div className="w-5 h-5 rounded-full bg-brand-800 text-white flex items-center justify-center text-[10px] font-black">
              {(user.name || user.email || 'U')[0].toUpperCase()}
            </div>
          ) : (
            <User className={`w-5 h-5 ${currentView === 'account' ? 'stroke-[2.5px] text-brand-800' : 'text-gray-600'}`} />
          )}
          <span className="text-[10px] leading-none font-bold">
            {isAuthenticated ? 'Account' : 'Sign In'}
          </span>
        </button>

      </div>
    </nav>
  );
};
