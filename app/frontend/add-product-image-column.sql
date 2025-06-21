-- Add image_url column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS image_url TEXT;
 
-- Add comment to document the column
COMMENT ON COLUMN products.image_url IS 'URL of the product image stored in Supabase storage'; 