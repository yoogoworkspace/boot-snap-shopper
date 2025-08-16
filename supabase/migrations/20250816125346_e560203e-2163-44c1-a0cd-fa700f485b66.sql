
-- Add the is_hidden column to the models table
ALTER TABLE public.models ADD COLUMN IF NOT EXISTS is_hidden boolean DEFAULT false;
