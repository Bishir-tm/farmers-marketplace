import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
    FaHome, 
    FaShoppingCart, 
    FaUser, 
    FaLeaf, 
    FaClipboardList, 
    FaSignInAlt,
    FaTachometerAlt
} from 'react-icons/fa';

const BottomNavigation = () => {
    const { user } = useContext(AuthContext);
    const { getCartCount } = useCart();

    const linkBaseClass = "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors duration-200";
    const activeClass = "text-green-600";
    const inactiveClass = "text-gray-500 hover:text-green-600";

    const getLinkClass = ({ isActive }) => 
        `${linkBaseClass} ${isActive ? activeClass : inactiveClass}`;

    return (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex justify-around items-center z-50 md:hidden pb-safe">
            {/* Common for Everyone */}
            <NavLink to="/" className={getLinkClass}>
                <FaHome className="text-xl mb-1" />
                <span>Home</span>
            </NavLink>

            {user ? (
                <>
                    {/* Farmer Specific */}
                    {user.role === 'farmer' && (
                        <>
                            <NavLink to="/dashboard" className={getLinkClass}>
                                <FaTachometerAlt className="text-xl mb-1" />
                                <span>Dashboard</span>
                            </NavLink>
                            <NavLink to="/farmer/orders" className={getLinkClass}>
                                <FaClipboardList className="text-xl mb-1" />
                                <span>Orders</span>
                            </NavLink>
                        </>
                    )}

                    {/* Customer Specific */}
                    {user.role !== 'farmer' && (
                        <>
                            <NavLink to="/orders" className={getLinkClass}>
                                <FaClipboardList className="text-xl mb-1" />
                                <span>Orders</span>
                            </NavLink>
                            <NavLink to="/cart" className={`relative ${linkBaseClass} text-gray-500 hover:text-green-600`}>
                                {({ isActive }) => (
                                    <>
                                        <div className="relative">
                                            <FaShoppingCart className={`text-xl mb-1 ${isActive ? 'text-green-600' : ''}`} />
                                            {getCartCount() > 0 && (
                                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                                    {getCartCount()}
                                                </span>
                                            )}
                                        </div>
                                        <span className={isActive ? 'text-green-600' : ''}>Cart</span>
                                    </>
                                )}
                            </NavLink>
                        </>
                    )}

                     {/* Profile (Common for Auth users) */}
                    <NavLink to="/profile" className={getLinkClass}>
                        <FaUser className="text-xl mb-1" />
                        <span>Profile</span>
                    </NavLink>
                </>
            ) : (
                /* Guest */
                <NavLink to="/login" className={getLinkClass}>
                    <FaSignInAlt className="text-xl mb-1" />
                    <span>Login</span>
                </NavLink>
            )}
        </div>
    );
};

export default BottomNavigation;
