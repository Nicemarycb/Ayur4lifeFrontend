import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useUserAuth } from './UserAuthContext';
axios.defaults.baseURL = 'http://localhost:5000';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useUserAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated]);

  const loadWishlist = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await axios.get('/api/wishlist');
      setWishlist(response.data.wishlistItems || []);
    } catch (error) {
      console.error('Error loading wishlist:', error);
      setError('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    if (!isAuthenticated) {
      return { success: false, error: 'User not authenticated' };
    }
    
    if (!productId) {
      return { success: false, error: 'Product ID is required' };
    }
    
    try {
      setLoading(true);
      setError(null);

      // Optimistic update: Add placeholder item
      const newItem = { id: `temp-${Date.now()}`, product: { id: productId }, addedAt: new Date().toISOString() };
      setWishlist(prev => [...prev, newItem]);

      const response = await axios.post('/api/wishlist/add', {
        productId
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Sync with server
      await loadWishlist();
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to add to wishlist';
      setError(message);
      // Rollback
      setWishlist(prev => prev.filter(item => !item.id.startsWith('temp-')));
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (wishlistItemId) => {
    if (!isAuthenticated || !wishlistItemId) return { success: false, error: 'Invalid wishlist item ID' };

    try {
      setLoading(true);
      setError(null);

      // Optimistic update: Remove locally
      setWishlist(prev => prev.filter(item => item.id !== wishlistItemId));

      await axios.delete(`/api/wishlist/remove/${wishlistItemId}`);

      // Sync
      await loadWishlist();
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to remove item from wishlist';
      setError(message);
      // Rollback
      await loadWishlist();
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const removeProductFromWishlist = async (productId) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      // Optimistic update: Remove locally
      setWishlist(prev => prev.filter(item => item.product.id !== productId));

      const response = await axios.delete(`/api/wishlist/remove-product/${productId}`);
      setWishlist(response.data.wishlistItems || []);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove product from wishlist';
      setError(message);
      // Rollback
      await loadWishlist();
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const clearWishlist = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      // Optimistic update: Clear locally
      setWishlist([]);

      await axios.delete('/api/wishlist/clear');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear wishlist';
      setError(message);
      // Rollback
      await loadWishlist();
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const checkWishlistStatus = async (productId) => {
    if (!isAuthenticated) return false;

    try {
      const response = await axios.get(`/api/wishlist/check/${productId}`);
      return response.data.isWishlisted;
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      return false;
    }
  };

  const getWishlistCount = async () => {
    if (!isAuthenticated) return 0;

    try {
      const response = await axios.get('/api/wishlist/count');
      return response.data.count;
    } catch (error) {
      console.error('Error getting wishlist count:', error);
      return 0;
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.product.id === productId);  // Fixed: item.product.id
  };

  const toggleWishlist = async (productId) => {
    if (!productId) {
      setError('Product ID is required');
      return;
    }

    try {
      setError(null);
      if (isInWishlist(productId)) {
        const item = wishlist.find(item => item.product.id === productId);
        if (item) {
          await removeFromWishlist(item.id);
        }
      } else {
        await addToWishlist(productId);
      }
    } catch (err) {
      setError('Failed to toggle wishlist');
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    wishlist,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    removeProductFromWishlist,
    clearWishlist,
    checkWishlistStatus,
    getWishlistCount,
    isInWishlist,
    toggleWishlist,  // Added toggle function
    clearError,
    wishlistCount: wishlist.length
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};