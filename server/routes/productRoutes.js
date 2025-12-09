const express = require('express');
const { getProducts, getMyProducts, createProduct, updateProduct, deleteProduct, getProductById } = require('../controllers/productController');
const { protect, farmer } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getProducts);
router.get('/my', protect, farmer, getMyProducts);
router.post('/', protect, farmer, createProduct);
router.put('/:id', protect, farmer, updateProduct);
router.delete('/:id', protect, farmer, deleteProduct);
router.get('/:id', getProductById);

module.exports = router;
