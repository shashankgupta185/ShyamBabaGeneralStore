const express = require('express');
const router = express.Router();
const { createOrder, getOrderHistory, getOrderById } = require('../controllers/orderController');
const { auth } = require('../middleware/auth');

router.post('/create', auth, createOrder);
router.get('/history', auth, getOrderHistory);
router.get('/:id', auth, getOrderById);

module.exports = router;
