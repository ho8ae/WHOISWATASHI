import React from 'react';
import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';

const CartSummary = () => {
  const { cartItems, subtotal } = useCart();
  
  // 배송비 계산 (10만원 이상 구매 시 무료배송)
  const shippingFee = subtotal >= 100000 ? 0 : 3000;
  
  // 주문 총액
  const totalAmount = subtotal + shippingFee;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">주문 요약</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between py-2 border-b">
          <span className="text-gray-600">상품 금액</span>
          <span className="font-medium">{subtotal.toLocaleString()}원</span>
        </div>
        
        <div className="flex justify-between py-2 border-b">
          <span className="text-gray-600">배송비</span>
          <span className="font-medium">
            {shippingFee === 0 ? '무료' : `${shippingFee.toLocaleString()}원`}
          </span>
        </div>
        
        <div className="flex justify-between py-4">
          <span className="text-gray-900 font-medium">총 주문금액</span>
          <span className="text-xl font-semibold text-blue-600">
            {totalAmount.toLocaleString()}원
          </span>
        </div>
      </div>
      
      <Link
        to="/checkout"
        className={`mt-6 w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={cartItems.length === 0}
      >
        {cartItems.length === 0 ? '상품을 담아주세요' : '주문하기'}
      </Link>
      
      {subtotal < 100000 && subtotal > 0 && (
        <p className="mt-4 text-sm text-gray-500 text-center">
          {(100000 - subtotal).toLocaleString()}원 더 구매 시 무료배송
        </p>
      )}
      
      <div className="mt-6">
        <Link
          to="/products"
          className="text-blue-600 hover:text-blue-800 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          쇼핑 계속하기
        </Link>
      </div>
    </div>
  );
};

export default CartSummary;