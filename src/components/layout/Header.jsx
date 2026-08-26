import React, { useRef } from 'react';
import { ShoppingBag, Search, MapPin, ChevronDown, User } from 'lucide-react';
import { STORE_CONFIG } from '../../config/storeConfig';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/formatters';

export const Header = ({ currentView, setCurrentView, searchQuery, setSearchQuery }) => {
  const { totalItemsCount, subtotal, openCart, userLocation, deliveryLocation, openLocationModal } = useCart();
  const { user, isAuthenticated, openCustomerAuthModal } = useAuth();

  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);

  const displayLocation = deliveryLocation?.shortAddress || userLocation || "Add your location";
  const displayShortMobile = (deliveryLocation?.shortAddress || userLocation || "Location").split(',')[0].trim();

  const handleLogoClick = () => {
    clickCountRef.current += 1;

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    // Secret 3-tap shortcut to open Admin Portal
    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      setCurrentView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    clickTimerRef.current = setTimeout(() => {
      // Normal single click -> Home
      if (clickCountRef.current === 1) {
        setCurrentView('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      clickCountRef.current = 0;
    }, 280);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E2E2E7] shadow-2xs w-full max-w-full overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3.5">
        
        {/* Main Single-Row Header Layout (Logo, Location, Search, Sign In, Cart) */}
        <div className="flex items-center justify-between gap-2.5 sm:gap-4">
          
          {/* Left: Brand Logo & Single Brand Name (Triple-tap opens Admin) */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-2 shrink-0 text-left cursor-pointer focus:outline-none select-none"
          >
            <img 
              src="/logo.png" 
              alt={STORE_CONFIG.shortName} 
              className="h-8 sm:h-11 w-auto object-contain" 
            />
            <div className="hidden sm:block">
              <span className="block text-[15px] font-black text-[#02060C] tracking-tight leading-none">
                {STORE_CONFIG.shortName}
              </span>
            </div>
          </button>

          {/* Location Selector (Clean layout next to logo) */}
          <button 
            onClick={openLocationModal}
            className="flex items-center gap-1 text-left cursor-pointer group focus:outline-none shrink-0"
          >
            <div className="hidden md:block">
              <div className="flex items-center gap-1 font-extrabold text-[14px] text-brand-800 leading-none group-hover:underline">
                <span className="max-w-[200px] truncate">{displayLocation}</span>
                <ChevronDown className="w-4 h-4 text-brand-800 stroke-[3px]" />
              </div>
              <span className="text-[11px] text-[#686B78] font-medium block mt-0.5">
                To see items in your area
              </span>
            </div>
            
            {/* Mobile Location Badge */}
            <div className="md:hidden flex items-center gap-1 font-extrabold text-[12px] sm:text-[13px] text-brand-800 bg-brand-50 border border-brand-100 px-2 sm:px-2.5 py-1.5 rounded-xl">
              <MapPin className="w-3.5 h-3.5 text-brand-800 fill-current text-brand-800/20" />
              <span className="max-w-[100px] sm:max-w-[120px] truncate">{displayShortMobile}</span>
              <ChevronDown className="w-3 h-3 text-brand-800 stroke-[2.5px]" />
            </div>
          </button>

          {/* Search Bar Input (Centered on desktop, with magnifying glass inside on the right) */}
          <div className="hidden md:flex flex-1 max-w-md mx-2 relative">
            <input
              type="text"
              placeholder='Search for "Atta", "Milk", "Sunflower Oil"...'
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentView !== 'shop') setCurrentView('shop');
              }}
              className="w-full h-[40px] pl-4 pr-10 bg-[#F0F0F5] hover:bg-[#EAEAEF] focus:bg-white border border-transparent focus:border-[#E2E2E7] rounded-xl text-[13px] text-[#02060C] placeholder-[#686B78] focus:outline-none focus:ring-2 focus:ring-brand-800/20 transition-all font-medium"
            />
            <Search className="w-4.5 h-4.5 text-[#686B78] absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Right Action Controls: Sign In & Cart */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Profile Button (Dynamic Sign In / Account) */}
            {isAuthenticated ? (
              <button
                onClick={() => setCurrentView('account')}
                className="flex items-center gap-1.5 bg-brand-50 hover:bg-brand-100 text-brand-900 border border-brand-200 px-2.5 sm:px-3 py-1.5 rounded-xl font-bold text-xs sm:text-[13px] transition-colors cursor-pointer"
                title="View My Account"
                aria-label="View My Account"
              >
                <div className="w-5 h-5 rounded-full bg-brand-800 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                  {(user.name || user.email || 'U')[0].toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{user.name ? user.name.split(' ')[0] : 'My Account'}</span>
              </button>
            ) : (
              <button
                onClick={() => openCustomerAuthModal('account')}
                className="flex items-center gap-1 text-[#02060C] hover:text-[#686B78] cursor-pointer transition-colors p-1.5 sm:px-2 sm:py-2 font-bold text-xs sm:text-[13px] rounded-lg hover:bg-gray-100"
                aria-label="Sign in"
              >
                <User className="w-5 h-5 text-gray-700" />
                <span className="hidden sm:inline">Sign in</span>
              </button>
            )}

            {/* My Cart Button (Instamart Pill Style) */}
            <button
              onClick={openCart}
              className={`h-[38px] flex items-center gap-2 px-3.5 sm:px-4 rounded-xl font-extrabold text-xs sm:text-[13px] transition-all shadow-2xs active:scale-95 cursor-pointer ${
                totalItemsCount > 0 
                  ? 'bg-brand-800 hover:bg-brand-900 text-white' 
                  : 'bg-[#F0F0F5] hover:bg-[#EAEAEF] text-[#02060C]'
              }`}
              aria-label="View Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4.5 h-4.5" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#FC8019] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-white">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <span>
                {totalItemsCount > 0 ? formatPrice(subtotal) : 'My Cart'}
              </span>
            </button>

          </div>

        </div>

        {/* Mobile Search Bar Row */}
        <div className="md:hidden relative w-full mt-2">
          <input
            type="text"
            placeholder='Search for "Atta", "Milk", "Sunflower Oil"...'
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (currentView !== 'shop') setCurrentView('shop');
            }}
            className="w-full h-[38px] pl-4 pr-9 bg-[#F0F0F5] border border-transparent rounded-xl text-[12px] placeholder-[#686B78] text-[#02060C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-800/20 transition-all font-medium"
          />
          <Search className="w-4 h-4 text-[#686B78] absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

      </div>
    </header>
  );
};
