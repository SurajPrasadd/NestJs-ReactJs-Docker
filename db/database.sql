CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(100),
  business_id INT REFERENCES business(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- business TABLE
CREATE TABLE business (
  id SERIAL PRIMARY KEY,
  business_name VARCHAR(150),
  business_email VARCHAR(100),
  business_phone VARCHAR(50),
  business_address TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CONTACTS TABLE (Business Contacts)
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  users_id INT REFERENCES users(id),
  phone VARCHAR(50),
  designation VARCHAR(50),
  department VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CATEGORY TABLE
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  parent_id INT REFERENCES categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCT TABLE
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  name VARCHAR(150) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  image_url VARCHAR(255) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE business_products (
  id SERIAL PRIMARY KEY,
  business_id INTEGER REFERENCES business(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  price NUMERIC(12, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'Rs',
  min_quantity INT DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_business_product UNIQUE (business_id, product_id)
);


-- CART ITEMS TABLE
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  users_id INT REFERENCES users(id) ON DELETE SET NULL,
  product_id INT REFERENCES products(id) ON DELETE SET NULL,
  quantity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- STOCK TABLE (per business/product)
CREATE TABLE stock (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id) ON DELETE CASCADE,
  business_id INT REFERENCES business(id) ON DELETE CASCADE,
  quantity INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CONTRACT TABLE
CREATE TABLE contracts (
  id SERIAL PRIMARY KEY,
  buyer_id INT REFERENCES users(id) ON DELETE CASCADE,
  business_id INT REFERENCES business(id) ON DELETE CASCADE,
  contract_number VARCHAR(100) UNIQUE NOT NULL,
  start_date DATE,
  end_date DATE,
  terms TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ORDER HISTORY TABLE
CREATE TABLE order_history (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id) ON DELETE CASCADE,
  buyer_id INT REFERENCES users(id) ON DELETE SET NULL,
  business_id INT REFERENCES business(id) ON DELETE SET NULL,
  total_amount NUMERIC(12,2),
  is_active BOOLEAN DEFAULT TRUE,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status INT  -- 'Order submission','Order approval','Payment processing','Shipping','Delivered'
);
