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
      
      // 상품 변형 정보 조회
      try {
        const variantsResponse = await apiClient.get(`/products/${numericId}/variants`);
        
        // 원본 응답에 변형 정보 추가
        if (response.data && response.data.data) {
          response.data.data.variants = variantsResponse.data.data || [];
        }
      } catch (variantError) {
        console.error('상품 변형 조회 에러:', variantError);
        // 변형 조회에 실패해도 기본 상품 정보는 반환
      }
      
      return response.data;
    } catch (error) {
      console.error('상품 상세 조회 에러:', error);
      throw error.response?.data || { message: '상품 상세 조회 중 오류가 발생했습니다.' };
    }
  },
  
  /**
   * 상품 변형 조회 API
   * @param {number} productId - 상품 ID
   * @returns {Promise} - API 응답
   */
  getProductVariants: async (productId) => {
    try {
      const response = await apiClient.get(`/products/${productId}/variants`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '상품 변형 조회 중 오류가 발생했습니다.' };
    }
  }
};