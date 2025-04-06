import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createOrder,
  fetchOrderById,
  fetchUserOrders,
  fetchGuestOrder,
  cancelOrder,
  verifyPortOnePayment,
  clearError,
  resetOrderCreated,
  resetPaymentResult
} from '../features/order/orderSlice';

/**
 * 주문 관련 커스텀 훅
 * @returns {Object} 주문 관련 상태 및 액션들
 */
const useOrder = () => {
  const dispatch = useDispatch();
  
  // 상태 가져오기
  const {
    currentOrder,
    orderList,
    pagination,
    loading,
    error,
    paymentResult,
    orderCreated
  } = useSelector((state) => state.order);

  // 컴포넌트 언마운트 시 에러 초기화
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // 주문 생성
  const submitOrder = useCallback((orderData) => {
    return dispatch(createOrder(orderData)).unwrap();
  },[dispatch]);

  // 주문 상세 조회
  const getOrderById = useCallback((orderId) => {
    dispatch(fetchOrderById(orderId));
  }, [dispatch]);

  // 사용자 주문 목록 조회
  const getUserOrders = useCallback((params = {}) => {
    dispatch(fetchUserOrders(params));
  },[dispatch]);

  // 비회원 주문 조회
  const getGuestOrder = useCallback((orderNumber, password) => {
    dispatch(fetchGuestOrder({ orderNumber, password }));
  }, [dispatch]);

  // 주문 취소
  const cancelUserOrder = useCallback((orderId) => {
    return dispatch(cancelOrder(orderId)).unwrap();
  }, [dispatch]);

  // 포트원 결제 검증
  const verifyPayment = useCallback((paymentData) => {
    return dispatch(verifyPortOnePayment(paymentData)).unwrap();
  }, [dispatch]);

  // 주문 생성 상태 초기화
  const resetOrder = useCallback(() => {
    dispatch(resetOrderCreated());
  }, [dispatch]);

  // 결제 결과 초기화
  const resetPayment = useCallback(() => {
    dispatch(resetPaymentResult());
  },[dispatch]);

  return {
    currentOrder,
    orderList,
    pagination,
    loading,
    error,
    paymentResult,
    orderCreated,

    submitOrder,
    getOrderById,
    getUserOrders,
    getGuestOrder,
    cancelUserOrder,
    verifyPayment,
    resetOrder,
    resetPayment,
    clearOrderError: () => dispatch(clearError())
  };
};

export default useOrder;