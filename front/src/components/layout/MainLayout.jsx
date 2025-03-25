import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;