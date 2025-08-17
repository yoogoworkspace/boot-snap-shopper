
-- Create orders table to store order information
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  total_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  customer_info JSONB
);

-- Create order_items table to store individual items in each order
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  model_id UUID REFERENCES public.models(id) NOT NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  size_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view orders (for public order pages)
CREATE POLICY "Anyone can view orders" 
  ON public.orders 
  FOR SELECT 
  USING (true);

-- Allow anyone to create orders
CREATE POLICY "Anyone can create orders" 
  ON public.orders 
  FOR INSERT 
  WITH CHECK (true);

-- Authenticated users can manage all orders
CREATE POLICY "Authenticated users can manage orders" 
  ON public.orders 
  FOR ALL 
  USING (auth.uid() IS NOT NULL);

-- Add RLS policies for order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view order items
CREATE POLICY "Anyone can view order items" 
  ON public.order_items 
  FOR SELECT 
  USING (true);

-- Allow anyone to create order items
CREATE POLICY "Anyone can create order items" 
  ON public.order_items 
  FOR INSERT 
  WITH CHECK (true);

-- Authenticated users can manage all order items
CREATE POLICY "Authenticated users can manage order items" 
  ON public.order_items 
  FOR ALL 
  USING (auth.uid() IS NOT NULL);

-- Create storage bucket for model images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('model-images', 'model-images', true);

-- Create storage policy for model images
CREATE POLICY "Anyone can view model images" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'model-images');

-- Allow authenticated users to upload model images
CREATE POLICY "Authenticated users can upload model images" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'model-images' AND auth.uid() IS NOT NULL);

-- Allow authenticated users to update model images
CREATE POLICY "Authenticated users can update model images" 
  ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'model-images' AND auth.uid() IS NOT NULL)
  WITH CHECK (bucket_id = 'model-images' AND auth.uid() IS NOT NULL);

-- Allow authenticated users to delete model images
CREATE POLICY "Authenticated users can delete model images" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'model-images' AND auth.uid() IS NOT NULL);
