-- Add size_value column to order_items table to store the size of the ordered item
ALTER TABLE order_items ADD COLUMN size_value TEXT;