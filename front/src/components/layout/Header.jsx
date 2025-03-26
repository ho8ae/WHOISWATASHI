import React from 'react';
import { Link } from 'react-router-dom';
import { useToggle } from '../../hooks/useToggles';
import LoginSlide from '../header/LoginSlide';
import MobileMenu from '../header/MobileMenu';
import DesktopMenu from '../header/DesktopMenu';

const Header = () => {
  const menu = useToggle(false);
  const dropdown = useToggle(false);
  const login = useToggle(false);

  const handleLoginClick = () => {
    login.toggle();
  };

  return (
    <header className="bg-white text-black p-4 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          {/* 모바일에서만 보이는 버튼 */}
          <button
            onClick={menu.toggle}
            className="text-xl font-bold font-['NanumBarunpen'] "
          >
            WHOISWATASHI
          </button>

          {/* 데스크탑에서만 보이는 로고 및 드롭다운 */}
          {/* <DesktopMenu 
            isOpen={dropdown.isOpen} 
            toggleRef={dropdown.ref} 
          /> */}
        </div>

        <div className="flex items-center space-x-4">
          <Link
            to="/products"
            className="text-xl font-bold font-['NanumBarunpen']"
          >
            SHOP
          </Link>
          
          {/* 로그인 버튼 추가
          <button
            onClick={handleLoginClick}
            className="text-xl font-bold font-['NanumBarunpen']"
          >
            LOGIN
          </button> */}
        </div>
      </div>

      {/* 모바일 전용 슬라이딩 메뉴 */}
      <MobileMenu 
        isOpen={menu.isOpen} 
        onClose={menu.close} 
        onLoginClick={handleLoginClick}
      />

      {/* 로그인 슬라이드 컴포넌트 */}
      <LoginSlide 
        isOpen={login.isOpen} 
        onClose={login.close} 
      />
    </header>
  
  );
};

export default Header;
