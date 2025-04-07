import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useMypage from '../hooks/useMypage';
import useAuth from '../hooks/useAuth';


import {ProfileInfo,OrderDetail,OrderList,OrderTracking,WishlistView,TabNavigation} from '../components/mypage/index'; // 마이페이지 컴포넌트들 통합 import

// Framer Motion
import { motion } from 'framer-motion';

const MyPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const {
    getProfile,
    getUserOrders,
    profile,
    orders,
    loading
  } = useMypage();

  // 현재 활성화된 탭
  const [activeTab, setActiveTab] = useState('profile');
  // 선택된 주문 ID (주문 상세/배송 추적)
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // 페이지 로드 시 인증 체크
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: '/mypage' } });
    }
  }, [authLoading, isAuthenticated, navigate]);

  // 프로필 정보 로드
  useEffect(() => {
    if (isAuthenticated) {
      getProfile();
    }
  }, [isAuthenticated, getProfile]);

  // 주문 목록 로드 (profile 탭 외에 모두 주문 목록 필요)
  useEffect(() => {
    if (isAuthenticated && activeTab !== 'profile' && activeTab !== 'wishlist') {
      getUserOrders();
    }
  }, [isAuthenticated, activeTab, getUserOrders]);

  // 탭 변경 핸들러
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // 주문 상세/배송 탭에서 나갈 때 선택된 주문 초기화
    if (tab !== 'order-detail' && tab !== 'order-tracking') {
      setSelectedOrderId(null);
    }
  };

  // 주문 선택 핸들러
  const handleOrderSelect = (orderId) => {
    setSelectedOrderId(orderId);
    setActiveTab('order-detail');
  };

  // 배송 조회 핸들러
  const handleTrackingView = (orderId) => {
    setSelectedOrderId(orderId);
    setActiveTab('order-tracking');
  };

  // 로딩 중이면 로딩 표시
  if (authLoading || (loading.profile && !profile)) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="spinner">로딩 중...</div>
      </div>
    );
  }

  // 탭 내용 렌더링
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileInfo />;
      case 'orders':
        return (
          <OrderList
            onOrderSelect={handleOrderSelect}
            onTrackingView={handleTrackingView}
          />
        );
      case 'order-detail':
        return (
          <OrderDetail
            orderId={selectedOrderId}
            onBack={() => setActiveTab('orders')}
            onTrackingView={handleTrackingView}
          />
        );
      case 'order-tracking':
        return (
          <OrderTracking
            orderId={selectedOrderId}
            onBack={() => setActiveTab('order-detail')}
          />
        );
      case 'wishlist':
        return <WishlistView />;
      default:
        return <ProfileInfo />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">마이페이지</h1>
      
      {profile && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="font-medium">{profile.name}님, 안녕하세요!</p>
          <p className="text-sm text-gray-600">
            가입일: {new Date(profile.createdAt).toLocaleDateString()}
          </p>
          {profile.orderCount > 0 && (
            <p className="text-sm">총 주문 횟수: {profile.orderCount}회</p>
          )}
        </div>
      )}
      
      <TabNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-6"
      >
        {renderTabContent()}
      </motion.div>
    </div>
  );
};

export default MyPage;