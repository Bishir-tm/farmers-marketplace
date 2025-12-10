import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../context/UIContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('buyer'); // Default role
    const [location, setLocation] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const { register } = useContext(AuthContext);
    const { showToast } = useUI();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(name, email, password, role, location, phoneNumber);
            showToast('Account created successfully! Welcome to FarmConnect.', 'success');
            navigate('/');
        } catch (err) {
            showToast(err.response?.data?.message || 'Registration failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 p-2 border rounded-lg focus:ring-green-500 focus:border-green-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 p-2 border rounded-lg focus:ring-green-500 focus:border-green-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full mt-1 p-2 border rounded-lg focus:ring-green-500 focus:border-green-500" placeholder="e.g., +234 800 000 0000" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 p-2 border rounded-lg focus:ring-green-500 focus:border-green-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">I am a...</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full mt-1 p-2 border rounded-lg focus:ring-green-500 focus:border-green-500">
                        <option value="buyer">Buyer</option>
                        <option value="farmer">Farmer</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full mt-1 p-2 border rounded-lg focus:ring-green-500 focus:border-green-500" placeholder="e.g., Lagos, Abuja" required />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50">
                    {loading ? 'Creating Account...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default Register;
