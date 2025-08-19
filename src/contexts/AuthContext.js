// // import React, { createContext, useContext, useState, useEffect } from 'react';
// // import axios from 'axios';

// // const AuthContext = createContext();

// // export const useAuth = () => {
// //   const context = useContext(AuthContext);
// //   if (!context) {
// //     throw new Error('useAuth must be used within an AuthProvider');
// //   }
// //   return context;
// // };

// // export const AuthProvider = ({ children }) => {
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   // Check if user is logged in on app start
// //   useEffect(() => {
// //     const token = localStorage.getItem('token');
// //     if (token) {
// //       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
// //       checkAuthStatus();
// //     } else {
// //       setLoading(false);
// //     }
// //   }, []);

// //   const checkAuthStatus = async () => {
// //     try {
// //       const response = await axios.get('http://localhost:5000/api/auth/profile');
// //       setUser(response.data.user);
// //     } catch (error) {
// //       localStorage.removeItem('token');
// //       delete axios.defaults.headers.common['Authorization'];
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const login = async (email, password) => {
// //     try {
// //       setError(null);
// //       const response = await axios.post('http://localhost:5000/api/auth/login', {
// //         email,
// //         password
// //       });

// //       const { token, user: userData } = response.data;
// //       localStorage.setItem('token', token);
// //       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
// //       setUser(userData);
// //       return { success: true, user: userData };
// //     } catch (error) {
// //       const message = error.response?.data?.message || 'Login failed';
// //       setError(message);
// //       return { success: false, error: message };
// //     }
// //   };

// //   const register = async (userData) => {
// //     try {
// //       setError(null);
// //       const response = await axios.post('http://localhost:5000/api/auth/register', userData);
// //       return { success: true, message: 'Registration successful! Please login.' };
// //     } catch (error) {
// //       const message = error.response?.data?.message || 'Registration failed';
// //       setError(message);
// //       return { success: false, error: message };
// //     }
// //   };

// //   const logout = () => {
// //     localStorage.removeItem('token');
// //     delete axios.defaults.headers.common['Authorization'];
// //     setUser(null);
// //     setError(null);
// //   };

// //   const updateProfile = async (profileData) => {
// //     try {
// //       setError(null);
// //       const response = await axios.put('http://localhost:5000/api/auth/profile', profileData);
// //       setUser(response.data.user);
// //       return { success: true };
// //     } catch (error) {
// //       const message = error.response?.data?.message || 'Profile update failed';
// //       setError(message);
// //       return { success: false, error: message };
// //     }
// //   };

// //   const changePassword = async (currentPassword, newPassword) => {
// //     try {
// //       setError(null);
// //       await axios.put('http://localhost:5000/api/auth/change-password', {
// //         currentPassword,
// //         newPassword
// //       });
// //       return { success: true };
// //     } catch (error) {
// //       const message = error.response?.data?.message || 'Password change failed';
// //       setError(message);
// //       return { success: false, error: message };
// //     }
// //   };

// //   const clearError = () => {
// //     setError(null);
// //   };

// //   const value = {
// //     user,
// //     loading,
// //     error,
// //     login,
// //     register,
// //     logout,
// //     updateProfile,
// //     changePassword,
// //     clearError,
// //     isAuthenticated: !!user,
// //     isAdmin: user?.role === 'admin'
// //   };

// //   return (
// //     <AuthContext.Provider value={value}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };

// // =========================================================
// // File: src/contexts/AuthContext.js
// // Description: Manages user and admin authentication states.
// // This version uses separate states and local storage keys
// // and provides distinct logout functions.
// // =========================================================
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [admin, setAdmin] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Set up base URL for API calls
//   axios.defaults.baseURL = 'http://localhost:5000';

//   // Check for existing user and admin sessions on app start
//   useEffect(() => {
//     const userToken = localStorage.getItem('userToken');
//     const adminToken = localStorage.getItem('adminToken');

//     if (userToken) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
//       checkAuthStatus('user');
//     } else if (adminToken) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
//       checkAuthStatus('admin');
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const checkAuthStatus = async (role) => {
//     try {
//       const response = await axios.get('/api/auth/profile');
//       if (response.data.user.role === 'admin') {
//         setAdmin(response.data.user);
//       } else {
//         setUser(response.data.user);
//       }
//     } catch (error) {
//       if (role === 'user') {
//         localStorage.removeItem('userToken');
//       } else if (role === 'admin') {
//         localStorage.removeItem('adminToken');
//       }
//       delete axios.defaults.headers.common['Authorization'];
//     } finally {
//       setLoading(false);
//     }
//   };

//   const register = async (userData) => {
//     try {
//       setError(null);
//       const response = await axios.post('/api/auth/register', userData);
//       const { token, user: userDataResponse } = response.data;

//       // Store token based on role
//       if (userDataResponse.role === 'admin') {
//         localStorage.setItem('adminToken', token);
//         setAdmin(userDataResponse);
//         setUser(null);
//       } else {
//         localStorage.setItem('userToken', token);
//         setUser(userDataResponse);
//         setAdmin(null);
//       }
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       return { success: true, message: 'Registration successful! Please login.' };
//     } catch (error) {
//       const message = error.response?.data?.error || 'Registration failed';
//       setError(message);
//       return { success: false, message };
//     }
//   };

//   const login = async (email, password) => {
//     try {
//       setError(null);
//       const response = await axios.post('/api/auth/login', { email, password });
//       const { token, user: userData } = response.data;

//       // Clear any existing session before logging in a new one
//       localStorage.removeItem('userToken');
//       localStorage.removeItem('adminToken');

//       if (userData.role === 'admin') {
//         localStorage.setItem('adminToken', token);
//         setAdmin(userData);
//         setUser(null);
//       } else {
//         localStorage.setItem('userToken', token);
//         setUser(userData);
//         setAdmin(null);
//       }

//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       return { success: true, user: userData };
//     } catch (error) {
//       const message = error.response?.data?.error || 'Login failed';
//       setError(message);
//       return { success: false, error: message };
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('userToken');
//     setUser(null);
//     delete axios.defaults.headers.common['Authorization'];
//     setError(null);
//   };

//   const adminLogout = () => {
//     localStorage.removeItem('adminToken');
//     setAdmin(null);
//     delete axios.defaults.headers.common['Authorization'];
//     setError(null);
//   };

//   const updateProfile = async (profileData) => {
//     try {
//       setError(null);
//       const response = await axios.put('/api/auth/profile', profileData);
//       if (admin) {
//         setAdmin(response.data.user);
//       } else if (user) {
//         setUser(response.data.user);
//       }
//       return { success: true };
//     } catch (error) {
//       const message = error.response?.data?.error || 'Profile update failed';
//       setError(message);
//       return { success: false, error: message };
//     }
//   };

//   const changePassword = async (currentPassword, newPassword) => {
//     try {
//       setError(null);
//       await axios.put('/api/auth/change-password', {
//         currentPassword,
//         newPassword
//       });
//       return { success: true };
//     } catch (error) {
//       const message = error.response?.data?.error || 'Password change failed';
//       setError(message);
//       return { success: false, error: message };
//     }
//   };

//   const clearError = () => {
//     setError(null);
//   };

//   const value = {
//     user,
//     admin,
//     isAuthenticated: !!user || !!admin,
//     isAdmin: !!admin,
//     loading,
//     error,
//     login,
//     register,
//     logout,
//     adminLogout,
//     updateProfile,
//     changePassword,
//     clearError,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };