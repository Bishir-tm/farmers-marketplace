import { useState, useEffect, useContext } from 'react';
import api from '../config/api';
import AuthContext from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaEdit, FaBox, FaShoppingCart, FaClock, FaCheckCircle, FaMoneyBillWave } from 'react-icons/fa';

const FarmerDashboard = () => {
    const [products, setProducts] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const { user } = useContext(AuthContext);
    const { showToast, showDialog } = useUI();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            // Fetch products
            const { data: productsData } = await api.get('/api/products/my');
            setProducts(productsData);
            
            // Fetch analytics
            try {
                const { data: analyticsData } = await api.get('/api/analytics/farmer');
                setAnalytics(analyticsData);
            } catch (error) {
                console.error('Failed to load analytics:', error);
            }
        };
        fetchData();
    }, [user]);

    const handleDelete = (id) => {
        showDialog({
            title: 'Delete Product',
            message: 'Are you sure you want to delete this product? This action cannot be undone.',
            onConfirm: async () => {
                try {
                    await api.delete(`/api/products/${id}`);
                    setProducts(products.filter(p => p._id !== id));
                    showToast('Product deleted successfully', 'success');
                } catch (error) {
                    showToast('Failed to delete product', 'error');
                }
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-green-50 p-4 md:p-6 rounded-3xl shadow-sm gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">My Dashboard</h2>
                    <p className="text-gray-600 text-sm md:text-base">Manage your farm listings and orders.</p>
                </div>
                <Link to="/create-product" className="bg-green-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-full hover:bg-green-700 transition flex items-center gap-2 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm md:text-base w-full sm:w-auto justify-center">
                    <FaPlus /> Add Produce
                </Link>
            </div>

            {/* Analytics Section */}
            {analytics && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-700 px-2">Analytics Overview</h3>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Total Products */}
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 md:p-6 rounded-2xl shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <FaBox className="text-2xl md:text-3xl opacity-80" />
                            </div>
                            <p className="text-2xl md:text-3xl font-bold">{analytics.totalProducts}</p>
                            <p className="text-xs md:text-sm opacity-90">Total Products</p>
                        </div>

                        {/* Total Orders */}
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 md:p-6 rounded-2xl shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <FaShoppingCart className="text-2xl md:text-3xl opacity-80" />
                            </div>
                            <p className="text-2xl md:text-3xl font-bold">{analytics.totalOrders}</p>
                            <p className="text-xs md:text-sm opacity-90">Total Orders</p>
                        </div>

                        {/* Pending Orders */}
                        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-4 md:p-6 rounded-2xl shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <FaClock className="text-2xl md:text-3xl opacity-80" />
                            </div>
                            <p className="text-2xl md:text-3xl font-bold">{analytics.pendingOrders}</p>
                            <p className="text-xs md:text-sm opacity-90">Pending Orders</p>
                        </div>

                        {/* Total Revenue */}
                        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 md:p-6 rounded-2xl shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <FaMoneyBillWave className="text-2xl md:text-3xl opacity-80" />
                            </div>
                            <p className="text-2xl md:text-3xl font-bold">₦{analytics.totalRevenue.toLocaleString()}</p>
                            <p className="text-xs md:text-sm opacity-90">Total Revenue</p>
                        </div>
                    </div>

                    {/* Top Products */}
                    {analytics.topProducts.length > 0 && (
                        <div className="bg-white p-4 md:p-6 rounded-3xl shadow-md">
                            <h4 className="text-lg font-bold text-gray-800 mb-4">Top Selling Products</h4>
                            <div className="space-y-3">
                                {analytics.topProducts.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="bg-green-100 text-green-700 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                                                {index + 1}
                                            </div>
                                            <img 
                                                src={item.product?.image || '/default-product.png'} 
                                                alt={item.product?.title} 
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-800 text-sm md:text-base">{item.product?.title}</p>
                                                <p className="text-xs text-gray-500">{item.quantity} sold</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-green-600">₦{item.revenue.toLocaleString()}</p>
                                            <p className="text-xs text-gray-500">Revenue</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <h3 className="text-xl font-bold text-gray-700 px-2">Your Listings</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {products.map(product => (
                    <div key={product._id} className="bg-white p-4 md:p-6 rounded-3xl shadow-md border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center transition hover:shadow-lg gap-4">
                        <div className="flex gap-4 items-center w-full sm:w-auto">
                            <img src={product.image || '/default-product.png'} alt={product.title} className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover shadow-sm" />
                            <div className="flex-1">
                                <h4 className="text-base md:text-lg font-bold text-gray-800">{product.title}</h4>
                                <p className="text-green-600 font-semibold">₦{product.price}</p>
                                <span className="text-xs text-gray-400">{new Date(product.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto justify-end">
                            <button 
                                onClick={() => navigate(`/edit-product/${product._id}`)}
                                className="text-blue-500 hover:text-blue-700 p-3 rounded-full hover:bg-blue-50 transition" 
                                title="Edit"
                            >
                                <FaEdit />
                            </button>
                            <button 
                                onClick={() => handleDelete(product._id)} 
                                className="text-red-500 hover:text-red-700 p-3 rounded-full hover:bg-red-50 transition" 
                                title="Delete"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
                {products.length === 0 && (
                    <div className="col-span-2 text-center py-10 text-gray-500 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                        You haven't listed any products yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default FarmerDashboard;
