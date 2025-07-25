import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';  // <-- import CartProvider
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Box } from '@mui/material';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import WatchDetailsPage from './pages/WatchDetailsPage';
import Collections from './pages/Collections';
import Cart from './pages/Cart';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import Watches from './pages/admin/WatchesPage';
import AddWatch from './pages/admin/AddWatch';
import EditWatch from './pages/admin/EditWatch';
import MyOrders from './pages/MyOrders';
import PaymentSuccess from './pages/PaymentSuccess';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <CartProvider> {/* Wrap inside AuthProvider or outside, but must be above Navbar & pages that use cart */}
        {/* Show Navbar only on non-admin routes */}
        {!isAdminRoute && <Navbar fixed />}

        {/* Add padding only if navbar is fixed */}
        <Box sx={{ pt: !isAdminRoute ? { xs: '56px', sm: '64px' } : 0 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/watch/:id" element={<WatchDetailsPage />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/cart" element={<Cart />} />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute role="admin">
                  <AdminLayout>
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="watches" element={<Watches />} />
                      <Route path="add-watch" element={<AddWatch />} />
                      <Route path="watches/edit/:id" element={<EditWatch />} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Box>

        {/* Show footer only on non-admin routes */}
        {!isAdminRoute && <Footer />}
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
