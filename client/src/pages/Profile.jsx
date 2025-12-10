import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import axios from 'axios';

const Profile = () => {
    const { user, setUser } = useContext(AuthContext);
    const { showToast } = useUI();
    
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
    const [location, setLocation] = useState(user?.location || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };

            const { data } = await axios.put(
                'http://localhost:5000/api/auth/profile',
                { name, email, phoneNumber, location },
                config
            );

            // Update user in context and localStorage
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            
            showToast('Profile updated successfully!', 'success');
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to update profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">My Profile</h2>
                
                {/* User Role Badge */}
                <div className="flex justify-center mb-6">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase ${
                        user?.role === 'farmer' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                    }`}>
                        {user?.role}
                    </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-2xl focus:ring-green-500 focus:border-green-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-2xl focus:ring-green-500 focus:border-green-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-2xl focus:ring-green-500 focus:border-green-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-2xl focus:ring-green-500 focus:border-green-500"
                            placeholder="e.g., Lagos, Nigeria"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-3 md:py-4 rounded-full hover:bg-green-700 transition font-bold text-base md:text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
