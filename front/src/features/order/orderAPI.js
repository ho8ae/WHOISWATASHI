import { apiClient } from '../../services/api/client';
import { API_ENDPOINTS } from '../../services/api/endpoints';

export const orderAPI = {
  /**
   * 주문 생성 API
   * @param {Object} orderData - 주문 데이터
   * @returns {Promise} - API 응답
   */
  createOrder: async (orderData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ORDERS.CREATE, orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '주문 생성 중 오류가 발생했습니다.' };
    }
  },

  /**
   * 주문 상세 조회 API
   * @param {number} orderId - 주문 ID
   * @returns {Promise} - API 응답
   */
  getOrderById: async (orderId) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ORDERS.GET_BY_ID(orderId));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '주문 조회 중 오류가 발생했습니다.' };
    }
  },

  /**
   * 사용자 주문 목록 조회 API
   * @param {Object} params - 조회 파라미터
   * @returns {Promise} - API 응답
   */
  getUserOrders: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ORDER.GET_USER_ORDERS, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '주문 목록 조회 중 오류가 발생했습니다.' };
    }
  },

  /**
   * 비회원 주문 조회 API
   * @param {Object} data - 주문번호와 비밀번호
   * @returns {Promise} - API 응답
   */
  getGuestOrder: async (data) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ORDER.GET_GUEST_ORDER, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '비회원 주문 조회 중 오류가 발생했습니다.' };
    }
  },

  /**
   * 주문 취소 API
   * @param {number} orderId - 주문 ID
   * @returns {Promise} - API 응답
   */
  cancelOrder: async (orderId) => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.ORDERS.CANCEL(orderId));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '주문 취소 중 오류가 발생했습니다.' };
    }
  },

  /**
   * 포트원 결제 검증 API
   * @param {Object} paymentData - 결제 데이터
   * @returns {Promise} - API 응답
   */
  verifyPortOnePayment: async (paymentData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.PAYMENT.VERIFY_PORTONE, paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '결제 검증 중 오류가 발생했습니다.' };
    }
  }
};