const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
