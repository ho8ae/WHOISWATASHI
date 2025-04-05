import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCart, 
  addToCart, 
  updateCartItem, 
  removeCartItem, 
  clearCart,
  clearError
} from '../features/cart/cartSlice';

/**
 * 장바구니 관련 커스텀 훅
 * @returns {Object} 장바구니 관련 상태 및 액션들
 */
const useCart = () => {
  const dispatch = useDispatch();
  
  // cart 상태 가져오기
  const { items, itemCount, subtotal, loading, error } = useSelector((state) => state.cart);

  // 컴포넌트 마운트 시 장바구니 정보 로드
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // 장바구니에 상품 추가
  const addItemToCart = (productVariantId, quantity = 1) => {
    dispatch(addToCart({ productVariantId, quantity }));
  };

  // 장바구니 아이템 수량 변경
  const updateItem = (itemId, quantity) => {
    dispatch(updateCartItem({ itemId, quantity }));
  };

  // 장바구니 아이템 삭제
  const removeItem = (itemId) => {
    dispatch(removeCartItem(itemId));
  };

  // 장바구니 비우기
  const emptyCart = () => {
    dispatch(clearCart());
  };

  // 에러 초기화
  const resetError = () => {
    dispatch(clearError());
  };

  return {
    cartItems: items,
    itemCount,
    subtotal,
    loading,
    error,
    fetchCart: () => dispatch(fetchCart()),
    addToCart: addItemToCart,
    updateCartItem: updateItem,
    removeCartItem: removeItem,
    clearCart: emptyCart,
    resetError
  };
};

export default useCart;