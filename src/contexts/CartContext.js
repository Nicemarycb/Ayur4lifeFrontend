import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useUserAuth } from './UserAuthContext';
axios.defaults.baseURL = 'http://localhost:5000';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useUserAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCart([]);
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await axios.get('/api/cart');
      setCart(response.data.cartItems || []);
    } catch (error) {
      console.error('Error loading cart:', error);
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      setError('Please login to add items to cart');
      return { success: false, error: 'Please login to add items to cart' };
    }

    const prevCart = [...cart]; // Backup for rollback

    try {
      setLoading(true);
      setError(null);

      // Optimistic update: Add item to cart locally with a temporary ID
      const newItem = { id: `temp-${Date.now()}`, productId, quantity, product: { id: productId, price: 0 } }; // Placeholder
      setCart([...cart, newItem]);

      const response = await axios.post('/api/cart/add', { productId, quantity });
      setCart(response.data.cartItems || []); // Sync with full cart from server
      return { success: true };
    } catch (error) {
      setCart(prevCart); // Rollback
      const message = error.response?.data?.error || 'Failed to add item to cart';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    if (!isAuthenticated) return;

    const prevCart = [...cart]; // Backup for rollback

    try {
      setLoading(true);
      setError(null);

      // Optimistic update: Update quantity locally
      const updatedCart = cart.map(item =>
        item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
      );
      setCart(updatedCart);

      const response = await axios.put(`/api/cart/update/${itemId}`, { quantity });
      setCart(response.data.cartItems || []); // Sync with full cart from server
      return { success: true };
    } catch (error) {
      setCart(prevCart); // Rollback
      const message = error.response?.data?.error || 'Failed to update cart item';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      // Optimistic update: Remove item locally
      const updatedCart = cart.filter(item => item.id !== itemId);
      setCart(updatedCart);

      const response = await axios.delete(`/api/cart/remove/${itemId}`);
      setCart(response.data.cartItems || []); // Sync with updated cartItems from server
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item from cart';
      setError(message);
      // Roll back optimistic update on failure
      loadCart(); // Re-fetch to restore correct state
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      // Optimistic update: Clear cart locally
      setCart([]);

      await axios.delete('/api/cart/clear');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      setError(message);
      // Roll back optimistic update on failure
      loadCart(); // Re-fetch to restore correct state
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const getCartSummary = async () => {
    if (!isAuthenticated) return null;

    try {
      const response = await axios.get('/api/cart/summary');
      return response.data;
    } catch (error) {
      console.error('Error getting cart summary:', error);
      return null;
    }
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const gst = subtotal * 0.18; // 18% GST
    const total = subtotal + gst;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return {
      subtotal,
      gst,
      total,
      totalItems
    };
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    cart,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartSummary,
    calculateTotals,
    clearError,
    cartItemCount: cart.reduce((sum, item) => sum + item.quantity, 0)
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};