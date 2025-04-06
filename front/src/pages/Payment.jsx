// src/pages/Payment.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useOrder from '../hooks/useOrder';

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { 
    currentOrder, 
    getOrderById, 
    verifyPayment, 
    loading, 
    error, 
    paymentResult 
  } = useOrder();
  
  // 결제 요청 상태 관리
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const paymentProcessed = useRef(false);
  
  // shopId
  const shopId = import.meta.env.VITE_APP_PORTONE_SHOP_ID; // 실제 가맹점 식별코드
  
  // 주문 정보 로드
  useEffect(() => {
    if (orderId) {
      getOrderById(Number(orderId));
    }
  }, [orderId, getOrderById]);
  
  // 아임포트 스크립트 로드
  useEffect(() => {
    if (scriptLoaded) return;
    
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/v1/iamport.js";
    script.async = true;
    
    script.onload = () => {
      console.log("아임포트 스크립트 로드 완료");
      setScriptLoaded(true);
      
      // 아임포트 초기화
      if (window.IMP) {
        window.IMP.init(shopId); // 실제 가맹점 식별코드
        console.log("아임포트 초기화 완료");
      }
    };
    
    document.head.appendChild(script);
    
    return () => {
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, []);
  
  // 결제 요청 함수
  const requestPayment = () => {
    if (!currentOrder || !window.IMP || !scriptLoaded) {
      console.error("주문 정보 또는 아임포트 모듈 없음");
      return;
    }
    
    if (paymentProcessed.current) {
      console.log("이미 결제 처리 중입니다.");
      return;
    }
    
    console.log("결제 요청 시작", currentOrder);
    paymentProcessed.current = true;
    
    const totalAmount = 
      Number(currentOrder.totalAmount || 0) + 
      Number(currentOrder.shippingFee || 0) - 
      Number(currentOrder.discountAmount || 0);
    
    // 결제 데이터 구성
    const paymentData = {
      pg: 'tosspayments',                         // PG사 (테스트 모드 아님)
      pay_method: 'card',                         // 결제 수단
      merchant_uid: currentOrder.orderNumber,     // 주문번호
      name: `주문번호: ${currentOrder.orderNumber}`, // 주문명
      amount: totalAmount || 1000,                // 결제 금액
      buyer_email: currentOrder.email || 'test@example.com',
      buyer_name: currentOrder.recipientName || '테스트 구매자',
      buyer_tel: currentOrder.phone || '010-0000-0000',
      buyer_addr: `${currentOrder.address1 || ''} ${currentOrder.address2 || ''}`,
      buyer_postcode: currentOrder.postalCode || '00000',
      m_redirect_url: `${window.location.origin}/order/complete/${orderId}`, // 모바일 환경
    };
    
    console.log("결제 요청 데이터:", paymentData);
    
    try {
      // 결제 창 호출
      window.IMP.request_pay(paymentData, handlePaymentResult);
    } catch (error) {
      console.error("결제 요청 에러:", error);
      alert(`결제 요청 중 오류가 발생했습니다: ${error.message}`);
      paymentProcessed.current = false;
    }
  };
  
  // 결제 결과 처리
  const handlePaymentResult = (response) => {
    console.log("결제 결과:", response);
    const { success, error_msg, imp_uid, merchant_uid } = response;
    
    if (success) {
      try {
        // 백엔드 검증 요청
        verifyPayment({
          impUid: imp_uid,
          orderId: Number(orderId),
          amount: totalAmount
        }).then(() => {
          alert('결제가 완료되었습니다.');
          navigate(`/order/complete/${orderId}`);
        }).catch((error) => {
          console.error('결제 검증 실패:', error);
          alert('결제 검증에 실패했습니다. 고객센터로 문의해주세요.');
        });
      } catch (error) {
        console.error('결제 검증 요청 실패:', error);
        alert('결제 검증에 실패했습니다. 고객센터로 문의해주세요.');
      }
    } else {
      // 결제 실패 처리
      console.error('결제 실패:', error_msg);
      alert(`결제에 실패했습니다: ${error_msg}`);
      paymentProcessed.current = false;
    }
  };
  
  // 총 결제 금액 계산
  const totalAmount = currentOrder ? 
    Number(currentOrder.totalAmount || 0) + 
    Number(currentOrder.shippingFee || 0) - 
    Number(currentOrder.discountAmount || 0) : 0;
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full mb-4" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-gray-600">주문 정보를 불러오는 중입니다...</p>
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
        <button
          onClick={() => navigate('/checkout')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          주문 페이지로 돌아가기
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">결제 정보</h1>
        
        {currentOrder && (
          <div className="mb-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">주문 정보</h2>
              <p><span className="font-medium">주문번호:</span> {currentOrder.orderNumber}</p>
              <p><span className="font-medium">주문자:</span> {currentOrder.recipientName}</p>
              <p><span className="font-medium">연락처:</span> {currentOrder.phone}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <h2 className="text-lg font-semibold mb-2">결제 금액</h2>
              <div className="flex justify-between mb-2">
                <span>상품 금액</span>
                <span>{Number(currentOrder.totalAmount || 0).toLocaleString()}원</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>배송비</span>
                <span>{Number(currentOrder.shippingFee || 0).toLocaleString()}원</span>
              </div>
              {currentOrder.discountAmount > 0 && (
                <div className="flex justify-between mb-2">
                  <span>할인 금액</span>
                  <span>- {Number(currentOrder.discountAmount || 0).toLocaleString()}원</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 mt-2">
                <span>총 결제 금액</span>
                <span>{totalAmount.toLocaleString()}원</span>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">배송지 정보</h2>
              <p>{currentOrder.recipientName} ({currentOrder.recipientPhone})</p>
              <p>{currentOrder.postalCode} {currentOrder.address1} {currentOrder.address2}</p>
            </div>
          </div>
        )}
        
        <div className="flex flex-col gap-3">
          <button
            onClick={requestPayment}
            disabled={!scriptLoaded || !currentOrder}
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            결제하기
          </button>
          
          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
          >
            주문 페이지로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;