import { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { useNavigate } from 'react-router-dom';

const CreateProduct = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('Vegetables');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState('');
    
    const { user } = useContext(AuthContext);
    const { showToast } = useUI();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };

            await axios.post('http://localhost:5000/api/products', {
                title, description, price, category, location, image
            }, config);

            showToast('Product listed successfully!', 'success');
            navigate('/dashboard');
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to create product', 'error');
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">List New Produce</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Product Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 bg-gray-50 border-gray-200 rounded-2xl focus:ring-green-500 focus:border-green-500 transition" required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Price (₦)</label>
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-3 bg-gray-50 border-gray-200 rounded-2xl focus:ring-green-500 focus:border-green-500 transition" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Category</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 bg-gray-50 border-gray-200 rounded-2xl focus:ring-green-500 focus:border-green-500 transition">
                            <option>Vegetables</option>
                            <option>Fruits</option>
                            <option>Grains</option>
                            <option>Tubers</option>
                            <option>Livestock</option>
                            <option>Others</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Location</label>
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-3 bg-gray-50 border-gray-200 rounded-2xl focus:ring-green-500 focus:border-green-500 transition" required />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Image URL</label>
                    <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="w-full p-3 bg-gray-50 border-gray-200 rounded-2xl focus:ring-green-500 focus:border-green-500 transition" placeholder="https://..." />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 bg-gray-50 border-gray-200 rounded-2xl focus:ring-green-500 focus:border-green-500 transition h-32" required></textarea>
                </div>

                <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-full hover:bg-green-700 transition font-bold shadow-lg text-lg">
                    List Product
                </button>
            </form>
        </div>
    );
};

export default CreateProduct;
