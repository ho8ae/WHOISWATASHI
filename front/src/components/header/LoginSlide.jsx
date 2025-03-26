import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const LoginSlide = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  // 인증 커스텀 훅 사용
  const { login, isAuthenticated, loading, error, resetError } = useAuth();
  
  // 로그인 성공 시 슬라이드 닫고 홈으로 리다이렉트
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose();
      setEmail('');
      setPassword('');
      navigate('/'); // 홈으로 리다이렉트
    }
    
    // 슬라이드가 닫힐 때 에러 초기화
    if (!isOpen && error) {
      resetError();
    }
  }, [isAuthenticated, isOpen, onClose, error, resetError, navigate]);
  
  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      // 성공 시 useEffect에서 슬라이드를 닫고 홈으로 리다이렉트
    } catch (err) {
      // 에러는 Redux에서 처리됨
      console.error('로그인 실패:', err);
    }
  };
  
  return (
    <>
      {/* 로그인 슬라이드 패널 - 배경 오버레이 없이 */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white z-60 transform transition-transform duration-300 ease-in-out shadow-xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <span className="text-xl font-bold font-['NanumBarunpen']">Login</span>
            <button
              onClick={onClose}
              className="text-black font-['NanumBarunpen'] text-xl w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
          
          {/* 에러 메시지 표시 */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="이메일 주소를 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors"
              disabled={loading}
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-black">
              비밀번호를 잊으셨나요?
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">계정이 없으신가요?</p>
            <Link
              to="/register"
              className="inline-block border border-black text-black px-4 py-2 rounded-md hover:bg-black hover:text-white transition-colors"
              onClick={onClose} // 회원가입 페이지로 이동 시 슬라이드 닫기
            >
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginSlide;