const Order = require('../models/Order');
const Product = require('../models/Product');

const getFarmerAnalytics = async (req, res) => {
    try {
        // Get farmer's products
        const products = await Product.find({ farmer: req.user.id });
        const productIds = products.map(p => p._id);
        
        // Get all orders containing farmer's products
        const orders = await Order.find({
            'products.product': { $in: productIds }
        }).populate('products.product');
        
        // Calculate analytics
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        const processingOrders = orders.filter(o => o.status === 'processing').length;
        const completedOrders = orders.filter(o => o.status === 'completed').length;
        
        // Calculate revenue (only from completed orders)
        let totalRevenue = 0;
        orders.forEach(order => {
            if (order.status === 'completed') {
                order.products.forEach(item => {
                    if (productIds.some(id => id.equals(item.product._id))) {
                        totalRevenue += item.product.price * item.quantity;
                    }
                });
            }
        });
        
        // Top selling products
        const productSales = {};
        orders.forEach(order => {
            order.products.forEach(item => {
                if (productIds.some(id => id.equals(item.product._id))) {
                    const productId = item.product._id.toString();
                    if (!productSales[productId]) {
                        productSales[productId] = {
                            product: item.product,
                            quantity: 0,
                            revenue: 0
                        };
                    }
                    productSales[productId].quantity += item.quantity;
                    if (order.status === 'completed') {
                        productSales[productId].revenue += item.product.price * item.quantity;
                    }
                }
            });
        });
        
        const topProducts = Object.values(productSales)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);
        
        res.json({
            totalProducts: products.length,
            totalOrders,
            pendingOrders,
            processingOrders,
            completedOrders,
            totalRevenue,
            topProducts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getFarmerAnalytics };
