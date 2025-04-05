import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useCart from '../hooks/useCart';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';

const Cart = () => {
  const { cartItems, itemCount, loading, error, fetchCart, clearCart } = useCart();

  // 컴포넌트 마운트 시 장바구니 데이터 로드
  useEffect(() => {
    fetchCart();
  }, []);

  // 로딩 상태
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">장바구니</h1>
        <div className="flex justify-center items-center h-64">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">장바구니</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>오류가 발생했습니다: {error}</p>
          <button 
            onClick={fetchCart}
            className="mt-2 bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">장바구니</h1>
      
      {cartItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-gray-600 mb-6">장바구니가 비어있습니다.</p>
          <Link
            to="/products"
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
          >
            쇼핑 시작하기
          </Link>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          {/* 장바구니 상품 목록 */}
          <div className="md:w-2/3">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 flex justify-between border-b">
                <h2 className="text-lg font-medium text-gray-900">
                  상품 목록 ({itemCount}개)
                </h2>
                <button
                  onClick={clearCart}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  장바구니 비우기
                </button>
              </div>
              
              <div className="divide-y divide-gray-200 px-6">
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
          
          {/* 주문 요약 */}
          <div className="md:w-1/3">
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;