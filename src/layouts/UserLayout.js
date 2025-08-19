import React from 'react';
import Navbar from '../components/Navbar';

const UserLayout = ({ children }) => {
  return (
    <div className="user-layout">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default UserLayout;
