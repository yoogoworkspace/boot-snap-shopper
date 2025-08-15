
-- First, let's update the storage policies to allow authenticated users to upload images
-- Create policy for authenticated users to upload to model-images bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('model-images', 'model-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow authenticated users to insert objects into model-images bucket
CREATE POLICY "Authenticated users can upload model images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'model-images' AND 
  auth.uid() IS NOT NULL
);

-- Allow authenticated users to update their uploaded objects
CREATE POLICY "Authenticated users can update model images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'model-images' AND 
  auth.uid() IS NOT NULL
);

-- Allow authenticated users to delete their uploaded objects
CREATE POLICY "Authenticated users can delete model images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'model-images' AND 
  auth.uid() IS NOT NULL
);

-- Allow anyone to view public model images
CREATE POLICY "Anyone can view model images" ON storage.objects
FOR SELECT USING (bucket_id = 'model-images');

-- Update categories table policies to allow admin operations
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON categories;
CREATE POLICY "Admin users can manage categories" ON categories
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = (auth.jwt() ->> 'email')
  )
);

-- Update models table policies 
DROP POLICY IF EXISTS "Authenticated users can manage models" ON models;
CREATE POLICY "Admin users can manage models" ON models
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = (auth.jwt() ->> 'email')
  )
);

-- Update sizes table policies
DROP POLICY IF EXISTS "Authenticated users can manage sizes" ON sizes;
CREATE POLICY "Admin users can manage sizes" ON sizes
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = (auth.jwt() ->> 'email')
  )
);

-- Update whatsapp_accounts table policies
DROP POLICY IF EXISTS "Authenticated users can manage whatsapp accounts" ON whatsapp_accounts;
CREATE POLICY "Admin users can manage whatsapp accounts" ON whatsapp_accounts
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = (auth.jwt() ->> 'email')
  )
);

-- Update order_items table policies
DROP POLICY IF EXISTS "Authenticated users can manage order items" ON order_items;
CREATE POLICY "Admin users can manage order items" ON order_items
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = (auth.jwt() ->> 'email')
  )
);

-- Update orders table policies
DROP POLICY IF EXISTS "Authenticated users can manage orders" ON orders;
CREATE POLICY "Admin users can manage orders" ON orders
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = (auth.jwt() ->> 'email')
  )
);
