const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  addProduct, updateProduct, deleteProduct, getAllProductsAdmin,
  getAllOrders, updateOrderStatus,
  getDashboardStats,
  addCategory, getAllCategoriesAdmin,
} = require('../controllers/adminController');

// Dashboard
router.get('/dashboard/stats', adminAuth, getDashboardStats);

// Categories
router.get('/categories', adminAuth, getAllCategoriesAdmin);
router.post('/category/add', adminAuth, addCategory);

// Products
router.get('/products', adminAuth, getAllProductsAdmin);
router.post('/product/add', adminAuth, upload.array('images', 5), addProduct);
router.put('/product/update/:id', adminAuth, upload.array('images', 5), updateProduct);
router.delete('/product/delete/:id', adminAuth, deleteProduct);

// Orders
router.get('/orders', adminAuth, getAllOrders);
router.put('/order/status/:id', adminAuth, updateOrderStatus);

module.exports = router;
