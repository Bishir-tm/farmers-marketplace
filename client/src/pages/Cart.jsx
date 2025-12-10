import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import QuantitySelector from '../components/QuantitySelector';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="max-w-4xl mx-auto text-center py-16">
                <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
                    <FaShoppingCart className="text-6xl md:text-8xl text-gray-300 mx-auto mb-6" />
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-600 mb-8">Add some fresh produce to get started!</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-green-600 text-white px-6 md:px-8 py-3 rounded-full hover:bg-green-700 transition font-semibold"
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Shopping Cart</h2>
                <button 
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700 font-medium text-sm md:text-base"
                >
                    Clear Cart
                </button>
            </div>

            {/* Cart Items */}
            <div className="space-y-4">
                {cartItems.map(item => (
                    <div key={item._id} className="bg-white rounded-2xl md:rounded-3xl shadow-md p-4 md:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        {/* Product Image & Info */}
                        <div className="flex gap-4 items-center flex-1 w-full sm:w-auto">
                            <img 
                                src={item.image || '/default-product.png'} 
                                alt={item.title} 
                                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover shadow-sm"
                            />
                            <div className="flex-1">
                                <h3 className="text-base md:text-lg font-bold text-gray-800">{item.title}</h3>
                                <p className="text-green-600 font-semibold text-lg">₦{item.price}</p>
                                <span className="text-xs text-gray-500">{item.category}</span>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                            <QuantitySelector 
                                value={item.quantity}
                                onChange={(qty) => updateQuantity(item._id, qty)}
                                size="sm"
                            />
                            
                            {/* Subtotal */}
                            <div className="text-right sm:w-24">
                                <p className="text-xs text-gray-500">Subtotal</p>
                                <p className="text-lg font-bold text-gray-800">₦{item.price * item.quantity}</p>
                            </div>

                            {/* Remove Button */}
                            <button 
                                onClick={() => removeFromCart(item._id)}
                                className="text-red-500 hover:text-red-700 p-3 rounded-full hover:bg-red-50 transition"
                                title="Remove"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Total & Checkout - Sticky on mobile */}
            <div className="sticky bottom-0 left-0 right-0 bg-white rounded-t-3xl md:rounded-3xl shadow-lg p-4 md:p-6 border-t-4 border-green-600">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-lg md:text-xl font-bold text-gray-800">Total:</span>
                    <span className="text-2xl md:text-3xl font-bold text-green-600">₦{getCartTotal()}</span>
                </div>
                <button 
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-green-600 text-white py-3 md:py-4 rounded-full hover:bg-green-700 transition font-bold text-base md:text-lg shadow-lg active:scale-95 transform duration-100"
                >
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
};

export default Cart;
