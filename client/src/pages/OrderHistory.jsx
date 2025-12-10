import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { FaBox, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [filter, setFilter] = useState('all');
    const { user } = useContext(AuthContext);
    const { showToast, showDialog } = useUI();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.get('http://localhost:5000/api/orders/my', config);
            setOrders(data);
        } catch (error) {
            showToast('Failed to load orders', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = (orderId) => {
        showDialog({
            title: 'Cancel Order',
            message: 'Are you sure you want to cancel this order?',
            onConfirm: async () => {
                try {
                    const config = {
                        headers: { Authorization: `Bearer ${user.token}` }
                    };
                    await axios.put(`http://localhost:5000/api/orders/${orderId}/cancel`, {}, config);
                    showToast('Order cancelled successfully', 'success');
                    fetchOrders();
                } catch (error) {
                    showToast(error.response?.data?.message || 'Failed to cancel order', 'error');
                }
            }
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-700',
            processing: 'bg-blue-100 text-blue-700',
            shipped: 'bg-purple-100 text-purple-700',
            delivered: 'bg-teal-100 text-teal-700',
            completed: 'bg-green-100 text-green-700',
            cancelled: 'bg-red-100 text-red-700'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    const filteredOrders = filter === 'all' 
        ? orders 
        : orders.filter(order => order.status === filter);

    if (loading) {
        return <div className="text-center py-10">Loading orders...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">My Orders</h2>
                
                {/* Filter */}
                <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-sm"
                >
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 text-center">
                    <FaBox className="text-6xl md:text-8xl text-gray-300 mx-auto mb-6" />
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">No Orders Found</h3>
                    <p className="text-gray-600">
                        {filter === 'all' ? 'You haven\'t placed any orders yet.' : `No ${filter} orders.`}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map(order => (
                        <div key={order._id} className="bg-white rounded-2xl md:rounded-3xl shadow-md overflow-hidden">
                            {/* Order Header */}
                            <div 
                                className="p-4 md:p-6 cursor-pointer hover:bg-gray-50 transition"
                                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                            <h3 className="font-bold text-gray-800 text-sm md:text-base">{order.orderNumber}</h3>
                                            <span className={`${getStatusColor(order.status)} px-3 py-1 rounded-full text-xs font-bold uppercase w-fit`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {order.products.length} item{order.products.length > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg md:text-xl font-bold text-green-600">₦{order.totalAmount}</p>
                                        {expandedOrder === order._id ? <FaChevronUp className="mt-2 text-gray-400" /> : <FaChevronDown className="mt-2 text-gray-400" />}
                                    </div>
                                </div>
                            </div>

                            {/* Order Details (Expandable) */}
                            {expandedOrder === order._id && (
                                <div className="border-t p-4 md:p-6 bg-gray-50 space-y-4">
                                    {/* Products */}
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-3">Items:</h4>
                                        <div className="space-y-2">
                                            {order.products.map((item, index) => (
                                                <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg">
                                                    <div className="flex gap-3 items-center flex-1">
                                                        <img 
                                                            src={item.product?.image || '/default-product.png'} 
                                                            alt={item.product?.title} 
                                                            className="w-12 h-12 rounded-lg object-cover"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-sm">{item.product?.title}</p>
                                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                    <p className="font-semibold">₦{item.product?.price * item.quantity}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Delivery Info */}
                                    {order.deliveryAddress && (
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2">Delivery Address:</h4>
                                            <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                                        </div>
                                    )}

                                    {/* Contact */}
                                    {order.contactPhone && (
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2">Contact:</h4>
                                            <p className="text-sm text-gray-600">{order.contactPhone}</p>
                                        </div>
                                    )}

                                    {/* Notes */}
                                    {order.notes && (
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2">Notes:</h4>
                                            <p className="text-sm text-gray-600">{order.notes}</p>
                                        </div>
                                    )}

                                    {/* Cancel Button */}
                                    {order.status === 'pending' && (
                                        <button 
                                            onClick={() => handleCancelOrder(order._id)}
                                            className="w-full sm:w-auto bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition font-medium text-sm"
                                        >
                                            Cancel Order
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
