import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'spv_superbazaar_cart_v1';
const CUSTOMER_STORAGE_KEY = 'spv_superbazaar_customer_v1';
const LOCATION_STORAGE_KEY = 'spv_superbazaar_location_v1';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
      return [];
    }
  });

  const [customerDetails, setCustomerDetails] = useState(() => {
    try {
      const saved = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {
        name: '',
        phone: '',
        orderType: 'delivery', // 'delivery' or 'pickup'
        address: '',
        landmark: '',
        instructions: ''
      };
    } catch (e) {
      return {
        name: '',
        phone: '',
        orderType: 'delivery',
        address: '',
        landmark: '',
        instructions: ''
      };
    }
  });

  const [userLocation, setUserLocation] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCATION_STORAGE_KEY);
      return saved || 'Ramavaram, Kutukuluru';
    } catch (e) {
      return 'Ramavaram, Kutukuluru';
    }
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState(null);

  // Automatically trigger location modal on first landing after 500ms
  useEffect(() => {
    const hasSeenLocation = sessionStorage.getItem('spv_has_seen_location_modal');
    if (!hasSeenLocation) {
      const timer = setTimeout(() => {
        setIsLocationModalOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Save location to localStorage
  const setAndSaveLocation = (loc) => {
    setUserLocation(loc);
    try {
      localStorage.setItem(LOCATION_STORAGE_KEY, loc);
      sessionStorage.setItem('spv_has_seen_location_modal', 'true');
    } catch (e) {
      console.error(e);
    }
    setIsLocationModalOpen(false);
  };

  const closeLocationModal = () => {
    sessionStorage.setItem('spv_has_seen_location_modal', 'true');
    setIsLocationModalOpen(false);
  };

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cartItems]);

  // Persist customer details
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customerDetails));
    } catch (e) {
      console.error('Failed to save customer details', e);
    }
  }, [customerDetails]);

  const addToCart = (product, qty = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getItemQuantity = (productId) => {
    const item = cartItems.find(i => i.id === productId);
    return item ? item.quantity : 0;
  };

  const clearSavedCustomerDetails = () => {
    const emptyDetails = {
      name: '',
      phone: '',
      orderType: 'delivery',
      address: '',
      landmark: '',
      instructions: ''
    };
    setCustomerDetails(emptyDetails);
    try {
      localStorage.removeItem(CUSTOMER_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalMrp = cartItems.reduce((sum, item) => sum + (item.mrp || item.price) * item.quantity, 0);
  const totalSavings = totalMrp - subtotal;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        customerDetails,
        setCustomerDetails,
        clearSavedCustomerDetails,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
        totalItemsCount,
        subtotal,
        totalSavings,
        isCartOpen,
        setIsCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        isCheckoutOpen,
        setIsCheckoutOpen,
        openCheckout: () => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        },
        closeCheckout: () => setIsCheckoutOpen(false),
        orderSuccessData,
        setOrderSuccessData,
        userLocation,
        setUserLocation: setAndSaveLocation,
        isLocationModalOpen,
        openLocationModal: () => setIsLocationModalOpen(true),
        closeLocationModal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
