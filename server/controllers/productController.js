const Product = require('../models/Product');

const getProducts = async (req, res) => {
    try {
        const keyword = req.query.keyword ? {
            title: { $regex: req.query.keyword, $options: 'i' }
        } : {};

        const products = await Product.find({ ...keyword }).populate('farmer', 'name email');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({ farmer: req.user.id });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProduct = async (req, res) => {
    const { title, description, price, category, location, image } = req.body;

    try {
        console.log('Creating product:', { title, farmer: req.user.id, timestamp: new Date().toISOString() });
        
        // Check for recent duplicate (same title from same farmer within last 5 seconds)
        const recentDuplicate = await Product.findOne({
            farmer: req.user.id,
            title: title,
            createdAt: { $gte: new Date(Date.now() - 5000) } // Within last 5 seconds
        });
        
        if (recentDuplicate) {
            console.log('Duplicate product detected, returning existing:', recentDuplicate._id);
            return res.status(201).json(recentDuplicate);
        }
        
        const product = new Product({
            farmer: req.user.id,
            title, description, price, category, location, image
        });
        const createdProduct = await product.save();
        console.log('Product created successfully:', createdProduct._id);
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    const { title, description, price, category, location, image } = req.body;

    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            if (product.farmer.toString() !== req.user.id) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            product.title = title || product.title;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            product.location = location || product.location;
            product.image = image || product.image;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            if (product.farmer.toString() !== req.user.id) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('farmer', 'name email');
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getProducts, getMyProducts, createProduct, updateProduct, deleteProduct, getProductById };
