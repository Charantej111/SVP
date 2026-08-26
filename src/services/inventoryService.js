import { supabase, isSupabaseConfigured } from './supabaseClient';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/productsData';

const DEMO_INVENTORY_KEY = 'spv_demo_inventory_store';
const DEMO_MOVEMENTS_KEY = 'spv_demo_movements_store';

const getInitialDemoInventory = () => {
  try {
    const saved = localStorage.getItem(DEMO_INVENTORY_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}

  const initial = INITIAL_PRODUCTS.map((p, idx) => ({
    id: `inv-${p.id}`,
    product_id: p.id,
    stock_quantity: idx % 7 === 0 ? 0 : idx % 5 === 0 ? 3 : 24,
    low_stock_threshold: 5,
    updated_at: new Date().toISOString()
  }));

  try {
    localStorage.setItem(DEMO_INVENTORY_KEY, JSON.stringify(initial));
  } catch (e) {}

  return initial;
};

const getInitialDemoMovements = () => {
  try {
    const saved = localStorage.getItem(DEMO_MOVEMENTS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}

  const initial = [
    {
      id: 'mov-1',
      product_id: 'staple-01',
      change_quantity: 50,
      previous_quantity: 24,
      new_quantity: 74,
      reason: 'New stock batch received from miller',
      created_by: 'demo-admin-uuid',
      admin_email: 'admin@spvsuperbazaar.com',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: 'mov-2',
      product_id: 'staple-02',
      change_quantity: -2,
      previous_quantity: 18,
      new_quantity: 16,
      reason: 'Damaged pouch during shelf stocking',
      created_by: 'demo-admin-uuid',
      admin_email: 'admin@spvsuperbazaar.com',
      created_at: new Date(Date.now() - 3600000 * 12).toISOString()
    }
  ];

  try {
    localStorage.setItem(DEMO_MOVEMENTS_KEY, JSON.stringify(initial));
  } catch (e) {}

  return initial;
};

/**
 * Fetches all inventory records.
 */
export const fetchInventory = async () => {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Demo mode
  return getInitialDemoInventory();
};

/**
 * Atomic stock adjustment via PostgreSQL RPC 'adjust_inventory'.
 * Client NEVER sends adminId; database extracts it from auth.uid().
 */
export const adjustStock = async (productId, changeQuantity, reason) => {
  const delta = parseInt(changeQuantity, 10);
  const trimmedReason = (reason || 'Manual inventory correction').trim();

  if (isNaN(delta) || delta === 0) {
    throw new Error('Please specify a non-zero adjustment quantity.');
  }

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.rpc('adjust_inventory', {
      p_product_id: productId,
      p_change_quantity: delta,
      p_reason: trimmedReason
    });

    if (error) throw error;
    return data;
  }

  // Explicit Demo Mode Simulation with strict non-negative check
  const invList = getInitialDemoInventory();
  const index = invList.findIndex(i => i.product_id === productId);
  if (index === -1) {
    throw new Error(`Inventory item for product ${productId} not found.`);
  }

  const currentStock = invList[index].stock_quantity || 0;
  const newStock = currentStock + delta;

  if (newStock < 0) {
    throw new Error(`Cannot reduce inventory below 0. Current stock is ${currentStock}, adjustment is ${delta}.`);
  }

  invList[index].stock_quantity = newStock;
  invList[index].updated_at = new Date().toISOString();
  localStorage.setItem(DEMO_INVENTORY_KEY, JSON.stringify(invList));

  // Insert movement
  const movements = getInitialDemoMovements();
  const newMovement = {
    id: `mov-${Date.now()}`,
    product_id: productId,
    change_quantity: delta,
    previous_quantity: currentStock,
    new_quantity: newStock,
    reason: trimmedReason,
    created_by: 'demo-admin-uuid',
    admin_email: 'admin@spvsuperbazaar.com',
    created_at: new Date().toISOString()
  };
  localStorage.setItem(DEMO_MOVEMENTS_KEY, JSON.stringify([newMovement, ...movements]));

  return {
    product_id: productId,
    previous_quantity: currentStock,
    new_quantity: newStock,
    change_quantity: delta
  };
};

/**
 * Fetches inventory movement history for audit trails.
 */
export const fetchInventoryMovements = async () => {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('inventory_movements')
      .select(`
        id,
        product_id,
        change_quantity,
        previous_quantity,
        new_quantity,
        reason,
        created_at,
        users:created_by (email, name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(m => ({
      ...m,
      admin_email: m.users?.email || 'Admin',
      admin_name: m.users?.name || 'Store Admin'
    }));
  }

  // Demo mode
  return getInitialDemoMovements();
};
