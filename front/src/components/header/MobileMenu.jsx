import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const MobileMenu = ({ isOpen, onClose, onLoginClick }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  
  // 로그아웃 처리
  const handleLogout = () => {
    logout();
    onClose(); // 메뉴 닫기
  };
  
  // 내정보 페이지로 이동
  const handleMyPageClick = () => {
    onClose(); // 메뉴 닫기
    navigate('/mypage');
  };

 

  
  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className={` fixed top-0 left-0 h-full w-full bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      ></div>

      {/* 슬라이딩 메뉴 */}
      <div
        className={` fixed top-0 left-0 h-full w-full bg-black text-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <span className="text-xl font-bold font-['NanumBarunpen']">
              MENU
            </span>
            <button
              onClick={onClose}
              className="text-white font-['NanumBarunpen'] text-xl w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          <nav className="flex flex-col space-y-6">
            <Link
              to="/about"
              className="text-xl font-['NanumBarunpen'] hover:text-gray-300 transition-colors"
              onClick={onClose}
            >
              ABOUT
            </Link>
            <Link
              to="/products"
              className="text-xl font-['NanumBarunpen'] hover:text-gray-300 transition-colors"
              onClick={onClose}
            >
              SHOP
            </Link>
            <Link
              to="/low"
              className="text-xl font-['NanumBarunpen'] hover:text-gray-300 transition-colors"
              onClick={onClose}
            >
              LOW
            </Link>
            <div className="border-t border-gray-700 my-2 mb-6"></div>
            
            {/* 로그인 상태에 따라 다른 메뉴 표시 */}
            {isAuthenticated ? (
              <>
                
                <div className="mb-4 py-2 px-3 bg-gray-800 rounded">
                  <p className="text-sm text-gray-300">로그인됨</p>
                  <p className="text-lg font-['NanumBarunpen']">{user?.name || user?.email}<span>({user?.role})</span></p>
                  
                </div>
                <button
                  onClick={handleMyPageClick}
                  className="text-left text-xl font-['NanumBarunpen'] hover:text-gray-300 transition-colors"
                >
                  내정보
                </button>
                <button
                  onClick={handleLogout}
                  className="text-left text-xl font-['NanumBarunpen'] hover:text-gray-300 transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                {/* 로그인되지 않은 경우 */}
                <button
                  onClick={onLoginClick} 
                  className="text-left text-xl font-['NanumBarunpen'] hover:text-gray-300 transition-colors"
                >
                  ACCOUNT
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;