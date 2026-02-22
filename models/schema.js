const pool = require("../config/db");

const initDB = async () => {
  try {

    // ───────── Categories ─────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(120) NOT NULL UNIQUE,
        image VARCHAR(500),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // ───────── Products ─────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(280) NOT NULL UNIQUE,
        category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
        brand VARCHAR(150) DEFAULT '',
        weight VARCHAR(50) DEFAULT '',
        price NUMERIC(10,2) NOT NULL,
        discount_price NUMERIC(10,2),
        stock INT DEFAULT 0,
        rating NUMERIC(2,1) DEFAULT 0.0,
        total_reviews INT DEFAULT 0,
        images JSONB,
        description TEXT,
        is_featured BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // ───────── Users ─────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(200) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(20) DEFAULT '',
        role VARCHAR(20) DEFAULT 'customer'
          CHECK (role IN ('customer','admin')),
        addresses JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // ───────── Cart Items ─────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        quantity INT DEFAULT 1,
        price_at_time NUMERIC(10,2) NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE (user_id, product_id)
      );
    `);

    // ───────── Orders ─────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        items JSONB NOT NULL,
        total_amount NUMERIC(10,2) NOT NULL,
        payment_status VARCHAR(20) DEFAULT 'pending'
          CHECK (payment_status IN ('pending','paid','failed','refunded')),
        delivery_status VARCHAR(20) DEFAULT 'processing'
          CHECK (delivery_status IN ('processing','shipped','delivered','cancelled')),
        payment_method VARCHAR(50) DEFAULT 'cod',
        address JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("✅ PostgreSQL tables created successfully - schema.js:86");

  } catch (err) {
    console.error("❌ Database init error: - schema.js:89", err);
    throw err;
  }
};

module.exports = { initDB };