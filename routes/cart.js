const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCart, removeFromCart } = require('../controllers/cartController');
const { auth } = require('../middleware/auth');

router.get('/', auth, getCart);
router.post('/add', auth, addToCart);
router.post('/update', auth, updateCart);
router.delete('/remove', auth, removeFromCart);

module.exports = router;
