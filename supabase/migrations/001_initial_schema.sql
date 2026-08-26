-- ==============================================================================
-- SPV Super Bazaar - Initial Database Schema, RLS, Functions & Triggers
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. TABLES
-- ==============================================================================

-- Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  sort_order INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  brand TEXT NOT NULL,
  pack_size TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  sale_price NUMERIC(10,2) CHECK (sale_price >= 0),
  mrp NUMERIC(10,2) CHECK (mrp >= 0),
  category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  subcategory_id TEXT,
  department_id TEXT,
  image_url TEXT,
  is_popular BOOLEAN DEFAULT false NOT NULL,
  is_monthly_essential BOOLEAN DEFAULT false NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Application Users / Profiles Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  authentication_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'customer' NOT NULL CHECK (role IN ('customer', 'admin')),
  delivery_location JSONB,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Inventory Table (One record per product)
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT UNIQUE NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  stock_quantity INT DEFAULT 0 NOT NULL CHECK (stock_quantity >= 0),
  low_stock_threshold INT DEFAULT 5 NOT NULL CHECK (low_stock_threshold >= 0),
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Inventory Movements Audit Trail Table
CREATE TABLE IF NOT EXISTS public.inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  change_quantity INT NOT NULL,
  previous_quantity INT NOT NULL,
  new_quantity INT NOT NULL,
  reason TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Indices for high performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON public.users(authentication_user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON public.inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_movements_product_id ON public.inventory_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_movements_created_at ON public.inventory_movements(created_at DESC);

-- ==============================================================================
-- 2. SECURITY FUNCTIONS & TRIGGERS
-- ==============================================================================

-- Non-recursive is_admin() function with SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE authentication_user_id = auth.uid()
      AND role = 'admin'
  );
END;
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- Idempotent user profile creation trigger on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (
    authentication_user_id,
    email,
    name,
    phone,
    role,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    'customer',
    now(),
    now()
  )
  ON CONFLICT (authentication_user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 3. ATOMIC INVENTORY ADJUSTMENT RPC FUNCTION
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.adjust_inventory(
  p_product_id TEXT,
  p_change_quantity INT,
  p_reason TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_user_id UUID;
  v_prev_qty INT;
  v_new_qty INT;
  v_result JSONB;
BEGIN
  -- 1. Enforce admin authorization
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Only administrators can adjust inventory' USING ERRCODE = '42501';
  END IF;

  -- 2. Lookup admin internal UUID from auth.uid()
  SELECT id INTO v_admin_user_id
  FROM public.users
  WHERE authentication_user_id = auth.uid();

  IF v_admin_user_id IS NULL THEN
    RAISE EXCEPTION 'Administrator profile record not found in users table';
  END IF;

  -- 3. Lock inventory row for update
  SELECT stock_quantity INTO v_prev_qty
  FROM public.inventory
  WHERE product_id = p_product_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Inventory record for product % does not exist', p_product_id;
  END IF;

  -- 4. Calculate new stock and enforce non-negative check
  v_new_qty := v_prev_qty + p_change_quantity;
  IF v_new_qty < 0 THEN
    RAISE EXCEPTION 'Cannot reduce inventory below 0. Current stock is %, attempted adjustment is %', v_prev_qty, p_change_quantity;
  END IF;

  -- 5. Update inventory table
  UPDATE public.inventory
  SET stock_quantity = v_new_qty,
      updated_at = now()
  WHERE product_id = p_product_id;

  -- 6. Insert audit trail movement
  INSERT INTO public.inventory_movements (
    product_id,
    change_quantity,
    previous_quantity,
    new_quantity,
    reason,
    created_by,
    created_at
  ) VALUES (
    p_product_id,
    p_change_quantity,
    v_prev_qty,
    v_new_qty,
    p_reason,
    v_admin_user_id,
    now()
  );

  v_result := jsonb_build_object(
    'product_id', p_product_id,
    'previous_quantity', v_prev_qty,
    'new_quantity', v_new_qty,
    'change_quantity', p_change_quantity
  );

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.adjust_inventory(TEXT, INT, TEXT) TO authenticated;

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;

-- Categories RLS
CREATE POLICY "Public can view active categories"
  ON public.categories FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can insert categories"
  ON public.categories FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update categories"
  ON public.categories FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete categories"
  ON public.categories FOR DELETE
  USING (public.is_admin());

-- Products RLS
CREATE POLICY "Public can view active products"
  ON public.products FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  USING (public.is_admin());

-- Users / Profiles RLS
CREATE POLICY "Users can view own profile or admins can view all"
  ON public.users FOR SELECT
  USING (authentication_user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can update own profile details"
  ON public.users FOR UPDATE
  USING (authentication_user_id = auth.uid())
  WITH CHECK (
    authentication_user_id = auth.uid() 
    AND (role IS NOT DISTINCT FROM (SELECT role FROM public.users WHERE authentication_user_id = auth.uid()))
  );

CREATE POLICY "Admins can manage user records"
  ON public.users FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Inventory RLS
CREATE POLICY "Public and Customers can compute stock status via view/function"
  ON public.inventory FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can manage inventory"
  ON public.inventory FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Inventory Movements RLS
CREATE POLICY "Admins can view inventory movements"
  ON public.inventory_movements FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert inventory movements"
  ON public.inventory_movements FOR INSERT
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- 5. PUBLIC VIEW WITH SANITIZED STOCK STATUS (NO RAW NUMBERS)
-- ==============================================================================

CREATE OR REPLACE VIEW public.public_products AS
SELECT 
  p.id,
  p.name,
  p.slug,
  p.brand,
  p.pack_size,
  p.price,
  p.sale_price,
  p.mrp,
  p.category_id,
  p.subcategory_id,
  p.department_id,
  p.image_url,
  p.is_popular,
  p.is_monthly_essential,
  p.is_active,
  CASE
    WHEN i.stock_quantity IS NULL OR i.stock_quantity = 0 THEN 'out_of_stock'
    WHEN i.stock_quantity <= i.low_stock_threshold THEN 'low_stock'
    ELSE 'in_stock'
  END AS stock_status
FROM public.products p
LEFT JOIN public.inventory i ON p.id = i.product_id
WHERE p.is_active = true;

-- Grant select to anon & authenticated on public view
GRANT SELECT ON public.public_products TO anon, authenticated;
