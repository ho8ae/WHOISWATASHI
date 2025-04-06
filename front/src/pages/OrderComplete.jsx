// src/pages/OrderComplete.jsx
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useOrder from '../hooks/useOrder';

const OrderComplete = () => {
  const { orderId } = useParams();
  const { currentOrder, getOrderById, loading, error } = useOrder();
  
  // 주문 정보 로드
  useEffect(() => {
    if (orderId) {
      getOrderById(Number(orderId));
    }
  }, [orderId, getOrderById]);
  
  if (loading) {
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
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          <p>오류가 발생했습니다: {error}</p>
        </div>
        <Link
          to="/"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }
  
  if (!currentOrder) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600 mb-4">주문 정보를 찾을 수 없습니다.</p>
          <Link
            to="/"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">주문이 완료되었습니다</h1>
          <p className="text-gray-600">
            주문번호: <span className="font-medium">{currentOrder.orderNumber}</span>
          </p>
        </div>
        
        <div className="border-t border-b py-4 mb-6">
          <h2 className="text-lg font-medium mb-4">주문 정보</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">주문자</p>
              <p className="font-medium">{currentOrder.recipientName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">연락처</p>
              <p className="font-medium">{currentOrder.recipientPhone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">이메일</p>
              <p className="font-medium">{currentOrder.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">결제 방법</p>
              <p className="font-medium">
                {currentOrder.paymentMethod === 'card' && '신용카드'}
                {currentOrder.paymentMethod === 'vbank' && '가상계좌'}
                {currentOrder.paymentMethod === 'phone' && '휴대폰 결제'}
              </p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-1">배송지</p>
            <p className="font-medium">
              ({currentOrder.postalCode}) {currentOrder.address1} {currentOrder.address2 || ''}
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">주문 상품</h2>
          
          <div className="divide-y divide-gray-200">
            {currentOrder.items?.map((item) => (
              <div key={item.id} className="py-3 flex justify-between">
                <div>
                  <p className="text-sm font-medium">{item.productName}</p>
                  {item.variantInfo?.options?.length > 0 && (
                    <p className="text-xs text-gray-500">
                      {item.variantInfo.options.map(opt => 
                        `${opt.type}: ${opt.value}`
                      ).join(' / ')}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    {item.quantity}개 x {Number(item.unitPrice).toLocaleString()}원
                  </p>
                </div>
                <div className="text-sm font-medium">
                  {Number(item.totalPrice).toLocaleString()}원
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded mb-6">
          <div className="flex justify-between py-1">
            <span className="text-gray-600">상품 금액</span>
            <span>{Number(currentOrder.totalAmount).toLocaleString()}원</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-600">배송비</span>
            <span>
              {currentOrder.shippingFee === 0 ? '무료' : `${Number(currentOrder.shippingFee).toLocaleString()}원`}
            </span>
          </div>
          {currentOrder.discountAmount > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">할인 금액</span>
              <span>- {Number(currentOrder.discountAmount).toLocaleString()}원</span>
            </div>
          )}
          <div className="flex justify-between py-3 text-lg font-bold border-t mt-2">
            <span>총 결제 금액</span>
            <span className="text-blue-600">
              {(Number(currentOrder.totalAmount) + Number(currentOrder.shippingFee) - Number(currentOrder.discountAmount || 0)).toLocaleString()}원
            </span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-center"
          >
            홈으로 이동
          </Link>
          <Link
            to="/mypage/orders"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center"
          >
            주문 내역 확인
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderComplete;