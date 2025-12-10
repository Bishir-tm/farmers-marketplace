import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BottomNavigation from './components/BottomNavigation';
import GlobalLoader from './components/GlobalLoader';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FarmerDashboard from './pages/FarmerDashboard';
import CreateProduct from './pages/CreateProduct';
import EditProduct from './pages/EditProduct';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import FarmerOrders from './pages/FarmerOrders';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { UIProvider } from './context/UIContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <UIProvider>
          <div className="min-h-screen bg-gray-50 pt-8 text-gray-900 font-sans">
            <GlobalLoader />
            <Navbar />
            <BottomNavigation />
            <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart />} />
                
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
                
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <OrderHistory />
                  </ProtectedRoute>
                } />
                
                <Route path="/farmer/orders" element={
                  <ProtectedRoute role="farmer">
                    <FarmerOrders />
                  </ProtectedRoute>
                } />
                
                <Route path="/dashboard" element={
                  <ProtectedRoute role="farmer">
                    <FarmerDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/create-product" element={
                  <ProtectedRoute role="farmer">
                    <CreateProduct />
                  </ProtectedRoute>
                } />
                
                <Route path="/edit-product/:id" element={
                  <ProtectedRoute role="farmer">
                    <EditProduct />
                  </ProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </div>
          </UIProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
