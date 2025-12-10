const express = require('express');
const { getFarmerAnalytics } = require('../controllers/analyticsController');
const { protect, farmer } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/farmer', protect, farmer, getFarmerAnalytics);

module.exports = router;
