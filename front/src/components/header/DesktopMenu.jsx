import React from 'react';
import { Link } from 'react-router-dom';

const DesktopMenu = ({ isOpen, toggleRef }) => {
  return (
    <div className="hidden md:block relative" ref={toggleRef}>
      <button
        className="text-xl font-bold font-['NanumBarunpen'] hover:text-gray-600 focus:outline-none"
      >
        WHOISWATASHI
      </button>

      {/* 가로형 드롭다운 메뉴 */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-screen max-w-4xl bg-white border border-gray-200 shadow-lg z-50">
          <div className="p-6 grid grid-cols-3 gap-8">
            {/* 첫 번째 섹션 */}
            <div>
              <h3 className="text-lg font-bold mb-4 font-['NanumBarunpen']">
                쇼핑
              </h3>
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
              <h3 className="text-lg font-bold mb-4 font-['NanumBarunpen']">
                브랜드
              </h3>
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
              <h3 className="text-lg font-bold mb-4 font-['NanumBarunpen']">
                계정
              </h3>
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
  );
};

export default DesktopMenu;