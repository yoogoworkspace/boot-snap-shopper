
-- Drop all existing tables to start fresh
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS models CASCADE;
DROP TABLE IF EXISTS sizes CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS whatsapp_accounts CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS get_current_session_id() CASCADE;
DROP FUNCTION IF EXISTS set_session_context(text) CASCADE;

-- Create categories table (Football Boots, Running & Formal Shoes)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sizes table
CREATE TABLE sizes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create models table
CREATE TABLE models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  size_id UUID REFERENCES sizes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create WhatsApp accounts table
CREATE TABLE whatsapp_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL,
  account_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access to product data
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view sizes" ON sizes FOR SELECT USING (true);
CREATE POLICY "Anyone can view models" ON models FOR SELECT USING (true);
CREATE POLICY "Anyone can view active whatsapp accounts" ON whatsapp_accounts 
  FOR SELECT USING (is_active = true);

-- Create RLS policies for admin management
CREATE POLICY "Authenticated users can manage categories" ON categories 
  FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can manage sizes" ON sizes 
  FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can manage models" ON models 
  FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can manage whatsapp accounts" ON whatsapp_accounts 
  FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can view admin users" ON admin_users 
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Insert initial categories
INSERT INTO categories (name) VALUES 
  ('Football Boots'),
  ('Running & Formal Shoes');

-- Insert demo admin user (email: admin@bootbucket.com, password: admin123)
-- Password hash for 'admin123' using bcrypt
INSERT INTO admin_users (email, password_hash) VALUES 
  ('admin@bootbucket.com', '$2b$10$rQJ5K5K5K5K5K5K5K5K5K.K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5');

-- Insert some demo WhatsApp accounts
INSERT INTO whatsapp_accounts (phone_number, account_name, is_active) VALUES 
  ('+1234567890', 'Main Support', true),
  ('+0987654321', 'Sales Team', true);

-- Insert demo sizes for Football Boots
INSERT INTO sizes (category_id, value) 
SELECT id, size_value FROM categories, 
  (VALUES ('38'), ('39'), ('40'), ('41'), ('42'), ('43'), ('44'), ('45')) AS t(size_value)
WHERE name = 'Football Boots';

-- Insert demo sizes for Running & Formal Shoes
INSERT INTO sizes (category_id, value) 
SELECT id, size_value FROM categories, 
  (VALUES ('7'), ('8'), ('9'), ('10'), ('11'), ('12')) AS t(size_value)
WHERE name = 'Running & Formal Shoes';

-- Insert demo models for Football Boots
INSERT INTO models (category_id, size_id, name, price, image_url)
SELECT c.id, s.id, model_name, model_price, model_image
FROM categories c
JOIN sizes s ON c.id = s.category_id
CROSS JOIN (
  VALUES 
    ('Nike Mercurial Vapor', 129.99, 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=400&h=400&fit=crop'),
    ('Adidas Predator Elite', 159.99, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop'),
    ('Puma Future Z', 139.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop')
) AS t(model_name, model_price, model_image)
WHERE c.name = 'Football Boots';

-- Insert demo models for Running & Formal Shoes
INSERT INTO models (category_id, size_id, name, price, image_url)
SELECT c.id, s.id, model_name, model_price, model_image
FROM categories c
JOIN sizes s ON c.id = s.category_id
CROSS JOIN (
  VALUES 
    ('Nike Air Max', 99.99, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop'),
    ('Adidas Ultraboost', 119.99, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'),
    ('Oxford Dress Shoes', 89.99, 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop')
) AS t(model_name, model_price, model_image)
WHERE c.name = 'Running & Formal Shoes';
