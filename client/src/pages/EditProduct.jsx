import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { useNavigate, useParams } from 'react-router-dom';

const EditProduct = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('Vegetables');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(true);
    
    const { user } = useContext(AuthContext);
    const { showToast } = useUI();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
            setTitle(data.title);
            setDescription(data.description);
            setPrice(data.price);
            setCategory(data.category);
            setLocation(data.location);
            setImage(data.image || '');
        } catch (error) {
            showToast('Failed to load product', 'error');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };

            await axios.put(`http://localhost:5000/api/products/${id}`, {
                title, description, price, category, location, image
            }, config);

            showToast('Product updated successfully!', 'success');
            navigate('/dashboard');
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to update product', 'error');
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading product...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Product</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Product Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 bg-gray-50 border-gray-200 rounded-2xl focus:ring-green-500 focus:border-green-500 transition" required />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Product Image</label>
                    <div className="relative">
                        {image ? (
                            <div className="relative h-64 w-full rounded-2xl overflow-hidden group shadow-md border border-gray-200">
                                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                <button 
                                    type="button"
                                    onClick={() => setImage('')}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition transform hover:scale-110"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-green-500 transition-all duration-300 group">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <div className="bg-green-100 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    </div>
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-bold text-green-600">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
                                </div>
                                <input 
                                    type='file' 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            if (file.size > 5000000) {
                                                showToast('File is too large (Max 5MB)', 'error');
                                                return;
                                            }
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setImage(reader.result);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </label>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 bg-gray-50 border-gray-200 rounded-2xl focus:ring-green-500 focus:border-green-500 transition h-32" required></textarea>
                </div>

                <div className="flex gap-4">
                    <button 
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="flex-1 bg-gray-500 text-white py-3 rounded-full hover:bg-gray-600 transition font-bold shadow-lg text-lg"
                    >
                        Cancel
                    </button>
                    <button type="submit" className="flex-1 bg-green-600 text-white py-3 rounded-full hover:bg-green-700 transition font-bold shadow-lg text-lg">
                        Update Product
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;
