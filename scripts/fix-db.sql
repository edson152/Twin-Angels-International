-- Run this if you already migrated and need to fix the FK constraint
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;
ALTER TABLE order_items ADD CONSTRAINT order_items_product_id_fkey
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;

-- Also ensure product_id allows NULL (it should already)
ALTER TABLE order_items ALTER COLUMN product_id DROP NOT NULL;
