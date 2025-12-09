import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FarmerDashboard from './pages/FarmerDashboard';
import CreateProduct from './pages/CreateProduct';
import ProtectedRoute from './components/ProtectedRoute';
import { UIProvider } from './context/UIContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <UIProvider>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
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
            </Routes>
          </div>
        </div>
        </UIProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
