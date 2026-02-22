const pool = require("../config/db");
const getCart = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT ci.*, p.name, p.brand, p.weight, p.price, 
             p.discount_price, p.images, p.stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = $1
      `,
      [req.user.id],
    );

    const cart = result.rows.map((item) => ({
      ...item,
      images: item.images || null,
    }));

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    if (!product_id)
      return res.status(400).json({ error: "Product ID is required." });

    const productResult = await pool.query(
      "SELECT id, price, discount_price, stock FROM products WHERE id = $1",
      [product_id],
    );

    if (productResult.rows.length === 0)
      return res.status(404).json({ error: "Product not found." });

    const product = productResult.rows[0];

    if (product.stock < quantity)
      return res.status(400).json({ error: "Insufficient stock." });

    const price = product.discount_price || product.price;

    await pool.query(
      `
      INSERT INTO cart_items (user_id, product_id, quantity, price_at_time)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, product_id)
      DO UPDATE SET
        quantity = cart_items.quantity + EXCLUDED.quantity,
        price_at_time = EXCLUDED.price_at_time
      `,
      [req.user.id, product_id, quantity, price],
    );

    res.json({ message: "Added to cart." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    if (!product_id || quantity === undefined) {
      return res
        .status(400)
        .json({ error: "Product ID and quantity are required." });
    }

    if (quantity <= 0) {
      await pool.query(
        "DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2",
        [req.user.id, product_id],
      );

      return res.json({ message: "Item removed from cart." });
    }

    const productResult = await pool.query(
      "SELECT stock, price, discount_price FROM products WHERE id = $1",
      [product_id],
    );

    if (productResult.rows.length === 0)
      return res.status(404).json({ error: "Product not found." });

    const product = productResult.rows[0];

    if (product.stock < quantity)
      return res.status(400).json({ error: "Insufficient stock." });

    const price = product.discount_price || product.price;

    await pool.query(
      `
      UPDATE cart_items
      SET quantity = $1,
          price_at_time = $2
      WHERE user_id = $3 AND product_id = $4
      `,
      [quantity, price, req.user.id, product_id],
    );

    res.json({ message: "Cart updated." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const removeFromCart = async (req, res) => {
  try {
    const { product_id } = req.body;

    if (!product_id)
      return res.status(400).json({ error: "Product ID is required." });

    await pool.query(
      "DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2",
      [req.user.id, product_id],
    );

    res.json({ message: "Item removed from cart." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getCart, addToCart, updateCart, removeFromCart };
