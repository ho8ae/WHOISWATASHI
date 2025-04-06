// src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useCart from '../hooks/useCart';
import useOrder from '../hooks/useOrder';

const Checkout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { cartItems, itemCount, subtotal, loading: cartLoading } = useCart();
  const { submitOrder, loading: orderLoading, error, orderCreated, currentOrder } = useOrder();
  
  // 배송 정보 상태
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    recipientName: user?.name || '',
    recipientPhone: '',
    postalCode: '',
    address1: '',
    address2: '',
    notes: '',
    paymentMethod: 'card',
    guestPassword: ''  // 비회원 주문 시 필요
  });
  
  // 배송비 및 총 주문 금액 계산
  const shippingFee = subtotal >= 50000 ? 0 : 3000;
  const totalAmount = subtotal + shippingFee;
  
  // 카트가 비어있으면 홈으로 리다이렉트
  useEffect(() => {
    if (!cartLoading && itemCount === 0) {
      alert('장바구니에 상품이 없습니다.');
      navigate('/cart');
    }
  }, [cartLoading, itemCount, navigate]);
  
  // 주문이 생성되면 결제 페이지로 이동
  useEffect(() => {
    if (orderCreated && currentOrder) {
      navigate(`/payment/${currentOrder.orderId}`);
    }
  }, [orderCreated, currentOrder, navigate]);
  
  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 우편번호 검색 (Daum Postcode API 사용)
  const handlePostcodeSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setFormData(prev => ({
          ...prev,
          postalCode: data.zonecode,
          address1: data.address
        }));
      }
    }).open();
  };
  
  // 주문 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 필수 필드 검증
    const requiredFields = ['email', 'phone', 'recipientName', 'recipientPhone', 'postalCode', 'address1'];
    const emptyFields = requiredFields.filter(field => !formData[field]);
    
    if (emptyFields.length > 0) {
      alert('모든 필수 정보를 입력해주세요.');
      return;
    }
    
    // 비회원이면 비밀번호 필수
    if (!isAuthenticated && !formData.guestPassword) {
      alert('비회원 주문 시 주문 조회용 비밀번호를 설정해주세요.');
      return;
    }
    
    try {
      await submitOrder(formData);
    } catch (error) {
      console.error('주문 생성 실패:', error);
    }
  };
  
  if (cartLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">주문/결제</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 주문 정보 폼 */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">배송 정보</h2>
            
            {/* 이메일 */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
                이메일 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            {/* 전화번호 */}
            <div className="mb-4">
              <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-1">
                연락처 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="01012345678"
                required
              />
            </div>
            
            {/* 수령인 */}
            <div className="mb-4">
              <label htmlFor="recipientName" className="block text-gray-700 text-sm font-medium mb-1">
                수령인 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="recipientName"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            {/* 수령인 연락처 */}
            <div className="mb-4">
              <label htmlFor="recipientPhone" className="block text-gray-700 text-sm font-medium mb-1">
                수령인 연락처 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="recipientPhone"
                name="recipientPhone"
                value={formData.recipientPhone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="01012345678"
                required
              />
            </div>
            
            {/* 주소 */}
            <div className="mb-4">
              <label htmlFor="postalCode" className="block text-gray-700 text-sm font-medium mb-1">
                우편번호 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  readOnly
                  required
                />
                <button
                  type="button"
                  onClick={handlePostcodeSearch}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  주소 검색
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="address1" className="block text-gray-700 text-sm font-medium mb-1">
                기본 주소 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="address1"
                name="address1"
                value={formData.address1}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                readOnly
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="address2" className="block text-gray-700 text-sm font-medium mb-1">
                상세 주소
              </label>
              <input
                type="text"
                id="address2"
                name="address2"
                value={formData.address2}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* 배송 메모 */}
            <div className="mb-4">
              <label htmlFor="notes" className="block text-gray-700 text-sm font-medium mb-1">
                배송 메모
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows="2"
              />
            </div>
            
            {/* 비회원 주문 비밀번호 */}
            {!isAuthenticated && (
              <div className="mb-4">
                <label htmlFor="guestPassword" className="block text-gray-700 text-sm font-medium mb-1">
                  주문 비밀번호 <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="guestPassword"
                  name="guestPassword"
                  value={formData.guestPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="비회원 주문 조회에 사용됩니다"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  비회원 주문 조회에 사용될 비밀번호를 설정해주세요.
                </p>
              </div>
            )}
            
            {/* 결제 방법 */}
            <div className="mb-4">
              <h2 className="text-lg font-medium mb-2">결제 방법</h2>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2">신용카드</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="vbank"
                    checked={formData.paymentMethod === 'vbank'}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2">가상계좌</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="phone"
                    checked={formData.paymentMethod === 'phone'}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2">휴대폰 결제</span>
                </label>
              </div>
            </div>
            
            {/* 에러 메시지 */}
            {error && (
              <div className="mb-4 bg-red-100 text-red-700 p-3 rounded">
                {error}
              </div>
            )}
            
            {/* 제출 버튼 */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={orderLoading}
              >
                {orderLoading ? '처리 중...' : '결제하기'}
              </button>
            </div>
          </form>
        </div>
        
        {/* 주문 요약 */}
        <div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">주문 요약</h2>
            
            {/* 주문 상품 목록 */}
            <div className="mb-4">
              <h3 className="font-medium text-gray-700 mb-2">주문 상품 ({itemCount})</h3>
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.productName}</p>
                      <p className="text-xs text-gray-500">
                        {item.quantity}개 x {Number(item.price).toLocaleString()}원
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      {Number(item.totalPrice).toLocaleString()}원
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 결제 금액 */}
            <div className="border-t pt-4">
              <div className="flex justify-between py-1">
                <span className="text-gray-600">상품 금액</span>
                <span>{subtotal.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600">배송비</span>
                <span>
                  {shippingFee === 0 ? '무료' : `${shippingFee.toLocaleString()}원`}
                </span>
              </div>
              <div className="flex justify-between py-3 text-lg font-bold border-t mt-2">
                <span>총 결제 금액</span>
                <span className="text-blue-600">{totalAmount.toLocaleString()}원</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;