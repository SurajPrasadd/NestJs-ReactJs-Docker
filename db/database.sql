BEGIN;

-- ============================================================
-- 1. USERS
-- ============================================================
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  password_hash VARCHAR NOT NULL,
  name VARCHAR,
  role VARCHAR NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMP NOT NULL DEFAULT now(),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  business_id INT REFERENCES business(id) ON DELETE SET NULL
);

-- ============================================================
-- 2. SESSIONS
-- ============================================================
DROP TABLE IF EXISTS sessions CASCADE;

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  sessionid VARCHAR NOT NULL,
  userId INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  revoked BOOLEAN DEFAULT FALSE,
  expiresAt TIMESTAMP WITH TIME ZONE,
  refreshTokenHash TEXT
);

-- ============================================================
-- 3. CONTACTS
-- ============================================================
DROP TABLE IF EXISTS contacts CASCADE;

CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(50),
  designation VARCHAR(50),
  department VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  users_id INT UNIQUE REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================
-- 4. ORDERS
-- ============================================================
DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  remarks TEXT,
  delivery_address TEXT,
  expected_delivery_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by INT REFERENCES users(id) ON DELETE SET NULL,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  total_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  invoicelink TEXT
);

-- ============================================================
-- 5. ORDER_ITEMS
-- ============================================================
DROP TABLE IF EXISTS order_items CASCADE;

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  pr_number TEXT,
  quantity INT NOT NULL DEFAULT 1,
  price NUMERIC(12,2),
  comment TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  bp_id INT REFERENCES business_products(id) ON DELETE SET NULL
);

-- ============================================================
-- 6. PURCHASE_REQUESTS
-- ============================================================
DROP TABLE IF EXISTS purchase_requests CASCADE;

CREATE TABLE purchase_requests (
  id SERIAL PRIMARY KEY,
  pr_number VARCHAR(50) NOT NULL UNIQUE,
  remarks TEXT,
  status VARCHAR NOT NULL DEFAULT 'PENDING',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  requested_by INT REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================
-- 7. PURCHASE_REQUEST_ITEMS
-- ============================================================
DROP TABLE IF EXISTS purchase_request_items CASCADE;

CREATE TABLE purchase_request_items (
  id SERIAL PRIMARY KEY,
  quantity INT NOT NULL DEFAULT 1,
  price NUMERIC(12,2),
  comment TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  purchase_request_id INT REFERENCES purchase_requests(id) ON DELETE CASCADE,
  bp_id INT REFERENCES business_products(id) ON DELETE SET NULL
);

-- ============================================================
-- 8. APPROVAL_CONFIG
-- ============================================================
DROP TABLE IF EXISTS approval_config CASCADE;

CREATE TABLE approval_config (
  id SERIAL PRIMARY KEY,
  approval_level INT NOT NULL,
  min_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  max_amount NUMERIC(12,2),
  auto_approve BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  group_name VARCHAR(100),
  created_by INT REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================
-- 9. APPROVAL_CONFIG_BUSINESS
-- ============================================================
DROP TABLE IF EXISTS approval_config_business CASCADE;

CREATE TABLE approval_config_business (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approval_config_id INT REFERENCES approval_config(id) ON DELETE CASCADE
);

-- ============================================================
-- 10. APPROVALS
-- ============================================================
DROP TABLE IF EXISTS approvals CASCADE;

CREATE TABLE approvals (
  id SERIAL PRIMARY KEY,
  approval_level INT NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'PENDING',
  comments TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  pr_item_id INT REFERENCES purchase_request_items(id) ON DELETE SET NULL,
  approved_by INT REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================
-- 11. CONTRACTS
-- ============================================================
DROP TABLE IF EXISTS contracts CASCADE;

CREATE TABLE contracts (
  id SERIAL PRIMARY KEY,
  pr_number TEXT,
  price NUMERIC(12,2),
  start_date DATE,
  end_date DATE,
  contractslink TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  buyer_id INT REFERENCES users(id) ON DELETE CASCADE,
  business_id INT REFERENCES business(id) ON DELETE CASCADE,
  bp_id INT REFERENCES business_products(id) ON DELETE SET NULL
);

-- ============================================================
-- 12. CART_ITEMS
-- ============================================================
DROP TABLE IF EXISTS cart_items CASCADE;

CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  bp_id INT REFERENCES business_products(id) ON DELETE SET NULL,
  users_id INT REFERENCES users(id) ON DELETE SET NULL,
  contract_id INT REFERENCES contracts(id) ON DELETE SET NULL
);

END;
