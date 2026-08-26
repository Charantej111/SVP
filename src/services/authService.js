import { supabase, isSupabaseConfigured } from './supabaseClient';

const DEMO_USER_KEY = 'spv_demo_customer_profile';
const DEMO_ADMIN_KEY = 'spv_demo_admin_session';

/**
 * Sends a 6-digit Email OTP to the customer's email.
 */
export const sendCustomerEmailOtp = async (email) => {
  const normalizedEmail = email.trim().toLowerCase();

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        shouldCreateUser: true
      }
    });

    if (error) throw error;
    return { success: true, email: normalizedEmail, mode: 'supabase' };
  }

  // Explicit Local Demo Mode fallback
  console.warn('[SPV Demo Mode] Supabase credentials not found in .env.local. Simulating OTP for demo.');
  sessionStorage.setItem('spv_demo_pending_otp_email', normalizedEmail);
  return { 
    success: true, 
    email: normalizedEmail, 
    mode: 'demo',
    demoOtp: '123456' // For instant local demo testing
  };
};

/**
 * Verifies the customer's 6-digit Email OTP.
 */
export const verifyCustomerEmailOtp = async (email, token) => {
  const normalizedEmail = email.trim().toLowerCase();
  const cleanedToken = token.trim();

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.auth.verifyOtp({
      email: normalizedEmail,
      token: cleanedToken,
      type: 'email'
    });

    if (error) throw error;

    const authUser = data.user;
    if (!authUser) throw new Error('Verification failed: No user returned');

    // Fetch user profile from public.users (created by database trigger)
    let profile = await getUserProfile(authUser.id);

    // If trigger had a millisecond delay, ensure profile row exists
    if (!profile) {
      const { data: newProfile, error: profileErr } = await supabase
        .from('users')
        .select('*')
        .eq('authentication_user_id', authUser.id)
        .maybeSingle();

      if (!profileErr && newProfile) {
        profile = newProfile;
      } else {
        profile = {
          authentication_user_id: authUser.id,
          email: authUser.email,
          role: 'customer',
          name: '',
          phone: '',
          delivery_location: null
        };
      }
    }

    const loc = profile?.delivery_location || {};
    return {
      user: {
        id: profile?.id || authUser.id,
        authId: authUser.id,
        email: authUser.email,
        name: profile?.name || '',
        phone: profile?.phone || '',
        address: loc.address || '',
        landmark: loc.landmark || '',
        role: profile?.role || 'customer',
        deliveryLocation: profile?.delivery_location || null
      },
      session: data.session,
      isNewUser: !profile?.name
    };
  }

  // Explicit Demo Mode verification
  const demoEmail = sessionStorage.getItem('spv_demo_pending_otp_email') || normalizedEmail;
  const demoProfileRaw = localStorage.getItem(DEMO_USER_KEY);
  const demoProfile = demoProfileRaw ? JSON.parse(demoProfileRaw) : null;

  const mockUser = {
    id: 'demo-customer-uuid',
    authId: 'demo-customer-auth-id',
    email: demoEmail,
    name: demoProfile?.name || '',
    phone: demoProfile?.phone || '',
    address: demoProfile?.address || '',
    landmark: demoProfile?.landmark || '',
    role: 'customer',
    deliveryLocation: demoProfile?.deliveryLocation || null
  };

  localStorage.setItem('spv_demo_current_user', JSON.stringify(mockUser));
  return {
    user: mockUser,
    session: { access_token: 'demo-jwt-token' },
    isNewUser: !mockUser.name
  };
};

/**
 * Fetches user profile from public.users table.
 */
export const getUserProfile = async (authUserId) => {
  if (!isSupabaseConfigured()) {
    const demoProfileRaw = localStorage.getItem(DEMO_USER_KEY);
    return demoProfileRaw ? JSON.parse(demoProfileRaw) : null;
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('authentication_user_id', authUserId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
};

export const updateCustomerProfile = async (authUserId, { name, phone, address, landmark, deliveryLocation }) => {
  if (isSupabaseConfigured()) {
    const existingProfile = await getUserProfile(authUserId);
    const existingLoc = existingProfile?.delivery_location || {};
    
    const mergedLocation = {
      ...(deliveryLocation || existingLoc),
      address: address !== undefined ? address.trim() : (existingLoc.address || ''),
      landmark: landmark !== undefined ? landmark.trim() : (existingLoc.landmark || '')
    };

    const updates = {
      updated_at: new Date().toISOString(),
      delivery_location: mergedLocation
    };
    if (name !== undefined) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('authentication_user_id', authUserId)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      address: mergedLocation.address,
      landmark: mergedLocation.landmark,
      deliveryLocation: mergedLocation
    };
  }

  // Demo mode
  const currentDemoUserRaw = localStorage.getItem('spv_demo_current_user');
  const current = currentDemoUserRaw ? JSON.parse(currentDemoUserRaw) : {};
  const mergedLoc = {
    ...(deliveryLocation || current.deliveryLocation || {}),
    address: address !== undefined ? address.trim() : (current.address || ''),
    landmark: landmark !== undefined ? landmark.trim() : (current.landmark || '')
  };

  const updated = {
    ...current,
    name: name !== undefined ? name.trim() : current.name,
    phone: phone !== undefined ? phone.trim() : current.phone,
    address: mergedLoc.address,
    landmark: mergedLoc.landmark,
    deliveryLocation: mergedLoc
  };
  localStorage.setItem('spv_demo_current_user', JSON.stringify(updated));
  localStorage.setItem(DEMO_USER_KEY, JSON.stringify(updated));
  return updated;
};

/**
 * Admin Login via Email + Password.
 * Strictly verifies role === 'admin' from public.users table.
 */
export const adminLogin = async (email, password) => {
  const normalizedEmail = email.trim().toLowerCase();

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: password
    });

    if (error) throw error;

    const authUser = data.user;
    if (!authUser) throw new Error('Authentication failed');

    // Query database directly to verify admin role
    const { data: userProfile, error: profileErr } = await supabase
      .from('users')
      .select('id, email, name, role')
      .eq('authentication_user_id', authUser.id)
      .single();

    if (profileErr || !userProfile || userProfile.role !== 'admin') {
      await supabase.auth.signOut();
      throw new Error('Access denied: You do not have administrator privileges.');
    }

    return {
      user: {
        id: userProfile.id,
        authId: authUser.id,
        email: userProfile.email,
        name: userProfile.name || 'Store Administrator',
        role: 'admin'
      },
      session: data.session
    };
  }

  // Demo Admin Fallback for testing when keys are missing
  if (normalizedEmail === 'admin@spvsuperbazaar.com' && password === 'admin123') {
    const mockAdmin = {
      id: 'demo-admin-uuid',
      authId: 'demo-admin-auth-id',
      email: normalizedEmail,
      name: 'SPV Admin (Demo)',
      role: 'admin'
    };
    localStorage.setItem(DEMO_ADMIN_KEY, JSON.stringify(mockAdmin));
    return {
      user: mockAdmin,
      session: { access_token: 'demo-admin-jwt' }
    };
  }

  throw new Error('Invalid email or password');
};

/**
 * Signs out current user (Customer or Admin).
 */
export const signOutUser = async () => {
  if (isSupabaseConfigured()) {
    await supabase.auth.signOut();
  }
  localStorage.removeItem('spv_demo_current_user');
  localStorage.removeItem(DEMO_ADMIN_KEY);
  sessionStorage.removeItem('spv_demo_pending_otp_email');
};
