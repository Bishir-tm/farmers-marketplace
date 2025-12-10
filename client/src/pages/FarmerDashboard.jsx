import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { Link } from 'react-router-dom';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

const FarmerDashboard = () => {
    const [products, setProducts] = useState([]);
    const { user } = useContext(AuthContext);
    const { showToast, showDialog } = useUI();

    useEffect(() => {
        const fetchMyProducts = async () => {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.get('http://localhost:5000/api/products/myproducts', config);
            setProducts(data);
        };
        fetchMyProducts();
    }, [user]);

    const handleDelete = (id) => {
        showDialog({
            title: 'Delete Product',
            message: 'Are you sure you want to delete this product? This action cannot be undone.',
            onConfirm: async () => {
                try {
                    const config = {
                        headers: { Authorization: `Bearer ${user.token}` }
                    };
                    await axios.delete(`http://localhost:5000/api/products/${id}`, config);
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-green-50 p-4 md:p-6 rounded-3xl shadow-sm gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">My Dashboard</h2>
                    <p className="text-gray-600 text-sm md:text-base">Manage your farm listings and orders.</p>
                </div>
                <Link to="/create-product" className="bg-green-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-full hover:bg-green-700 transition flex items-center gap-2 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm md:text-base w-full sm:w-auto justify-center">
                    <FaPlus /> Add Produce
                </Link>
            </div>

            <h3 className="text-xl font-bold text-gray-700 px-2">Your Listings</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {products.map(product => (
                    <div key={product._id} className="bg-white p-4 md:p-6 rounded-3xl shadow-md border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center transition hover:shadow-lg gap-4">
                        <div className="flex gap-4 items-center w-full sm:w-auto">
                            <img src={product.image || 'https://placehold.co/100'} alt={product.title} className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover shadow-sm" />
                            <div className="flex-1">
                                <h4 className="text-base md:text-lg font-bold text-gray-800">{product.title}</h4>
                                <p className="text-green-600 font-semibold">₦{product.price}</p>
                                <span className="text-xs text-gray-400">{new Date(product.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto justify-end">
                           {/* Edit placeholder - future feature */}
                            <button className="text-blue-500 hover:text-blue-700 p-3 rounded-full hover:bg-blue-50 transition" title="Edit">
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
