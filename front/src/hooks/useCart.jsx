import { use, useCallback, useEffect, useRef } from 'react';
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

  // const fetchedRef = useRef(false);
  // // 컴포넌트 마운트 시 장바구니 정보 로드 (한 번만)
  // useEffect(() => {
  //   if (!fetchedRef.current && !loading && items.length === 0 && !error) {
  //     fetchedRef.current = true;
  //     dispatch(fetchCart());
  //   }
  // }, [dispatch, loading, items.length, error]);

  // 장바구니 상품 조회
  const getCart = useCallback(() => {
    return dispatch(fetchCart());
  }, [dispatch]);

  // 장바구니에 상품 추가
  const addItemToCart = useCallback((productVariantId, quantity = 1) => {
    dispatch(addToCart({ productVariantId, quantity }));
  },[dispatch]);

  // 장바구니 아이템 수량 변경
  const updateItem = useCallback((itemId, quantity) => {
    dispatch(updateCartItem({ itemId, quantity }));
  },[dispatch]);

  // 장바구니 아이템 삭제
  const removeItem = useCallback((itemId) => {
    dispatch(removeCartItem(itemId));
  },[dispatch]);

  // 장바구니 비우기
  const emptyCart = useCallback(() => {
    dispatch(clearCart());
  },[dispatch]);

  // 에러 초기화
  const resetError = useCallback(() => {
    dispatch(clearError());
  },[dispatch]);

  return {
    //상태
    cartItems: items,
    itemCount,
    subtotal,
    loading,
    error,

    //액션
    getCart,
    addItemToCart,
    updateItem,
    removeItem,
    emptyCart,
    resetError
  };
};

export default useCart;