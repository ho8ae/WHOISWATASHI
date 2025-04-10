import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ChatWidget from '../chat/ChatWidget';
import  useAuth  from '../../hooks/useAuth';

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      
      {/* 사용자 로그인시에만 채팅 위젯 표시 */}
      {isAuthenticated && <ChatWidget />}
    </div>
  );
};

export default MainLayout;