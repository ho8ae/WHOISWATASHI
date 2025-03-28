import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <div className="bg-gray-800 text-white h-screen w-64 fixed left-0 top-0 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-8">관리자 페이지</h2>
        <nav className="flex flex-col space-y-2">
          <Link 
            to="/admin" 
            className={`p-3 rounded hover:bg-gray-700 ${isActive('/admin') && !isActive('/admin/users') && !isActive('/admin/orders') && !isActive('/admin/products') ? 'bg-gray-700' : ''}`}
          >
            대시보드
          </Link>
          <Link 
            to="/admin/users" 
            className={`p-3 rounded hover:bg-gray-700 ${isActive('/admin/users') ? 'bg-gray-700' : ''}`}
          >
            사용자 관리
          </Link>
          <Link 
            to="/admin/orders" 
            className={`p-3 rounded hover:bg-gray-700 ${isActive('/admin/orders') ? 'bg-gray-700' : ''}`}
          >
            주문 관리
          </Link>
          <Link 
            to="/admin/products" 
            className={`p-3 rounded hover:bg-gray-700 ${isActive('/admin/products') ? 'bg-gray-700' : ''}`}
          >
            상품 관리
          </Link>
          <Link 
            to="/" 
            className="p-3 rounded hover:bg-gray-700 mt-8 text-gray-400"
          >
            쇼핑몰로 돌아가기
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;