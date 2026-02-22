const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductsByCategory,
  getProductById,
  searchProducts,
  getAllCategories,
} = require("../controllers/productController");

router.get("/categories", getAllCategories);
router.get("/products", getAllProducts);
router.get("/products/:category", getProductsByCategory);
router.get("/product/:id", getProductById);
router.get("/search", searchProducts);

module.exports = router;
