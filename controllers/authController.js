const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
require("dotenv").config();

const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email and password are required." });
    }

    // Check existing user
    const existingResult = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );

    if (existingResult.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered." });
    }

    const password_hash = await bcrypt.hash(password, 12);

    // Insert user
    const insertResult = await pool.query(
      `INSERT INTO users (name, email, password_hash, phone, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [name, email, password_hash, phone || "", "customer"],
    );

    const userId = insertResult.rows[0].id;

    const token = jwt.sign(
      { id: userId, email, role: "customer", name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    res.status(201).json({
      token,
      user: { id: userId, name, email, role: "customer" },
    });
  } catch (err) {
    res.status(500).json({ error: "Registration failed: " + err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const user = result.rows[0];

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed: " + err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, phone, role, addresses, created_at
       FROM users
       WHERE id = $1`,
      [req.user.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const user = result.rows[0];

    // If addresses is JSONB, it's already parsed automatically
    user.addresses = user.addresses || [];

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateAddress = async (req, res) => {
  try {
    const { addresses } = req.body;

    await pool.query("UPDATE users SET addresses = $1 WHERE id = $2", [
      addresses,
      req.user.id,
    ]);

    res.json({ message: "Addresses updated." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login, getProfile, updateAddress };
