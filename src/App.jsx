import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
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

// Store Services
import { 
  fetchPublicProducts, 
  fetchAdminProducts, 
  createProduct, 
  updateProduct, 
  toggleProductActive,
  getInitialDemoProducts
} from './services/productService';
import { 
  fetchInventory, 
  adjustStock, 
  fetchInventoryMovements 
} from './services/inventoryService';

// View Pages
import { ShopPage } from './components/shop/ShopPage';
import { DepartmentBrowser } from './components/categories/DepartmentBrowser';
import { AboutPage } from './components/about/AboutPage';
import { ContactPage } from './components/contact/ContactPage';
import { AccountPage } from './components/account/AccountPage';

// Admin Components
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminProductList } from './components/admin/AdminProductList';
import { AdminProductModal } from './components/admin/AdminProductModal';
import { AdminInventoryPage } from './components/admin/AdminInventoryPage';
import { StockAdjustModal } from './components/admin/StockAdjustModal';
import { AdminAuditLogPage } from './components/admin/AdminAuditLogPage';

// Modals / Drawers
import { CustomerAuthModal } from './components/auth/CustomerAuthModal';
import { LocationModal } from './components/common/LocationModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutForm } from './components/cart/CheckoutForm';
import { OrderSuccessModal } from './components/cart/OrderSuccessModal';

const getViewFromLocation = () => {
  try {
    // 1. Check clean pathname (e.g. '/shop', '/admin', '/account')
    const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
    if (['shop', 'categories', 'about', 'contact', 'account', 'admin', 'admin/login'].includes(path)) {
      return path;
    }
    // 2. Backwards-compatible check for legacy hash links
    const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    if (['shop', 'categories', 'about', 'contact', 'account', 'admin', 'admin/login'].includes(hash)) {
      return hash;
    }
  } catch {}
  return 'home';
};

export function AppContent() {
  const { user, isAdmin, authLoading } = useAuth();

  const [currentView, setCurrentView] = useState(getViewFromLocation);

  const [adminTab, setAdminTab] = useState('dashboard'); // 'dashboard' | 'products' | 'inventory' | 'history'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');

  // Product & Inventory Data (Initializes immediately with full catalog data)
  const [products, setProducts] = useState(getInitialDemoProducts);
  const [inventory, setInventory] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Admin Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isStockAdjustOpen, setIsStockAdjustOpen] = useState(false);
  const [adjustingProductId, setAdjustingProductId] = useState(null);

  // Load public products for customer storefront
  const loadData = useCallback(async () => {
    try {
      if (currentView.startsWith('admin') && isAdmin) {
        const [adminProds, invList, movList] = await Promise.all([
          fetchAdminProducts(),
          fetchInventory(),
          fetchInventoryMovements()
        ]);
        setProducts(adminProds);
        setInventory(invList);
        setMovements(movList);
      } else {
        const publicProds = await fetchPublicProducts();
        setProducts(publicProds);
      }
    } catch (err) {
      console.error('Error loading store data:', err);
    } finally {
      setLoadingData(false);
    }
  }, [currentView, isAdmin]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Keep state and clean browser URL in sync for direct links & back/forward navigation
  useEffect(() => {
    const handleLocationChange = () => {
      const nextView = getViewFromLocation();
      setCurrentView(nextView);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const changeView = (view) => {
    setCurrentView(view);
    try {
      const targetPath = view === 'home' ? '/' : `/${view}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
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

  // Admin Actions
  const handleCreateProduct = async (productData) => {
    await createProduct(productData);
    await loadData();
  };

  const handleUpdateProduct = async (productData) => {
    await updateProduct(productData.id, productData);
    await loadData();
  };

  const handleToggleProductActive = async (productId, isActive) => {
    await toggleProductActive(productId, isActive);
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, is_active: isActive } : p));
  };

  const handleAdjustStock = async (productId, delta, reason) => {
    await adjustStock(productId, delta, reason);
    await loadData();
  };

  // Curated product shelves for customer home
  const popularProducts = products.filter(p => p.is_popular || p.isPopular).slice(0, 8);
  const dairyBakeryProducts = products.filter(p => (p.category_id || p.departmentId) === 'fresh-dairy').slice(0, 8);
  const staplesProducts = products.filter(p => (p.category_id || p.departmentId) === 'staples').slice(0, 8);
  const snacksBeveragesProducts = products.filter(p => (p.category_id || p.departmentId) === 'food' || (p.category_id || p.departmentId) === 'beverages').slice(0, 8);
  const homePersonalProducts = products.filter(p => (p.category_id || p.departmentId) === 'home-cleaning' || (p.category_id || p.departmentId) === 'personal-care').slice(0, 8);

  // ============================================================================
  // ADMIN PORTAL SHELL (ISOLATED FROM CUSTOMER HEADER/FOOTER)
  // ============================================================================
  if (currentView.startsWith('admin')) {
    // If not authenticated as admin, show dedicated Admin Login Screen
    if (!isAdmin) {
      return (
        <AdminLoginPage
          onLoginSuccess={() => {
            changeView('admin');
            loadData();
          }}
          onBackToStore={() => changeView('home')}
        />
      );
    }

    const adjustingProduct = products.find(p => p.id === adjustingProductId);
    const adjustingInv = inventory.find(i => i.product_id === adjustingProductId);

    return (
      <AdminLayout
        activeTab={adminTab}
        setActiveTab={setAdminTab}
        onExitAdmin={() => changeView('home')}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboard
            products={products}
            inventory={inventory}
            movements={movements}
            onNavigateTab={setAdminTab}
            onOpenNewProduct={() => {
              setEditingProduct(null);
              setIsProductModalOpen(true);
            }}
            onOpenAdjustStock={(id) => {
              setAdjustingProductId(id);
              setIsStockAdjustOpen(true);
            }}
          />
        )}

        {adminTab === 'products' && (
          <AdminProductList
            products={products}
            inventory={inventory}
            onOpenNewProduct={() => {
              setEditingProduct(null);
              setIsProductModalOpen(true);
            }}
            onEditProduct={(product) => {
              setEditingProduct(product);
              setIsProductModalOpen(true);
            }}
            onToggleActive={handleToggleProductActive}
          />
        )}

        {adminTab === 'inventory' && (
          <AdminInventoryPage
            products={products}
            inventory={inventory}
            onOpenAdjustStock={(id) => {
              setAdjustingProductId(id);
              setIsStockAdjustOpen(true);
            }}
          />
        )}

        {adminTab === 'history' && (
          <AdminAuditLogPage
            movements={movements}
            products={products}
          />
        )}

        {/* Product Modal */}
        <AdminProductModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          product={editingProduct}
          onSave={editingProduct ? handleUpdateProduct : handleCreateProduct}
        />

        {/* Stock Adjust Modal */}
        <StockAdjustModal
          isOpen={isStockAdjustOpen}
          onClose={() => {
            setIsStockAdjustOpen(false);
            setAdjustingProductId(null);
          }}
          product={adjustingProduct}
          currentStock={adjustingInv?.stock_quantity || 0}
          onAdjust={handleAdjustStock}
        />
      </AdminLayout>
    );
  }

  // ============================================================================
  // CUSTOMER & GUEST PUBLIC STOREFRONT SHELL
  // ============================================================================
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
              products={dairyBakeryProducts}
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

        {currentView === 'account' && (
          <AccountPage
            onShopClick={() => changeView('shop')}
          />
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

      {/* Customer Email OTP Authentication Modal */}
      <CustomerAuthModal />

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
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
