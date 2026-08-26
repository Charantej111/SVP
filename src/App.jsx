import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { Header } from './components/layout/Header';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { StickyCartBar } from './components/layout/StickyCartBar';
import { FloatingWhatsAppButton } from './components/common/FloatingWhatsAppButton';
import { Footer } from './components/layout/Footer';

// Instamart-Inspired Home Components
import { InstamartHeroBanner } from './components/home/InstamartHeroBanner';
import { InstamartCategories } from './components/home/InstamartCategories';
import { CategoryProductShelf } from './components/home/CategoryProductShelf';

// Products Data
import { PRODUCTS } from './data/productsData';

// Other View Pages
import { ShopPage } from './components/shop/ShopPage';
import { DepartmentBrowser } from './components/categories/DepartmentBrowser';
import { AboutPage } from './components/about/AboutPage';
import { ContactPage } from './components/contact/ContactPage';

// Modals / Drawers
import { LocationModal } from './components/common/LocationModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutForm } from './components/cart/CheckoutForm';
import { OrderSuccessModal } from './components/cart/OrderSuccessModal';

export function AppContent() {
  const [currentView, setCurrentView] = useState(() => {
    try {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      if (['home', 'shop', 'categories', 'about', 'contact'].includes(hash)) {
        return hash;
      }
    } catch {}
    return 'home';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');

  // Keep state and URL hash in sync for direct links & back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      if (['home', 'shop', 'categories', 'about', 'contact'].includes(hash)) {
        setCurrentView(hash);
      } else if (!hash) {
        setCurrentView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const changeView = (view) => {
    setCurrentView(view);
    try {
      const targetHash = view === 'home' ? '' : `#/${view}`;
      if (window.location.hash !== targetHash) {
        window.history.pushState(null, '', targetHash || window.location.pathname);
      }
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleSelectDepartment = (deptId) => {
    setSelectedDepartment(deptId);
    setSelectedSubcategory('all');
    changeView('shop');
  };

  const handleSelectSubcategory = (deptId, subcategoryId) => {
    setSelectedDepartment(deptId);
    setSelectedSubcategory(subcategoryId);
    changeView('shop');
  };

  // Curated product shelves
  const popularProducts = PRODUCTS.filter(p => p.isPopular).slice(0, 8);
  const dairyProduceProducts = PRODUCTS.filter(p => p.departmentId === 'fresh-dairy').slice(0, 8);
  const staplesProducts = PRODUCTS.filter(p => p.departmentId === 'staples').slice(0, 8);
  const snacksBeveragesProducts = PRODUCTS.filter(p => p.departmentId === 'food' || p.departmentId === 'beverages').slice(0, 8);
  const homePersonalProducts = PRODUCTS.filter(p => p.departmentId === 'home-cleaning' || p.departmentId === 'personal-care').slice(0, 8);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-brand-100 selection:text-brand-900 overflow-x-hidden w-full max-w-full relative">
      
      {/* Global Sticky Header */}
      <Header
        currentView={currentView}
        setCurrentView={changeView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <div className="animate-in fade-in duration-300">
            {/* Instamart Hero Showcase */}
            <InstamartHeroBanner
              onShopClick={() => changeView('shop')}
            />

            {/* Shop by Category Tiles */}
            <InstamartCategories
              onSelectDepartment={handleSelectDepartment}
              onViewAllCategories={() => changeView('categories')}
            />

            {/* Shelf 1: Popular Essentials */}
            <CategoryProductShelf
              title="Popular in Ramavaram & Kutukuluru"
              subtitle="Daily essential items frequently ordered by local families"
              products={popularProducts}
              onViewAll={() => changeView('shop')}
              bgLight={true}
            />

            {/* Shelf 2: Fresh Dairy, Bread & Bakery */}
            <CategoryProductShelf
              title="Dairy, Bread & Breakfast Essentials"
              subtitle="Heritage & Amul milk, curd, butter, paneer, and fresh bakery"
              products={dairyProduceProducts}
              onViewAll={() => handleSelectDepartment('fresh-dairy')}
              bgLight={false}
            />

            {/* Shelf 3: Staples, Atta, Rice, Dal & Cooking Oil */}
            <CategoryProductShelf
              title="Atta, Rice, Dals & Cooking Oils"
              subtitle="Top quality pantry supplies from Aashirvaad, Freedom, Fortune & Tata"
              products={staplesProducts}
              onViewAll={() => handleSelectDepartment('staples')}
              bgLight={true}
            />

            {/* Shelf 4: Snacks & Beverages */}
            <CategoryProductShelf
              title="Snacks, Biscuits, Tea & Coffee"
              subtitle="Maggi noodles, Good Day cookies, Tata Tea, BRU coffee and refreshments"
              products={snacksBeveragesProducts}
              onViewAll={() => handleSelectDepartment('food')}
              bgLight={false}
            />

            {/* Shelf 5: Cleaning & Personal Care */}
            <CategoryProductShelf
              title="Home Cleaning & Personal Care"
              subtitle="Surf Excel, Vim, Lizol, Colgate, Santoor and hygiene essentials"
              products={homePersonalProducts}
              onViewAll={() => handleSelectDepartment('home-cleaning')}
              bgLight={true}
            />
          </div>
        )}

        {currentView === 'shop' && (
          <ShopPage
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
          />
        )}

        {currentView === 'categories' && (
          <DepartmentBrowser
            onSelectCategory={handleSelectDepartment}
            onSelectSubcategory={handleSelectSubcategory}
          />
        )}

        {currentView === 'about' && (
          <AboutPage
            onShopClick={() => changeView('shop')}
            onContactClick={() => changeView('contact')}
          />
        )}

        {currentView === 'contact' && (
          <ContactPage />
        )}
      </main>

      {/* Footer */}
      <Footer
        setCurrentView={changeView}
        onSelectDepartment={handleSelectDepartment}
      />

      {/* Instamart Floating Sticky Cart Bar */}
      <StickyCartBar />

      {/* Floating WhatsApp Contact Button */}
      <FloatingWhatsAppButton />

      {/* Fixed Mobile Bottom Navigation */}
      <MobileBottomNav
        currentView={currentView}
        setCurrentView={changeView}
      />

      {/* Global Modals & Drawers */}
      <LocationModal />
      <CartDrawer />
      <CheckoutForm />
      <OrderSuccessModal />

    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
