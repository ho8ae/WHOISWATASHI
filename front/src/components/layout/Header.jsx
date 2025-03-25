import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white-500 text-black p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          {/* 모바일에서만 보이는 버튼 */}
          <button 
            onClick={toggleMenu}
            className="text-xl font-bold font-['NanumBarunpen'] md:hidden"
          >
            WHOISWATASHI
          </button>
          
          {/* 데스크탑에서만 보이는 로고 및 드롭다운 */}
          <div className="hidden md:block relative" ref={dropdownRef}>
            <button 
              onClick={toggleDropdown}
              className="text-xl font-bold font-['NanumBarunpen'] hover:text-gray-600 focus:outline-none"
            >
              WHOISWATASHI
            </button>
            
            {/* 가로형 드롭다운 메뉴 */}
            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-screen max-w-4xl bg-white border border-gray-200 shadow-lg z-50">
                <div className="p-6 grid grid-cols-3 gap-8">
                  {/* 첫 번째 섹션 */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 font-['NanumBarunpen']">쇼핑</h3>
                    <div className="space-y-2">
                      <Link 
                        to="/shop" 
                        className="block text-gray-800 hover:text-black font-['NanumBarunpen']"
                      >
                        SHOP
                      </Link>
                      <Link 
                        to="/new-arrivals" 
                        className="block text-gray-800 hover:text-black font-['NanumBarunpen']"
                      >
                        신상품
                      </Link>
                      <Link 
                        to="/best-sellers" 
                        className="block text-gray-800 hover:text-black font-['NanumBarunpen']"
                      >
                        베스트셀러
                      </Link>
                    </div>
                  </div>
                  
                  {/* 두 번째 섹션 */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 font-['NanumBarunpen']">브랜드</h3>
                    <div className="space-y-2">
                      <Link 
                        to="/about" 
                        className="block text-gray-800 hover:text-black font-['NanumBarunpen']"
                      >
                        ABOUT
                      </Link>
                      <Link 
                        to="/low" 
                        className="block text-gray-800 hover:text-black font-['NanumBarunpen']"
                      >
                        LOW
                      </Link>
                      <Link 
                        to="/contact" 
                        className="block text-gray-800 hover:text-black font-['NanumBarunpen']"
                      >
                        문의하기
                      </Link>
                    </div>
                  </div>
                  
                  {/* 세 번째 섹션 */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 font-['NanumBarunpen']">계정</h3>
                    <div className="space-y-2">
                      <Link 
                        to="/login" 
                        className="block text-gray-800 hover:text-black font-['NanumBarunpen']"
                      >
                        로그인
                      </Link>
                      <Link 
                        to="/register" 
                        className="block text-gray-800 hover:text-black font-['NanumBarunpen']"
                      >
                        회원가입
                      </Link>
                      <Link 
                        to="/my-profile" 
                        className="block text-gray-800 hover:text-black font-['NanumBarunpen']"
                      >
                        내 정보
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <Link to="/products" className="text-xl font-bold font-['NanumBarunpen']">SHOP</Link>
      </div>

      {/* 모바일 전용 슬라이딩 메뉴 (md 미만에서만 표시) */}
      <div 
        className={`md:hidden fixed top-0 left-0 h-full w-full bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      ></div>

      <div 
        className={`md:hidden fixed top-0 left-0 h-full w-full bg-black text-white z-50 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <span className="text-xl font-bold font-['NanumBarunpen']">MENU</span>
            <button 
              onClick={toggleMenu}
              className="text-white font-['NanumBarunpen'] text-xl w-8 h-8 flex items-center justify-center"
            >
              close
            </button>
          </div>
          
          <nav className="flex flex-col space-y-6">
            <Link 
              to="/about" 
              className="text-xl font-['NanumBarunpen'] hover:text-gray-300 transition-colors"
            >
              ABOUT
            </Link>
            <Link 
              to="/shop" 
              className="text-xl font-['NanumBarunpen'] hover:text-gray-300 transition-colors"
            >
              SHOP
            </Link>
            <Link 
              to="/low" 
              className="text-xl font-['NanumBarunpen'] hover:text-gray-300 transition-colors"
            >
              LOW
            </Link>
            <div className="border-t border-gray-700 my-2"></div>
            <Link 
              to="/login" 
              className="text-xl font-['NanumBarunpen'] hover:text-gray-300 transition-colors"
            >
              로그인
            </Link>
            <Link 
              to="/register" 
              className="text-xl font-['NanumBarunpen'] hover:text-gray-300 transition-colors"
            >
              회원가입
            </Link>
            <Link 
              to="/my-profile" 
              className="text-xl font-['NanumBarunpen'] hover:text-gray-300 transition-colors"
            >
              내 정보
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;