import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSavedDeliveryLocation, saveDeliveryLocationToStorage } from '../utils/locationUtils';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'spv_superbazaar_cart_v1';
const CUSTOMER_STORAGE_KEY = 'spv_superbazaar_customer_v1';

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

  const [deliveryLocation, setDeliveryLocationState] = useState(() => {
    const saved = getSavedDeliveryLocation();
    return saved;
  });

  const [userLocation, setUserLocationState] = useState(() => {
    const saved = getSavedDeliveryLocation();
    return saved?.shortAddress || saved?.formattedAddress || 'Ramavaram, Kutukuluru';
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState(null);

  // Automatically trigger location modal on first landing after 500ms
  useEffect(() => {
    try {
      const hasSeenLocation = sessionStorage.getItem('spv_has_seen_location_modal');
      if (!hasSeenLocation) {
        const timer = setTimeout(() => {
          setIsLocationModalOpen(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // Safe fallback if storage blocked
    }
  }, []);

  // Save confirmed structured location
  const setDeliveryLocation = (locationObj) => {
    if (!locationObj) return;

    // If string passed for backwards compatibility
    if (typeof locationObj === 'string') {
      const formatted = {
        latitude: 16.9405,
        longitude: 81.9982,
        accuracy: null,
        formattedAddress: locationObj,
        shortAddress: locationObj.split(',')[0].trim(),
        source: 'manual',
        timestamp: Date.now()
      };
      setDeliveryLocationState(formatted);
      setUserLocationState(locationObj);
      saveDeliveryLocationToStorage(formatted);
    } else {
      setDeliveryLocationState(locationObj);
      const shortText = locationObj.shortAddress || locationObj.formattedAddress || 'Selected Location';
      setUserLocationState(shortText);
      saveDeliveryLocationToStorage(locationObj);
    }

    try {
      sessionStorage.setItem('spv_has_seen_location_modal', 'true');
    } catch (e) {}
    setIsLocationModalOpen(false);
  };

  const closeLocationModal = () => {
    try {
      sessionStorage.setItem('spv_has_seen_location_modal', 'true');
    } catch (e) {}
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
        deliveryLocation,
        setDeliveryLocation,
        userLocation,
        setUserLocation: setDeliveryLocation,
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
