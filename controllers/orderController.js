const pool = require("../config/db");

const createOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { address, payment_method = "cod" } = req.body;
    const cartResult = await client.query(
      `
      SELECT ci.*, p.name, p.brand, p.weight, p.price, 
             p.discount_price, p.stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = $1
      `,
      [req.user.id],
    );

    const cartItems = cartResult.rows;

    if (cartItems.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Cart is empty." });
    }

    let total = 0;
    const orderItems = [];

    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        await client.query("ROLLBACK");
        return res
          .status(400)
          .json({ error: `Insufficient stock for ${item.name}.` });
      }

      const price = item.discount_price || item.price;
      total += price * item.quantity;

      orderItems.push({
        product_id: item.product_id,
        name: item.name,
        brand: item.brand,
        weight: item.weight,
        quantity: item.quantity,
        price: parseFloat(price),
      });

      await client.query(
        "UPDATE products SET stock = stock - $1 WHERE id = $2",
        [item.quantity, item.product_id],
      );
    }
    debugger;

    const insertResult = await client.query(
      `
  INSERT INTO orders
  (user_id, items, total_amount, payment_method, address)
  VALUES ($1, $2::jsonb, $3::numeric, $4::varchar, $5::jsonb)
  RETURNING id
  `,
      [
        req.user.id,
        JSON.stringify(orderItems),
        Number(total),
        String(payment_method),
        JSON.stringify(address || {}),
      ],
    );

    await client.query("DELETE FROM cart_items WHERE user_id = $1", [
      req.user.id,
    ]);

    await client.query("COMMIT");

    res.status(201).json({
      message: "Order placed successfully.",
      order_id: insertResult.rows[0].id,
      total,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

const getOrderHistory = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id],
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM orders WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id],
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Order not found." });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createOrder, getOrderHistory, getOrderById };
