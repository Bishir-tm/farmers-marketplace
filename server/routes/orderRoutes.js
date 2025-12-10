const express = require('express');
const { 
    addOrderItems, 
    getMyOrders, 
    getFarmerOrders, 
    getOrderById, 
    updateOrderStatus, 
    cancelOrder 
} = require('../controllers/orderController');
const { protect, farmer } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, addOrderItems);
router.get('/my', protect, getMyOrders);
router.get('/farmer', protect, farmer, getFarmerOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, farmer, updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;
