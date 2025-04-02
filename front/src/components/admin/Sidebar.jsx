import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Package,
  ShoppingBag,
  Users,
  Layers,
  MessageSquare,
  List,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { path: '/admin', label: '대시보드', icon: <Home size={20} /> },
    {
      path: '/admin/products',
      label: '상품 관리',
      icon: <Package size={20} />,
    },
    {
      path: '/admin/orders',
      label: '주문 관리',
      icon: <ShoppingBag size={20} />,
    },
    { path: '/admin/users', label: '회원 관리', icon: <Users size={20} /> },
    {
      path: '/admin/categories',
      label: '카테고리 관리',
      icon: <Layers size={20} />,
    },
    {
      path: '/admin/inquiries',
      label: '문의 관리',
      icon: <MessageSquare size={20} />,
    },
    // { path: '/admin/options', label: '옵션 관리', icon: <List size={20} /> },
  ];

  return (
    <>
      {/* 닫힌 상태일 때 보이는 menu 버튼 */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 right-6 z-20 flex items-center bg-white px-3 py-2 rounded shadow-md"
        >
          <Menu size={20} className="mr-2" />
          <span>menu</span>
        </button>
      )}

      {/* 사이드바 컴포넌트 */}
      <div className={`transition-all duration-75 ${isOpen ? '' : 'w-0'}`}>
        {isOpen && (
          <div className="w-64 h-screen bg-white shadow-md fixed top-0 right-0 z-10">
            <div className="flex justify-between items-center p-4 border-b">
              <button
                onClick={toggleSidebar}
                className="flex items-center px-3 py-1 rounded hover:bg-gray-100"
              >
                <span className="mr-2">close</span>
                <X size={16} />
              </button>
            </div>

            <nav className="mt-4">
              <ul>
                {navItems.map((item) => (
                  <li key={item.path} className="mb-1">
                    <NavLink
                      to={item.path}
                      end={item.path === '/admin'}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-gray-700 ${
                          isActive
                            ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                            : 'hover:bg-gray-100'
                        }`
                      }
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;