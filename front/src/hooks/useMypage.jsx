import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProfile,
  updateProfile,
  fetchOrders,
  fetchOrderDetail,
  fetchOrderTracking,
  fetchWishlist,
  removeWishlistItem,
  cancelOrder,
  addToWishlist,
  checkWishlistItem,
  removeProductFromWishlist,
  clearProfileError,
  clearOrdersError,
  clearOrderDetailError,
  clearOrderTrackingError,
  clearWishlistError
} from '../features/mypage/mypageSlice';

/**
 * 마이페이지 관련 커스텀 훅
 * @returns {Object} 마이페이지 관련 상태 및 액션들
 */
const useMypage = () => {
  const dispatch = useDispatch();
  
  // mypage 상태 가져오기
  const {
    profile,
    orders,
    selectedOrder,
    orderTracking,
    wishlist,
    productInWishlist,
    loading,
    error
  } = useSelector((state) => state.mypage || {});

  // 프로필 조회
  const getProfile = useCallback(() => {
    return dispatch(fetchProfile());
  }, [dispatch]);

  // 프로필 수정
  const updateUserProfile = useCallback((profileData) => {
    return dispatch(updateProfile(profileData));
  }, [dispatch]);

  // 주문 목록 조회
  const getUserOrders = useCallback((page = 1, limit = 10, status) => {
    return dispatch(fetchOrders({ page, limit, status }));
  }, [dispatch]);

  // 주문 상세 조회
  const getOrderDetail = useCallback((orderId) => {
    return dispatch(fetchOrderDetail(orderId));
  }, [dispatch]);

  // 주문 배송 상태 조회
  const getOrderTracking = useCallback((orderId) => {
    return dispatch(fetchOrderTracking(orderId));
  }, [dispatch]);

  // 위시리스트 조회
  const getUserWishlist = useCallback((page = 1, limit = 10) => {
    return dispatch(fetchWishlist({ page, limit }));
  }, [dispatch]);

  // 위시리스트 아이템 삭제
  const deleteWishlistItem = useCallback((wishlistItemId) => {
    return dispatch(removeWishlistItem(wishlistItemId));
  }, [dispatch]);

  // 주문 취소
  const cancelUserOrder = useCallback((orderId) => {
    return dispatch(cancelOrder(orderId));
  }, [dispatch]);

  // 위시리스트에 상품 추가
  const addProductToWishlist = useCallback((productId) => {
    return dispatch(addToWishlist(productId));
  }, [dispatch]);

  // 위시리스트에 상품이 있는지 확인
  const checkProductInWishlist = useCallback((productId) => {
    return dispatch(checkWishlistItem(productId));
  }, [dispatch]);

  // 위시리스트에서 상품 삭제
  const removeProductFromWishlistById = useCallback((productId) => {
    return dispatch(removeProductFromWishlist(productId));
  }, [dispatch]);

  // 에러 초기화 함수들
  const resetProfileError = useCallback(() => {
    dispatch(clearProfileError());
  }, [dispatch]);

  const resetOrdersError = useCallback(() => {
    dispatch(clearOrdersError());
  }, [dispatch]);

  const resetOrderDetailError = useCallback(() => {
    dispatch(clearOrderDetailError());
  }, [dispatch]);

  const resetOrderTrackingError = useCallback(() => {
    dispatch(clearOrderTrackingError());
  }, [dispatch]);

  const resetWishlistError = useCallback(() => {
    dispatch(clearWishlistError());
  }, [dispatch]);

  return {
    // 상태
    profile,
    orders: orders?.items || [],
    ordersPagination: orders?.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 },
    selectedOrder,
    orderTracking,
    wishlist: wishlist?.items || [],
    wishlistPagination: wishlist?.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 },
    productInWishlist: productInWishlist || false,
    loading: loading || {},
    error: error || {},

    // 액션
    getProfile,
    updateUserProfile,
    getUserOrders,
    getOrderDetail,
    getOrderTracking,
    getUserWishlist,
    deleteWishlistItem,
    cancelUserOrder,
    
    // 위시리스트 상품 관련 액션
    addProductToWishlist,
    checkProductInWishlist,
    removeProductFromWishlistById,
    
    // 에러 초기화
    resetProfileError,
    resetOrdersError,
    resetOrderDetailError,
    resetOrderTrackingError,
    resetWishlistError
  };
};

export default useMypage;