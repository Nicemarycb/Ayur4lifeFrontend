import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setLoading(false);
        return;
      }

      // Verify admin token and get admin info (per-request header)
      const response = await axios.get('/api/admin/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.isAdmin) {
        setIsAuthenticated(true);
        setIsAdmin(true);
        setAdminUser(response.data.admin);
      } else {
        localStorage.removeItem('adminToken');
      }
    } catch (error) {
      console.error('Admin auth check failed:', error);
      localStorage.removeItem('adminToken');
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (email, password) => {
    try {
      const response = await axios.post('/api/admin/login', { email, password });
      const { token, admin } = response.data;

      localStorage.setItem('adminToken', token);

      setIsAuthenticated(true);
      setIsAdmin(true);
      setAdminUser(admin);

      return { success: true };
    } catch (error) {
      console.error('Admin login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setAdminUser(null);
  };

  const value = {
    isAuthenticated,
    isAdmin,
    adminUser,
    loading,
    adminLogin,
    adminLogout,
    checkAdminAuth
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};