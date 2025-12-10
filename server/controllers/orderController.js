const Order = require('../models/Order');
const Product = require('../models/Product');

// Generate unique order number
const generateOrderNumber = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `ORD-${timestamp}-${random}`.toUpperCase();
};

const addOrderItems = async (req, res) => {
    const { orderItems, totalAmount, deliveryAddress, contactPhone, notes } = req.body;

    if (orderItems && orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    } else {
        const order = new Order({
            orderNumber: generateOrderNumber(),
            buyer: req.user.id,
            products: orderItems.map(item => ({
                product: item.product,
                quantity: item.qty
            })),
            totalAmount,
            deliveryAddress,
            contactPhone,
            notes
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user.id })
            .populate('products.product')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFarmerOrders = async (req, res) => {
    try {
        const { status } = req.query;
        const myProducts = await Product.find({ farmer: req.user.id }).select('_id');
        const myProductIds = myProducts.map(p => p._id);

        let query = {
            'products.product': { $in: myProductIds }
        };

        if (status && status !== 'all') {
            query.status = status;
        }

        const orders = await Order.find(query)
            .populate('buyer', 'name email phoneNumber')
            .populate('products.product')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('buyer', 'name email phoneNumber')
            .populate('products.product');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is buyer or farmer of products in order
        const isBuyer = order.buyer._id.toString() === req.user.id;
        const myProducts = await Product.find({ farmer: req.user.id }).select('_id');
        const myProductIds = myProducts.map(p => p._id.toString());
        const isFarmer = order.products.some(item => 
            myProductIds.includes(item.product._id.toString())
        );

        if (!isBuyer && !isFarmer) {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id).populate('products.product');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify farmer owns at least one product in the order
        const myProducts = await Product.find({ farmer: req.user.id }).select('_id');
        const myProductIds = myProducts.map(p => p._id.toString());
        const ownsProduct = order.products.some(item => 
            myProductIds.includes(item.product._id.toString())
        );

        if (!ownsProduct) {
            return res.status(403).json({ message: 'Not authorized to update this order' });
        }

        // Validate status transition
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        order.status = status;
        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Only buyer can cancel
        if (order.buyer.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to cancel this order' });
        }

        // Can only cancel pending orders
        if (order.status !== 'pending') {
            return res.status(400).json({ message: 'Can only cancel pending orders' });
        }

        order.status = 'cancelled';
        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    addOrderItems, 
    getMyOrders, 
    getFarmerOrders, 
    getOrderById, 
    updateOrderStatus, 
    cancelOrder 
};
