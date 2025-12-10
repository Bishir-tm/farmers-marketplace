const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: { type: String, unique: true, required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'], 
        default: 'pending' 
    },
    deliveryAddress: { type: String },
    contactPhone: { type: String },
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
