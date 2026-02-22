const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateAddress } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.put('/address', auth, updateAddress);

module.exports = router;
