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
   * 주문 목록 조회 API
   * @param {Object} params - 쿼리 파라미터
   * @returns {Promise} - API 응답
   */
  getOrders: async (params) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ORDERS.LIST, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '주문 목록 조회 중 오류가 발생했습니다.' };
    }
  },
  
  /**
   * 주문 상세 조회 API
   * @param {number} id - 주문 ID
   * @returns {Promise} - API 응답
   */
  getOrderById: async (id) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ORDERS.DETAIL(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '주문 상세 조회 중 오류가 발생했습니다.' };
    }
  },
  
  /**
   * 주문 취소 API
   * @param {number} id - 주문 ID
   * @returns {Promise} - API 응답
   */
  cancelOrder: async (id) => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.ORDERS.CANCEL(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '주문 취소 중 오류가 발생했습니다.' };
    }
  },
  
  /**
   * 결제 검증 API
   * @param {Object} paymentData - 결제 데이터
   * @returns {Promise} - API 응답
   */
  verifyPayment: async (paymentData) => {
    try {
      const response = await apiClient.post('/payments/portone/verify', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '결제 검증 중 오류가 발생했습니다.' };
    }
  }
};