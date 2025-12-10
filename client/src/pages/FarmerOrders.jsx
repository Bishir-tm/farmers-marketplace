import { useState, useEffect, useContext } from 'react';
import api from '../config/api';
import AuthContext from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { FaBox, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FarmerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [filter, setFilter] = useState('all');
    const { user } = useContext(AuthContext);
    const { showToast } = useUI();

    useEffect(() => {
        fetchOrders();
    }, [filter]);

    const fetchOrders = async () => {
        try {
            const url = filter === 'all' 
                ? '/api/orders/farmer'
                : `/api/orders/farmer?status=${filter}`;
            const { data } = await api.get(url);
            setOrders(data);
        } catch (error) {
            showToast('Failed to load orders', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await api.put(`/api/orders/${orderId}/status`, { status: newStatus });
            showToast('Order status updated successfully', 'success');
            fetchOrders();
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to update status', 'error');
        }
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

    const getNextStatus = (currentStatus) => {
        const statusFlow = {
            pending: 'processing',
            processing: 'shipped',
            shipped: 'delivered',
            delivered: 'completed'
        };
        return statusFlow[currentStatus];
    };

    const getStatusLabel = (status) => {
        const labels = {
            processing: 'Mark as Processing',
            shipped: 'Mark as Shipped',
            delivered: 'Mark as Delivered',
            completed: 'Mark as Completed'
        };
        return labels[status] || 'Update Status';
    };

    if (loading) {
        return <div className="text-center py-10">Loading orders...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Incoming Orders</h2>
                    <p className="text-sm text-gray-600 mt-1">Manage orders for your products</p>
                </div>
                
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
                </select>
            </div>

            {/* Orders List */}
            {orders.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 text-center">
                    <FaBox className="text-6xl md:text-8xl text-gray-300 mx-auto mb-6" />
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">No Orders Found</h3>
                    <p className="text-gray-600">
                        {filter === 'all' ? 'No orders for your products yet.' : `No ${filter} orders.`}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
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
                                            Customer: <span className="font-semibold">{order.buyer?.name}</span>
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
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

                                    {/* Customer Contact */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2">Customer Email:</h4>
                                            <p className="text-sm text-gray-600">{order.buyer?.email}</p>
                                        </div>
                                        {order.buyer?.phoneNumber && (
                                            <div>
                                                <h4 className="font-semibold text-gray-700 mb-2">Phone:</h4>
                                                <p className="text-sm text-gray-600">{order.buyer.phoneNumber}</p>
                                            </div>
                                        )}
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
                                            <h4 className="font-semibold text-gray-700 mb-2">Contact Phone:</h4>
                                            <p className="text-sm text-gray-600">{order.contactPhone}</p>
                                        </div>
                                    )}

                                    {/* Notes */}
                                    {order.notes && (
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2">Customer Notes:</h4>
                                            <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">{order.notes}</p>
                                        </div>
                                    )}

                                    {/* Status Update */}
                                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <button 
                                                onClick={() => handleStatusUpdate(order._id, getNextStatus(order.status))}
                                                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition font-medium text-sm"
                                            >
                                                {getStatusLabel(getNextStatus(order.status))}
                                            </button>
                                            {order.status === 'pending' && (
                                                <button 
                                                    onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                                                    className="flex-1 bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition font-medium text-sm"
                                                >
                                                    Cancel Order
                                                </button>
                                            )}
                                        </div>
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

export default FarmerOrders;
