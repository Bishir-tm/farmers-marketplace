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
                <div className="flex items-center gap-2 md:gap-4">
                    {location.pathname !== '/' && (
                        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-green-600 p-2 rounded-full hover:bg-gray-100 transition">
                            <FaArrowLeft />
                        </button>
                    )}
                    <Link to="/" className="text-xl md:text-2xl font-bold text-green-600 flex items-center gap-2">
                        <FaLeaf /> <span className="hidden sm:inline">FarmConnect NG</span><span className="sm:hidden">Farm</span>
                    </Link>
                </div>
                <div className="flex gap-2 md:gap-6 items-center">
                    <Link to="/" className="text-gray-600 hover:text-green-600 font-medium text-sm md:text-base hidden sm:inline">Marketplace</Link>
                    {user ? (
                        <>
                            {user.role === 'farmer' && (
                                <Link to="/dashboard" className="text-gray-600 hover:text-green-600 font-medium text-sm md:text-base hidden md:inline">My Dashboard</Link>
                            )}
                            <span className="text-gray-500 hidden lg:inline text-sm">Hi, {user.name}</span>
                            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-3 md:px-5 py-2 rounded-full transition font-medium text-sm md:text-base">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-600 hover:text-green-600 font-medium text-sm md:text-base">Login</Link>
                            <Link to="/register" className="bg-green-600 hover:bg-green-700 text-white px-3 md:px-6 py-2 rounded-full transition font-medium shadow-md text-sm md:text-base">Get Started</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
