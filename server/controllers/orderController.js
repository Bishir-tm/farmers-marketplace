const Order = require('../models/Order');
const Product = require('../models/Product');

const addOrderItems = async (req, res) => {
    const { orderItems, totalAmount } = req.body;

    if (orderItems && orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    } else {
        const order = new Order({
            buyer: req.user.id,
            products: orderItems.map(item => ({
                product: item.product,
                quantity: item.qty
            })),
            totalAmount
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user.id }).populate('products.product');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFarmerOrders = async (req, res) => {
    try {
        const myProducts = await Product.find({ farmer: req.user.id }).select('_id');
        const myProductIds = myProducts.map(p => p._id);

        const orders = await Order.find({
            'products.product': { $in: myProductIds }
        }).populate('buyer', 'name email').populate('products.product');

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { addOrderItems, getMyOrders, getFarmerOrders };
