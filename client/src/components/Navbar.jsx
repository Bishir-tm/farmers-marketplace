import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaLeaf, FaArrowLeft } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md p-4 sticky top-0 z-40">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-4">
                    {location.pathname !== '/' && (
                        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-green-600 p-2 rounded-full hover:bg-gray-100 transition">
                            <FaArrowLeft />
                        </button>
                    )}
                    <Link to="/" className="text-2xl font-bold text-green-600 flex items-center gap-2">
                        <FaLeaf /> FarmConnect NG
                    </Link>
                </div>
                <div className="flex gap-6 items-center">
                    <Link to="/" className="text-gray-600 hover:text-green-600 font-medium">Marketplace</Link>
                    {user ? (
                        <>
                            {user.role === 'farmer' && (
                                <Link to="/dashboard" className="text-gray-600 hover:text-green-600 font-medium">My Dashboard</Link>
                            )}
                            <span className="text-gray-500 hidden md:inline">Hi, {user.name}</span>
                            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full transition font-medium">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-600 hover:text-green-600 font-medium">Login</Link>
                            <Link to="/register" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition font-medium shadow-md">Get Started</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
