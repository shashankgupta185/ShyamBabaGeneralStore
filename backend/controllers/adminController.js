const pool = require("../config/db");

const addProduct = async (req, res) => {
  try {
    const {
      name,
      category_id,
      brand,
      weight,
      price,
      discount_price,
      stock,
      rating,
      description,
      is_featured,
      images,
    } = req.body;

    if (!name || !category_id || !price) {
      return res
        .status(400)
        .json({ error: "Name, category_id, and price are required." });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const result = await pool.query(
      `INSERT INTO products 
       (name, slug, category_id, brand, weight, price, discount_price, stock, rating, images, description, is_featured, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,true)
       RETURNING id`,
      [
        name,
        slug,
        category_id,
        brand || "",
        weight || "",
        price,
        discount_price || null,
        stock || 0,
        rating || 0,
        images || null,
        description || "",
        is_featured ? true : false,
      ],
    );

    res.status(201).json({
      message: "Product added.",
      id: result.rows[0].id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;

    if (fields.name) {
      fields.slug = fields.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const allowed = [
      "name",
      "slug",
      "category_id",
      "brand",
      "weight",
      "price",
      "discount_price",
      "stock",
      "rating",
      "images",
      "description",
      "is_featured",
      "is_active",
    ];

    const updates = [];
    const values = [];
    let index = 1;

    for (const key of allowed) {
      if (fields[key] !== undefined) {
        updates.push(`${key} = $${index}`);
        values.push(fields[key]);
        index++;
      }
    }

    if (updates.length === 0)
      return res.status(400).json({ error: "No fields to update." });

    values.push(id);

    await pool.query(
      `UPDATE products SET ${updates.join(", ")} WHERE id = $${index}`,
      values,
    );

    res.json({ message: "Product updated." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await pool.query("DELETE FROM products WHERE id = $1", [req.params.id]);
    res.json({ message: "Product deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllProductsAdmin = async (req, res) => {
  try {
    const { category_id } = req.query;

    if (!category_id) {
      return res.status(400).json({
        status: false,
        message: "category_id is required",
      });
    }

    const result = await pool.query(
      `SELECT p.*, c.name as category_name 
   FROM products p 
   JOIN categories c ON p.category_id = c.id
   WHERE p.category_id = $1
   ORDER BY p.created_at DESC`,
      [category_id],
    );

    const rows = result.rows;
    const products = rows.map((p) => ({
      id: p.id ?? null,
      name: p.name ?? "",
      slug: p.slug ?? "",
      category_id: p.category_id ?? null,
      brand: p.brand ?? "",
      weight: p.weight ?? "",
      price: Number(p.price ?? 0),
      discount_price: Number(p.discount_price ?? 0),
      stock: Number(p.stock ?? 0),
      rating: Number(p.rating ?? 0),
      total_reviews: Number(p.total_reviews ?? 0),
      description: p.description ?? "",
      is_featured: Boolean(p.is_featured),
      is_active: Boolean(p.is_active),
      created_at: p.created_at ?? null,
      updated_at: p.updated_at ?? null,
      category_name: p.category_name ?? "",
      images: p.images,
    }));

    return res.status(200).json({
      status: true,
      count: products.length,
      data: products,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

// ─── Order Management ───────────────────────────────
const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let query = `
      SELECT o.*, u.name as user_name, u.email as user_email 
      FROM orders o 
      JOIN users u ON o.user_id = u.id
    `;
    const params = [];

    if (status) {
      query += " WHERE o.delivery_status = $1";
      params.push(status);
    }
    query += " ORDER BY o.created_at DESC";

    const result = await pool.query(query, params);
    const orders = result.rows;
    const parsed = orders.map((o) => ({
      ...o,
      items: typeof o.items === "string" ? JSON.parse(o.items) : o.items,
      address:
        typeof o.address === "string" ? JSON.parse(o.address) : o.address,
    }));
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { delivery_status, payment_status } = req.body;

    const updates = [];
    const values = [];
    let index = 1;

    if (delivery_status) {
      updates.push(`delivery_status = $${index++}`);
      values.push(delivery_status);
    }

    if (payment_status) {
      updates.push(`payment_status = $${index++}`);
      values.push(payment_status);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No status to update." });
    }

    values.push(id);

    await pool.query(
      `UPDATE orders SET ${updates.join(", ")} WHERE id = $${index}`,
      values,
    );

    res.json({ message: "Order status updated." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Dashboard Stats ────────────────────────────────
const getDashboardStats = async (req, res) => {
  try {
    const revenueResult = await pool.query(
      `SELECT COALESCE(SUM(total_amount), 0) AS totalrevenue
   FROM orders
   WHERE payment_status = 'paid'`,
    );
    const totalRevenue = revenueResult.rows[0].totalrevenue;

    const ordersResult = await pool.query(
      `SELECT COUNT(*) AS totalorders FROM orders`,
    );
    const totalOrders = ordersResult.rows[0].totalorders;

    const productsResult = await pool.query(
      `SELECT COUNT(*) AS totalproducts FROM products`,
    );
    const totalProducts = productsResult.rows[0].totalproducts;

    const usersResult = await pool.query(
      `SELECT COUNT(*) AS totalusers FROM users WHERE role = 'customer'`,
    );
    const totalUsers = usersResult.rows[0].totalusers;

    const lowStockResult = await pool.query(
      `SELECT id, name, stock
   FROM products
   WHERE stock < 10 AND is_active = true
   ORDER BY stock ASC
   LIMIT 10`,
    );
    const lowStock = lowStockResult.rows;

    const dailySalesResult = await pool.query(`
  SELECT DATE(created_at) AS date,
         SUM(total_amount) AS revenue,
         COUNT(*) AS orders
  FROM orders
  WHERE created_at >= NOW() - INTERVAL '30 days'
  GROUP BY DATE(created_at)
  ORDER BY date
`);

    const dailySales = dailySalesResult.rows;

    const topProductsResult = await pool.query(`
  SELECT p.id,
         p.name,
         p.brand,
         SUM((item->>'quantity')::int) AS total_sold
  FROM orders o
  CROSS JOIN LATERAL jsonb_array_elements(o.items) AS item
  JOIN products p
    ON p.id = (item->>'product_id')::int
  GROUP BY p.id, p.name, p.brand
  ORDER BY total_sold DESC
  LIMIT 10
`);

    const topProducts = topProductsResult.rows;

    const recentOrdersResult = await pool.query(`
  SELECT o.id,
         o.total_amount,
         o.delivery_status,
         o.payment_status,
         o.created_at,
         u.name AS user_name
  FROM orders o
  JOIN users u ON o.user_id = u.id
  ORDER BY o.created_at DESC
  LIMIT 5
`);

    const recentOrders = recentOrdersResult.rows;
    res.json({
      totalRevenue: parseFloat(totalRevenue),
      totalOrders: parseInt(totalOrders),
      totalProducts: parseInt(totalProducts),
      totalUsers: parseInt(totalUsers),
      lowStock,
      dailySales,
      topProducts,
      recentOrders,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Category Management ────────────────────────────
const addCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name) return res.status(400).json({ error: "Name required." });

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const result = await pool.query(
      `INSERT INTO categories (name, slug, image)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [name, slug, image || ""],
    );

    res.status(201).json({
      message: "Category added.",
      id: result.rows[0].id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllCategoriesAdmin = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM categories ORDER BY name`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProductsAdmin,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
  addCategory,
  getAllCategoriesAdmin,
};
