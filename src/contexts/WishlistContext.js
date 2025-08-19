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
      const response = await axios.post('/api/wishlist/add', {
        productId: productId // Ensure productId is explicitly sent
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      await loadWishlist(); // Refresh the wishlist after successful addition
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to add to wishlist';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

// Ensure removeFromWishlist uses wishlistItemId
const removeFromWishlist = async (wishlistItemId) => {
  if (!isAuthenticated) return;

  try {
    setError(null);
    await axios.delete(`/api/wishlist/remove/${wishlistItemId}`);
    await loadWishlist(); // Reload to reflect changes
    return { success: true };
  } catch (error) {
    const message = error.response?.data?.error || 'Failed to remove item from wishlist';
    setError(message);
    return { success: false, error: message };
  }
};

// Ensure removeProductFromWishlist uses productId
const removeProductFromWishlist = async (productId) => {
  if (!isAuthenticated) return;

  try {
    setError(null);
    const response = await axios.delete(`/api/wishlist/remove-product/${productId}`);
    setWishlist(response.data.wishlistItems || []);
    return { success: true };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to remove product from wishlist';
    setError(message);
    return { success: false, error: message };
  }
};
  const clearWishlist = async () => {
    if (!isAuthenticated) return;

    try {
      setError(null);
      await axios.delete('/api/wishlist/clear');
      setWishlist([]);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear wishlist';
      setError(message);
      return { success: false, error: message };
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
    return wishlist.some(item => item.productId === productId);
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
    clearError,
    wishlistCount: wishlist.length
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};