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
  X,
  Ham,
  ArrowBigRight,
  ArrowRightIcon,
  ArrowBigLeft,
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

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
    { path: '/admin/options', label: '옵션 관리', icon: <List size={20} /> },
  ];

  return (
    <>
      {/* 사이드바 열기 버튼 - 닫힌 상태일 때만 표시 */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-[50%] z-20 bg-white p-2 rounded shadow-md"
        >
          <ArrowRightIcon size={16} />
        </button>
      )}

      {/* 사이드바 컴포넌트 */}
      {isOpen && (
        <div>
          <div className="w-64 h-full bg-white shadow-md fixed z-10">
            <div className="flex justify-between items-center p-4 border-b">
              <h1 className="font-bold text-xl">관리자 페이지</h1>
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
          <div className="z-10">
            <button
              onClick={toggleSidebar}
              className="fixed top-[50%] left-64 z-20 bg-white p-2 rounded shadow-md-right-3"
            >
              <ArrowBigLeft size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
