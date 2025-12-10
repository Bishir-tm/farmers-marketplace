import { useState, useEffect, useContext } from 'react';
import api from '../config/api';
import AuthContext from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import QuantitySelector from '../components/QuantitySelector';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [quantities, setQuantities] = useState({});
    const { user } = useContext(AuthContext);
    const { addToCart } = useCart();
    const { showToast } = useUI();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get(`/api/products?keyword=${keyword}`);
                // Ensure data is an array
                const productsArray = Array.isArray(data) ? data : [];
                setProducts(productsArray);
                // Initialize quantities for all products
                const initialQuantities = {};
                productsArray.forEach(product => {
                    initialQuantities[product._id] = 1;
                });
                setQuantities(initialQuantities);
            } catch (error) {
                console.error('Failed to fetch products:', error);
                showToast('Failed to load products. Please check your connection.', 'error');
                setProducts([]);
            }
        };
        fetchProducts();
    }, [keyword]);

    const handleAddToCart = (product) => {
        if (!user) {
            showToast('Please login to add items to cart', 'info');
            return;
        }
        if (user.role === 'farmer') {
            showToast('Farmers cannot add items to cart', 'error');
            return;
        }

        const quantity = quantities[product._id] || 1;
        addToCart(product, quantity);
        showToast(`Added ${quantity} ${product.title} to cart!`, 'success');
        // Reset quantity to 1
        setQuantities(prev => ({ ...prev, [product._id]: 1 }));
    };

    const updateQuantity = (productId, newQuantity) => {
        setQuantities(prev => ({ ...prev, [productId]: newQuantity }));
    };

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-green-600 text-white p-6 md:p-10 rounded-3xl shadow-xl text-center space-y-4">
                <h1 className="text-2xl md:text-4xl font-bold">Fresh Farm Produce, Direct to You</h1>
                <p className="text-base md:text-xl opacity-90">Skip the middleman. Buy fresh.</p>
                <div className="max-w-xl mx-auto px-4 sm:px-0">
                    <div className="flex items-center bg-white rounded-full p-2 shadow-inner gap-2">
                        <div className="flex items-center flex-1 px-2">
                            <input 
                                type="text" 
                                placeholder="Search for yams, rice, tomatoes..." 
                                className="flex-1 p-2 outline-none text-gray-700 bg-transparent text-sm md:text-base"
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>
                        <button className="bg-green-700 text-white px-4 md:px-6 py-2 rounded-full hover:bg-green-800 transition font-medium whitespace-nowrap text-sm md:text-base flex-shrink-0">
                            <FaSearch className="text-gray-400 mr-2" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map(product => (
                    <div key={product._id} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                        <img src={product.image || '/default-product.png'} alt={product.title} className="w-full h-56 object-cover" />
                        <div className="p-4 md:p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                                <div>
                                    <h3 className="text-lg md:text-xl font-bold text-gray-800">{product.title}</h3>
                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide">{product.category}</span>
                                </div>
                                <span className="text-lg font-bold text-green-600">₦{product.price}</span>
                            </div>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-500 mb-6 gap-1">
                                <span>📍 {product.location}</span>
                                <span>👨‍🌾 {product.farmer?.name}</span>
                            </div>
                            <div className="mb-4">
                                <QuantitySelector 
                                    value={quantities[product._id] || 1}
                                    onChange={(qty) => updateQuantity(product._id, qty)}
                                    size="sm"
                                />
                            </div>
                            <button 
                                onClick={() => handleAddToCart(product)}
                                className="w-full bg-green-600 text-white py-3 rounded-full hover:bg-green-700 transition flex items-center justify-center gap-2 font-semibold shadow-md active:scale-95 transform duration-100"
                            >
                                <FaShoppingCart /> Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {products.length === 0 && (
                <div className="text-center text-gray-500 py-10">
                    <p>No products found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default Home;
