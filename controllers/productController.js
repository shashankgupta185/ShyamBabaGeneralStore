const pool = require("../config/db");

const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, 
             c.name AS category_name, 
             c.slug AS category_slug
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
      ORDER BY p.is_featured DESC, p.created_at DESC
    `);

    const products = result.rows.map((p) => ({
      ...p,
      images: p.images || null,
    }));

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const catResult = await pool.query(
      "SELECT id FROM categories WHERE slug = $1",
      [category],
    );

    if (catResult.rows.length === 0) {
      return res.status(404).json({ error: "Category not found." });
    }

    const categoryId = catResult.rows[0].id;

    const result = await pool.query(
      `
      SELECT p.*, 
             c.name AS category_name, 
             c.slug AS category_slug
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = $1 AND p.is_active = true
      ORDER BY p.is_featured DESC, p.created_at DESC
      `,
      [categoryId],
    );

    const products = result.rows.map((p) => ({
      ...p,
      images: p.images || null,
    }));

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT p.*, 
             c.name AS category_name, 
             c.slug AS category_slug
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
      `,
      [req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    const product = result.rows[0];
    product.images = product.images || null;

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) return res.json([]);

    const term = `%${q}%`;

    const result = await pool.query(
      `
      SELECT p.*, 
             c.name AS category_name, 
             c.slug AS category_slug
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
        AND (
          p.name ILIKE $1 OR
          p.brand ILIKE $1 OR
          p.description ILIKE $1
        )
      ORDER BY p.is_featured DESC
      `,
      [term],
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM categories WHERE is_active = true ORDER BY name",
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  getAllProducts,
  getProductsByCategory,
  getProductById,
  searchProducts,
  getAllCategories,
};
