import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserAuth } from '../contexts/UserAuthContext';

const PrivateRoute = ({ children }) => {
 const { isAuthenticated, loading } = useUserAuth();
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
