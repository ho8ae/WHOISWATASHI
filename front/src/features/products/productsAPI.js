// features/products/productsAPI.js
import { apiClient } from '../../services/api/client';
import { API_ENDPOINTS } from '../../services/api/endpoints';

export const productsAPI = {
  /**
   * 상품 목록 조회 API
   * @param {Object} params - 쿼리 파라미터 (페이지, 정렬, 필터링 등)
   * @returns {Promise} - API 응답
   */
  getProducts: async (params) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.LIST, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '상품 목록 조회 중 오류가 발생했습니다.' };
    }
  },
  
  /**
   * 상품 상세 조회 API
   * @param {number} id - 상품 ID
   * @returns {Promise} - API 응답
   */
  getProductById: async (id) => {
    try {
      // id 파라미터 검증
      if (!id) {
        throw new Error('상품 ID가 필요합니다.');
      }
      
      // 숫자형으로 변환
      const numericId = Number(id);
      if (isNaN(numericId)) {
        throw new Error('유효하지 않은 상품 ID 형식입니다.');
      }
      
      console.log(`API 호출: 상품 ID=${numericId}`);
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.DETAIL(numericId));
      return response.data;
    } catch (error) {
      console.error('상품 상세 조회 에러:', error);
      throw error.response?.data || { message: '상품 상세 조회 중 오류가 발생했습니다.' };
    }
  },
  
  /**
   * 카테고리 목록 조회 API
   * @returns {Promise} - API 응답
   */
  getCategories: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.CATEGORIES);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '카테고리 목록 조회 중 오류가 발생했습니다.' };
    }
  }
};