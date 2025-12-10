import { useState, useContext } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import axios from 'axios';

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { user } = useContext(AuthContext);
    const { showToast } = useUI();
    const navigate = useNavigate();

    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [contactPhone, setContactPhone] = useState(user?.phoneNumber || '');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                orderItems: cartItems.map(item => ({
                    product: item._id,
                    qty: item.quantity
                })),
                totalAmount: getCartTotal(),
                deliveryAddress,
                contactPhone,
                notes
            };

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            await axios.post('http://localhost:5000/api/orders', orderData, config);
            
            clearCart();
            showToast('Order placed successfully!', 'success');
            navigate('/orders');
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to place order', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Checkout</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Checkout Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-lg p-6 md:p-8 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address *</label>
                            <textarea
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-2xl focus:ring-green-500 focus:border-green-500 resize-none"
                                rows="3"
                                placeholder="Enter your full delivery address"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone *</label>
                            <input
                                type="tel"
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-2xl focus:ring-green-500 focus:border-green-500"
                                placeholder="e.g., +234 800 000 0000"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Order Notes (Optional)</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-2xl focus:ring-green-500 focus:border-green-500 resize-none"
                                rows="2"
                                placeholder="Any special instructions?"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-3 md:py-4 rounded-full hover:bg-green-700 transition font-bold text-base md:text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-24">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h3>
                        
                        <div className="space-y-3 mb-6">
                            {cartItems.map(item => (
                                <div key={item._id} className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        {item.title} × {item.quantity}
                                    </span>
                                    <span className="font-semibold">₦{item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-800">Total</span>
                                <span className="text-2xl font-bold text-green-600">₦{getCartTotal()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
