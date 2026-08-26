import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { getUserProfile, signOutUser, updateCustomerProfile } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingDestination, setPendingDestination] = useState(null);

  // Initialize and listen to Supabase Auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      if (isSupabaseConfigured()) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && mounted) {
            const profile = await getUserProfile(session.user.id);
            const loc = profile?.delivery_location || {};
            setUser({
              id: profile?.id || session.user.id,
              authId: session.user.id,
              email: session.user.email,
              name: profile?.name || '',
              phone: profile?.phone || '',
              address: loc.address || '',
              landmark: loc.landmark || '',
              role: profile?.role || 'customer',
              deliveryLocation: profile?.delivery_location || null
            });
          }
        } catch (err) {
          console.error('Error checking auth session:', err);
        }
      } else {
        // Check Demo mode stored user
        const demoUser = localStorage.getItem('spv_demo_current_user');
        const demoAdmin = localStorage.getItem('spv_demo_admin_session');
        if (demoAdmin && mounted) {
          setUser(JSON.parse(demoAdmin));
        } else if (demoUser && mounted) {
          setUser(JSON.parse(demoUser));
        }
      }

      if (mounted) setAuthLoading(false);
    };

    initializeAuth();

    // Supabase Auth listener
    let authListener = null;
    if (isSupabaseConfigured()) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const profile = await getUserProfile(session.user.id);
          const loc = profile?.delivery_location || {};
          setUser({
            id: profile?.id || session.user.id,
            authId: session.user.id,
            email: session.user.email,
            name: profile?.name || '',
            phone: profile?.phone || '',
            address: loc.address || '',
            landmark: loc.landmark || '',
            role: profile?.role || 'customer',
            deliveryLocation: profile?.delivery_location || null
          });
        } else {
          setUser(null);
        }
        setAuthLoading(false);
      });
      authListener = data?.subscription;
    }

    return () => {
      mounted = false;
      if (authListener) authListener.unsubscribe();
    };
  }, []);

  const openCustomerAuthModal = (destination = null) => {
    setPendingDestination(destination);
    setIsAuthModalOpen(true);
  };

  const closeCustomerAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingDestination(null);
  };

  const logout = async () => {
    await signOutUser();
    setUser(null);
  };

  const updateProfile = async (updates) => {
    if (!user?.authId) return;
    const updated = await updateCustomerProfile(user.authId, updates);
    setUser(prev => ({
      ...prev,
      name: updates.name !== undefined ? updates.name : prev.name,
      phone: updates.phone !== undefined ? updates.phone : prev.phone,
      address: updates.address !== undefined ? updates.address : prev.address,
      landmark: updates.landmark !== undefined ? updates.landmark : prev.landmark,
      deliveryLocation: updates.deliveryLocation !== undefined ? updates.deliveryLocation : prev.deliveryLocation
    }));
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        role: user?.role || null,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'admin',
        authLoading,
        isAuthModalOpen,
        openCustomerAuthModal,
        closeCustomerAuthModal,
        pendingDestination,
        logout,
        updateProfile,
        isConfigured: isSupabaseConfigured()
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
