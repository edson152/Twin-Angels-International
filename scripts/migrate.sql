-- Twin Angels International Development
-- Database Schema v1.0
-- Run with: psql $DATABASE_URL -f scripts/migrate.sql

-- ─── EXTENSIONS ────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── USERS ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  first_name  VARCHAR(100) NOT NULL,
  last_name   VARCHAR(100) NOT NULL,
  phone       VARCHAR(30),
  role        VARCHAR(30) NOT NULL DEFAULT 'customer'
                CHECK (role IN ('customer','admin','it_support','warehouse','dispatch')),
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── CATEGORIES ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(100) UNIQUE NOT NULL,
  icon        VARCHAR(10),
  description TEXT,
  image       TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── PRODUCTS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id                SERIAL PRIMARY KEY,
  name              VARCHAR(255) NOT NULL,
  slug              VARCHAR(255) UNIQUE NOT NULL,
  description       TEXT,
  price_usd         NUMERIC(12,2) NOT NULL,
  price_zig         NUMERIC(12,2) NOT NULL,
  compare_price_usd NUMERIC(12,2),
  category_id       INT REFERENCES categories(id),
  stock             INT NOT NULL DEFAULT 0,
  images            TEXT[],
  is_featured       BOOLEAN NOT NULL DEFAULT false,
  is_on_sale        BOOLEAN NOT NULL DEFAULT false,
  is_active         BOOLEAN NOT NULL DEFAULT true,
  sales_count       INT NOT NULL DEFAULT 0,
  sku               VARCHAR(100),
  weight_kg         NUMERIC(8,3),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;

-- ─── BANNERS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS banners (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(200),
  subtitle    VARCHAR(200),
  description TEXT,
  image       TEXT,
  cta_text    VARCHAR(100),
  cta_url     VARCHAR(255),
  is_active   BOOLEAN NOT NULL DEFAULT true,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── DELIVERY ZONES ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS delivery_zones (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(100) UNIQUE NOT NULL,
  fee_usd     NUMERIC(8,2) NOT NULL,
  fee_zig     NUMERIC(10,2) NOT NULL,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  description TEXT
);

-- ─── DRIVERS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS drivers (
  id         SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name  VARCHAR(100) NOT NULL,
  phone      VARCHAR(30) NOT NULL,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── VEHICLES ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vehicles (
  id          SERIAL PRIMARY KEY,
  plate       VARCHAR(20) UNIQUE NOT NULL,
  make        VARCHAR(50),
  model       VARCHAR(50),
  is_active   BOOLEAN NOT NULL DEFAULT true
);

-- ─── ORDERS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id                  SERIAL PRIMARY KEY,
  order_number        VARCHAR(20) UNIQUE NOT NULL,
  customer_first_name VARCHAR(100) NOT NULL,
  customer_last_name  VARCHAR(100) NOT NULL,
  customer_email      VARCHAR(255) NOT NULL,
  customer_phone      VARCHAR(30) NOT NULL,
  customer_address    TEXT NOT NULL,
  delivery_zone       VARCHAR(100) NOT NULL,
  payment_method      VARCHAR(50) NOT NULL,
  currency            VARCHAR(5) NOT NULL DEFAULT 'USD',
  subtotal            NUMERIC(12,2) NOT NULL,
  delivery_fee        NUMERIC(10,2) NOT NULL DEFAULT 0,
  total               NUMERIC(12,2) NOT NULL,
  status              VARCHAR(50) NOT NULL DEFAULT 'pending',
  is_urgent           BOOLEAN NOT NULL DEFAULT false,
  notes               TEXT,
  warehouse_picker    VARCHAR(100),
  driver_id           INT REFERENCES drivers(id),
  vehicle_id          INT REFERENCES vehicles(id),
  payment_confirmed_at TIMESTAMPTZ,
  dispatched_at       TIMESTAMPTZ,
  delivered_at        TIMESTAMPTZ,
  estimated_delivery  DATE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- ─── ORDER ITEMS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id           SERIAL PRIMARY KEY,
  order_id     INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id   INT REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  quantity     INT NOT NULL,
  price        NUMERIC(12,2) NOT NULL,
  currency     VARCHAR(5) NOT NULL DEFAULT 'USD'
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- ─── PAYMENT RECORDS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payment_records (
  id              SERIAL PRIMARY KEY,
  order_id        INT NOT NULL REFERENCES orders(id),
  payment_method  VARCHAR(50) NOT NULL,
  amount          NUMERIC(12,2) NOT NULL,
  currency        VARCHAR(5) NOT NULL,
  reference       VARCHAR(100),
  status          VARCHAR(20) NOT NULL DEFAULT 'pending',
  verified_by     INT REFERENCES users(id),
  verified_at     TIMESTAMPTZ,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── SITE SETTINGS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  key         VARCHAR(100) PRIMARY KEY,
  value       TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by  INT REFERENCES users(id)
);

-- ─── SEED DEFAULTS ─────────────────────────────────────────────
INSERT INTO categories (name, slug, icon, sort_order) VALUES
  ('Building Materials', 'building-materials', '🧱', 1),
  ('Fabric Rolls',       'fabric-rolls',       '🧵', 2),
  ('Printing Machines',  'printing-machines',  '🖨️', 3),
  ('Office Furniture',   'office-furniture',   '🪑', 4),
  ('House Furniture',    'house-furniture',    '🛋️', 5)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO delivery_zones (name, slug, fee_usd, fee_zig) VALUES
  ('Harare',            'harare',   5,  350),
  ('Bulawayo',          'bulawayo', 15, 1050),
  ('Mutare',            'mutare',   18, 1260),
  ('Gweru',             'gweru',    12, 840),
  ('Masvingo',          'masvingo', 20, 1400),
  ('Custom Rural Zone', 'rural',    25, 1750)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO site_settings (key, value) VALUES
  ('usd_to_zig_rate',  '70'),
  ('site_name',        'Twin Angels International Development'),
  ('support_email',    'edsonnyoni92@gmail.com'),
  ('whatsapp_number',  '+263XXXXXXXXX'),
  ('primary_color',    '#C8A96B'),
  ('maintenance_mode', 'false')
ON CONFLICT (key) DO NOTHING;

-- Default admin user (password: Admin@2024 — CHANGE IMMEDIATELY)
INSERT INTO users (email, password, first_name, last_name, role) VALUES
  ('admin@twinangels.co.zw', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMqJqhJ./X1uGMUmKxBj0uQ8.C', 'Admin', 'User', 'admin')
ON CONFLICT (email) DO NOTHING;
