import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserAuthProvider } from './contexts/UserAuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AdminAuthProvider>
      <UserAuthProvider>
        <App />
      </UserAuthProvider>
    </AdminAuthProvider>
  </React.StrictMode>
);

reportWebVitals();
