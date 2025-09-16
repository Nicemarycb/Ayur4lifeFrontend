import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

// Components
import AllProductsPage from './pages/AllProductsPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import CategoryProducts from './pages/CategoryProducts';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import Admin from './pages/Admin';
import AdminLogin from './pages/admin/AdminLogin';
import AdminProfile from './pages/admin/AdminProfile';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';
import AdminContacts from './pages/admin/Contacts';
import AdminCoupons from './pages/admin/Coupons';
import AdminReturnPolicy from './pages/admin/ReturnPolicy';
import AdminReturnRequests from './pages/admin/ReturnRequests';
import AdminCancellations from './pages/admin/Cancellations';
import ReturnRequest from './pages/ReturnRequest';
import CancelOrder from './pages/CancelOrder';
import ReturnPolicy from './pages/ReturnPolicy';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import About from './pages/About';

function App() {
  return (
    <AdminAuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <div className="App">
              <main className="main-content">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/all-products" element={<AllProductsPage />} />
                  <Route path="/return-policy" element={<ReturnPolicy />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/category/:category" element={<CategoryProducts />} />
                  <Route path="/about" element={<About />} />
                  
                  {/* Protected Routes */}
                  <Route path="/cart" element={
                    <PrivateRoute>
                      <Cart />
                    </PrivateRoute>
                  } />
                  <Route path="/wishlist" element={
                    <PrivateRoute>
                      <Wishlist />
                    </PrivateRoute>
                  } />
                  <Route path="/checkout" element={
                    <PrivateRoute>
                      <Checkout />
                    </PrivateRoute>
                  } />
                  <Route path="/account" element={
                    <PrivateRoute>
                      <Account />
                    </PrivateRoute>
                  } />
                  <Route path="/return-request/:orderId/:productId" element={
                    <PrivateRoute>
                      <ReturnRequest />
                    </PrivateRoute>
                  } />
                  <Route path="/cancel-order/:orderId/:productId" element={
                    <PrivateRoute>
                      <CancelOrder />
                    </PrivateRoute>
                  } />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={
                    <AdminRoute>
                      <Admin />
                    </AdminRoute>
                  } />
                  <Route path="/admin/products" element={
                    <AdminRoute>
                      <AdminProducts />
                    </AdminRoute>
                  } />
                  <Route path="/admin/orders" element={
                    <AdminRoute>
                      <AdminOrders />
                    </AdminRoute>
                  } />
                  <Route path="/admin/users" element={
                    <AdminRoute>
                      <AdminUsers />
                    </AdminRoute>
                  } />
                  <Route path="/admin/contacts" element={
                    <AdminRoute>
                      <AdminContacts />
                    </AdminRoute>
                  } />
                  <Route path="/admin/coupons" element={
                    <AdminRoute>
                      <AdminCoupons />
                    </AdminRoute>
                  } />
                  <Route path="/admin/return-policy" element={
                    <AdminRoute>
                      <AdminReturnPolicy />
                    </AdminRoute>
                  } />
                  <Route path="/admin/return-requests" element={
                    <AdminRoute>
                      <AdminReturnRequests />
                    </AdminRoute>
                  } />
                  <Route path="/admin/cancellations" element={
                    <AdminRoute>
                      <AdminCancellations />
                    </AdminRoute>
                  } />
                  <Route path="/admin/profile" element={
                    <AdminRoute>
                      <AdminProfile />
                    </AdminRoute>
                  } />
                </Routes>
              </main>
            </div>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AdminAuthProvider>
  );
}

export default App;
