import { apiClient } from '../../services/api/client';
import { API_ENDPOINTS } from '../../services/api/endpoints';

export const cartAPI = {
  /**
   * 장바구니 조회 API
   * @returns {Promise} - API 응답
   */
  getCart: async () => {
    try {
      // 쿠키는 apiClient 설정에서 자동으로 전송됨
      const response = await apiClient.get(API_ENDPOINTS.CART.GET);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '장바구니 조회 중 오류가 발생했습니다.' };
    }
  },
  
  /**
   * 장바구니에 상품 추가 API
   * @param {number} productVariantId - 상품 변형 ID
   * @param {number} quantity - 수량
   * @returns {Promise} - API 응답
   */
  addToCart: async (productVariantId, quantity) => {
    try {
      // 정수형으로 확실하게 변환
      const numericVariantId = parseInt(productVariantId, 10);
      if (isNaN(numericVariantId) || numericVariantId <= 0) {
        throw { message: '유효하지 않은 상품 ID입니다.' };
      }
      
      const response = await apiClient.post(API_ENDPOINTS.CART.ADD, {
        productVariantId: numericVariantId, // 정수형으로 보내기
        quantity: parseInt(quantity, 10)
      });
      
      return response.data;
    } catch (error) {
      console.error('장바구니 추가 에러:', error);
      throw error.response?.data || { message: '장바구니 추가 중 오류가 발생했습니다.' };
    }
  },
  
  /**
   * 장바구니 아이템 수량 변경 API
   * @param {number} itemId - 장바구니 아이템 ID
   * @param {number} quantity - 변경할 수량
   * @returns {Promise} - API 응답
   */
  updateCartItem: async (itemId, quantity) => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.CART.UPDATE(itemId), {
        quantity
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '장바구니 아이템 수정 중 오류가 발생했습니다.' };
    }
  },
  
  /**
   * 장바구니 아이템 삭제 API
   * @param {number} itemId - 장바구니 아이템 ID
   * @returns {Promise} - API 응답
   */
  removeCartItem: async (itemId) => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.CART.REMOVE(itemId));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '장바구니 아이템 삭제 중 오류가 발생했습니다.' };
    }
  },
  
  /**
   * 장바구니 비우기 API
   * @returns {Promise} - API 응답
   */
  clearCart: async () => {
    try {
      const response = await apiClient.delete('/cart/clear');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '장바구니 비우기 중 오류가 발생했습니다.' };
    }
  }
};