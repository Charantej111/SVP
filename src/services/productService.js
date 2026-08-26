import { supabase, isSupabaseConfigured } from './supabaseClient';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/productsData';

// Local storage key for demo mode updates
const DEMO_PRODUCTS_KEY = 'spv_demo_products_store';

const getInitialDemoProducts = () => {
  try {
    const saved = localStorage.getItem(DEMO_PRODUCTS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  // Standardize existing PRODUCTS into snake_case model
  const standardized = INITIAL_PRODUCTS.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.id + '-' + p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    brand: p.brand,
    pack_size: p.packSize,
    price: p.price,
    sale_price: p.salePrice || null,
    mrp: p.mrp || p.price,
    category_id: p.departmentId || 'staples',
    subcategory_id: p.subcategoryId || '',
    department_id: p.departmentId || '',
    image_url: p.imageUrl,
    is_popular: Boolean(p.isPopular),
    is_monthly_essential: Boolean(p.isMonthlyEssential),
    is_active: p.isActive !== false,
    stock_status: 'in_stock'
  }));

  try {
    localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(standardized));
  } catch (e) {}

  return standardized;
};

/**
 * Public catalog view: Fetches active products with sanitized stock status.
 * Never exposes raw stock counts to public customers.
 */
export const fetchPublicProducts = async () => {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('public_products')
      .select('*');

    if (!error && data && data.length > 0) {
      return data;
    }
    // If view is not yet created, fallback to products query
    const { data: rawProducts, error: prodErr } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true);

    if (prodErr) throw prodErr;
    return rawProducts || [];
  }

  // Demo mode
  const demoList = getInitialDemoProducts();
  return demoList.filter(p => p.is_active !== false);
};

/**
 * Admin view: Fetches all products (active & inactive).
 */
export const fetchAdminProducts = async () => {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Demo mode
  return getInitialDemoProducts();
};

/**
 * Admin: Create a new product and initialize inventory.
 */
export const createProduct = async (productData) => {
  const slug = (productData.name + '-' + (productData.pack_size || '')).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const id = productData.id || `prod-${Date.now()}`;

  const payload = {
    id,
    name: productData.name.trim(),
    slug,
    brand: productData.brand.trim(),
    pack_size: productData.pack_size.trim(),
    price: parseFloat(productData.price),
    sale_price: productData.sale_price ? parseFloat(productData.sale_price) : null,
    mrp: productData.mrp ? parseFloat(productData.mrp) : parseFloat(productData.price),
    category_id: productData.category_id,
    subcategory_id: productData.subcategory_id || null,
    department_id: productData.category_id,
    image_url: productData.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
    is_popular: Boolean(productData.is_popular),
    is_monthly_essential: Boolean(productData.is_monthly_essential),
    is_active: productData.is_active !== false
  };

  if (isSupabaseConfigured()) {
    // Insert product
    const { data: newProd, error: prodErr } = await supabase
      .from('products')
      .insert(payload)
      .select()
      .single();

    if (prodErr) throw prodErr;

    // Initialize inventory record
    const { error: invErr } = await supabase
      .from('inventory')
      .insert({
        product_id: id,
        stock_quantity: parseInt(productData.initial_stock || 20, 10),
        low_stock_threshold: parseInt(productData.low_stock_threshold || 5, 10)
      });

    if (invErr) console.error('Error initializing inventory record:', invErr);

    return newProd;
  }

  // Demo mode
  const current = getInitialDemoProducts();
  const updated = [payload, ...current];
  localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(updated));

  // Initialize demo inventory
  const demoInvRaw = localStorage.getItem('spv_demo_inventory_store');
  const demoInv = demoInvRaw ? JSON.parse(demoInvRaw) : [];
  demoInv.push({
    id: `inv-${Date.now()}`,
    product_id: id,
    stock_quantity: parseInt(productData.initial_stock || 20, 10),
    low_stock_threshold: parseInt(productData.low_stock_threshold || 5, 10)
  });
  localStorage.setItem('spv_demo_inventory_store', JSON.stringify(demoInv));

  return payload;
};

/**
 * Admin: Update existing product.
 */
export const updateProduct = async (id, productData) => {
  const updates = {
    name: productData.name?.trim(),
    brand: productData.brand?.trim(),
    pack_size: productData.pack_size?.trim(),
    price: productData.price ? parseFloat(productData.price) : undefined,
    sale_price: productData.sale_price !== undefined ? (productData.sale_price ? parseFloat(productData.sale_price) : null) : undefined,
    mrp: productData.mrp ? parseFloat(productData.mrp) : undefined,
    category_id: productData.category_id,
    subcategory_id: productData.subcategory_id,
    department_id: productData.category_id,
    image_url: productData.image_url,
    is_popular: productData.is_popular !== undefined ? Boolean(productData.is_popular) : undefined,
    is_monthly_essential: productData.is_monthly_essential !== undefined ? Boolean(productData.is_monthly_essential) : undefined,
    is_active: productData.is_active !== undefined ? Boolean(productData.is_active) : undefined,
    updated_at: new Date().toISOString()
  };

  // Remove undefined fields
  Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Demo mode
  const current = getInitialDemoProducts();
  const updated = current.map(p => p.id === id ? { ...p, ...updates } : p);
  localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(updated));
  return updated.find(p => p.id === id);
};

/**
 * Admin: Enable/disable product (Soft delete via is_active = false).
 */
export const toggleProductActive = async (id, isActive) => {
  return updateProduct(id, { is_active: isActive });
};

/**
 * Admin: Upload product image to Supabase Storage bucket 'product-images'.
 */
export const uploadProductImage = async (file) => {
  if (isSupabaseConfigured()) {
    const fileExt = file.name.split('.').pop();
    const fileName = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `items/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  // Demo Mode: Create a local object URL for demonstration
  return URL.createObjectURL(file);
};
