const express = require('express');
const { addOrderItems, getMyOrders, getFarmerOrders } = require('../controllers/orderController');
const { protect, farmer } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, addOrderItems);
router.get('/my', protect, getMyOrders);
router.get('/farmer', protect, farmer, getFarmerOrders);

module.exports = router;
