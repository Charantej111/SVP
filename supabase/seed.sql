-- ==============================================================================
-- SPV Super Bazaar - Seed Data
-- ==============================================================================

-- 1. SEED CATEGORIES / DEPARTMENTS
INSERT INTO public.categories (id, name, slug, description, image_url, is_active, sort_order)
VALUES
  ('staples', 'Staples & Kitchen Needs', 'staples', 'Rice, Atta, Dals, Cooking Oils, Ghee & Spices', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', true, 1),
  ('food', 'Snacks & Packaged Food', 'food', 'Ready-to-cook items, evening snacks, tea-time biscuits and spices.', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80', true, 2),
  ('fresh-dairy', 'Dairy, Bread & Breakfast', 'fresh-dairy', 'Daily replenished Heritage & Amul milk, butter, fresh paneer, and breakfast breads.', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80', true, 3),
  ('beverages', 'Beverages & Tea/Coffee', 'beverages', 'Refreshing daily tea, premium coffee blends, nutrition drinks and juices.', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80', true, 4),
  ('personal-care', 'Personal Care & Hygiene', 'personal-care', 'Daily personal hygiene, family grooming and baby care essentials.', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80', true, 5),
  ('home-cleaning', 'Home Care & Cleaning', 'home-cleaning', 'Keep your home spotless with leading detergents and cleaning liquids.', 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80', true, 6)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url;

-- 2. SEED SAMPLE CORE PRODUCTS
INSERT INTO public.products (id, name, slug, brand, pack_size, price, sale_price, mrp, category_id, subcategory_id, department_id, image_url, is_popular, is_monthly_essential, is_active)
VALUES
  ('staple-01', 'Aashirvaad Superior MP Atta', 'aashirvaad-superior-mp-atta-5kg', 'Aashirvaad', '5 kg Bag', 265.00, 255.00, 275.00, 'staples', 'atta-flour', 'staples', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80', true, true, true),
  ('staple-02', 'Freedom Physically Refined Sunflower Oil', 'freedom-sunflower-oil-1l', 'Freedom', '1 L Pouch', 135.00, 128.00, 145.00, 'staples', 'cooking-oil', 'staples', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80', true, true, true),
  ('staple-03', 'Tata Sampann Unpolished Toor Dal', 'tata-sampann-toor-dal-1kg', 'Tata Sampann', '1 kg', 185.00, 175.00, 195.00, 'staples', 'dals-pulses', 'staples', 'https://images.unsplash.com/photo-1585996656730-22c6e6dfbc9a?auto=format&fit=crop&w=400&q=80', true, true, true),
  ('staple-04', 'Fortune Sunlite Refined Sunflower Oil', 'fortune-sunflower-oil-1l', 'Fortune', '1 L Pouch', 138.00, 130.00, 148.00, 'staples', 'cooking-oil', 'staples', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80', true, true, true),
  ('staple-05', 'Tata Salt Vacuum Evaporated Iodized Salt', 'tata-salt-1kg', 'Tata', '1 kg', 28.00, 26.00, 30.00, 'staples', 'sugar-jaggery-salt', 'staples', 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=400&q=80', true, true, true),
  ('fresh-01', 'Special Toned Fresh Milk', 'heritage-special-toned-milk-500ml', 'Heritage', '500 ml Pouch', 29.00, NULL, 30.00, 'fresh-dairy', 'milk-dairy', 'fresh-dairy', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80', true, false, true),
  ('fresh-02', 'Pasteurized Salted Table Butter', 'amul-table-butter-100g', 'Amul', '100 g', 58.00, NULL, 60.00, 'fresh-dairy', 'milk-dairy', 'fresh-dairy', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80', true, false, true),
  ('fresh-03', 'Fresh Soft Malai Paneer', 'amul-malai-paneer-200g', 'Amul', '200 g', 95.00, NULL, 100.00, 'fresh-dairy', 'milk-dairy', 'fresh-dairy', 'https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&w=400&q=80', true, false, true),
  ('fresh-04', 'Family Sandwich White Bread Loaf', 'modern-white-bread-400g', 'Modern', '400 g', 45.00, NULL, 48.00, 'fresh-dairy', 'bread-bakery', 'fresh-dairy', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80', true, false, true),
  ('fresh-05', 'Fresh Pure Cow Milk', 'heritage-pure-cow-milk-500ml', 'Heritage', '500 ml Pouch', 32.00, NULL, 34.00, 'fresh-dairy', 'milk-dairy', 'fresh-dairy', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80', true, false, true),
  ('fresh-06', '100% Whole Wheat Bread Loaf', 'modern-whole-wheat-bread-400g', 'Modern', '400 g', 50.00, NULL, 55.00, 'fresh-dairy', 'bread-bakery', 'fresh-dairy', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80', false, true, true),
  ('fresh-07', 'Pasteurized Processed Cheese Slices', 'amul-cheese-slices-200g', 'Amul', '200 g (10 Slices)', 145.00, NULL, 155.00, 'fresh-dairy', 'butter-cheese', 'fresh-dairy', 'https://images.unsplash.com/photo-1624806992066-5ffcf7ca186b?auto=format&fit=crop&w=400&q=80', true, false, true),
  ('fresh-08', 'Daily Fresh Curd Cup (Creamy)', 'heritage-curd-cup-400g', 'Heritage', '400 g Cup', 45.00, NULL, 50.00, 'fresh-dairy', 'milk-dairy', 'fresh-dairy', 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=400&q=80', true, true, true),
  ('fresh-09', 'Toastea Premium Crunchy Wheat Rusk', 'britannia-toastea-rusk-400g', 'Britannia', '400 g', 60.00, NULL, 65.00, 'fresh-dairy', 'bread-bakery', 'fresh-dairy', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80', true, true, true),
  ('food-01', 'Maggi 2-Minute Masala Instant Noodles', 'maggi-masala-noodles-420g', 'Maggi', '420 g (6 Pack)', 84.00, 78.00, 90.00, 'food', 'noodles-pasta', 'food', 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80', true, true, true),
  ('bev-01', 'Tata Tea Gold (Rich Flavor & Aroma)', 'tata-tea-gold-500g', 'Tata Tea', '500 g', 310.00, 290.00, 330.00, 'beverages', 'tea', 'beverages', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80', true, true, true),
  ('bev-06', 'Real 100% Mixed Fruit Juice', 'real-mixed-fruit-juice-1l', 'Real', '1 L Tetra Pack', 130.00, NULL, 140.00, 'beverages', 'juices', 'beverages', 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=400&q=80', false, false, true),
  ('clean-01', 'Surf Excel Easy Wash Detergent Powder', 'surf-excel-easy-wash-1kg', 'Surf Excel', '1 kg', 140.00, 132.00, 148.00, 'home-cleaning', 'laundry', 'home-cleaning', 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=400&q=80', true, true, true),
  ('care-01', 'Santoor Sandal & Turmeric Bath Soap', 'santoor-soap-4x100g', 'Santoor', '4 × 100 g Multipack', 140.00, 128.00, 150.00, 'personal-care', 'bath-body', 'personal-care', 'https://images.unsplash.com/photo-1607006314144-8468307374d6?auto=format&fit=crop&w=400&q=80', true, true, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  sale_price = EXCLUDED.sale_price,
  is_active = EXCLUDED.is_active;

-- 3. INITIALIZE INVENTORY FOR ALL PRODUCTS
INSERT INTO public.inventory (product_id, stock_quantity, low_stock_threshold)
SELECT id, 40, 5 FROM public.products
ON CONFLICT (product_id) DO NOTHING;

-- 4. INSTRUCTIONS TO ASSIGN ADMIN ROLE MANUALLY:
-- Step A: Sign up admin email and password in Supabase Dashboard -> Authentication -> Users
-- Step B: Run this SQL query with your admin email:
-- UPDATE public.users SET role = 'admin' WHERE email = 'your_admin_email@domain.com';
