import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Dashboard from '../components/admin/Dashboard';
import UserManagement from '../components/admin/UserManagement';
import OrderManagement from '../components/admin/OrderManagement';
import ProductManagement from '../components/admin/ProductManagement';
import useAuth from '../hooks/useAuth'; // 인증 관련 훅

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth(); // 실제 구현에 맞게 조정 필요

  // 권한 확인 및 리디렉션
  useEffect(() => {
    // 인증 및 관리자 권한 확인 (실제 구현에 맞게 조정 필요)
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
    } else if (user?.role !== 'admin') {
      navigate('/'); // 권한 없는 사용자는 홈으로 리디렉션
    }
  }, [isAuthenticated, user, navigate, location]);

  // 로딩 중일 때 또는 권한 확인 전
  if (!isAuthenticated || user?.role !== 'admin') {
    return <div className="p-8 text-center">접근 권한을 확인 중입니다...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 사이드바 */}
      <Sidebar />
      
      {/* 메인 콘텐츠 */}
      <div className="ml-64 flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/orders" element={<OrderManagement />} />
          <Route path="/products" element={<ProductManagement />} />
          {/* 추가 라우트는 여기에 */}
        </Routes>
      </div>
    </div>
  );
};

export default Admin;