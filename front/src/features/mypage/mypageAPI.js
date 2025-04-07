import { apiClient } from '../../services/api/client';
import { API_ENDPOINTS } from '../../services/api/endpoints';

export const mypageAPI = {
  /**
   * 사용자 프로필 조회 API
   * @returns {Promise} - API 응답
   */
  getProfile: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.PROFILE);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '프로필 조회 중 오류가 발생했습니다.' };
    }
  },
  
  /**
   * 사용자 프로필 수정 API
   * @param {Object} profileData - 수정할 프로필 데이터
   * @returns {Promise} - API 응답
   */
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.USERS.UPDATE_PROFILE, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '프로필 수정 중 오류가 발생했습니다.' };
    }
  },
  
  /**
   * 사용자 주문 목록 조회 API
   * @param {number} page - 페이지 번호
   * @param {number} limit - 페이지당 아이템 수
   * @param {string} status - 주문 상태 필터
   * @returns {Promise} - API 응답
   */
  getOrders: async (page = 1, limit = 10, status) => {
    try {
      const params = { page, limit };
      if (status) params.status = status;
      
      const response = await apiClient.get(API_ENDPOINTS.ORDERS.GET_USER_ORDERS, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '주문 목록 조회 중 오류가 발생했습니다.' };
    }
  },
  
  /**
   * 주문 상세 조회 API
   * @param {number} orderId - 주문 ID
   * @returns {Promise} - API 응답
   */
  getOrderDetail: async (orderId) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ORDERS.GET_BY_ID(orderId));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '주문 상세 조회 중 오류가 발생했습니다.' };
    }
  },
  
  /**
   * 주문 배송 상태 조회 API
   * @param {number} orderId - 주문 ID
   * @returns {Promise} - API 응답
   */
  getOrderTracking: async (orderId) => {
    try {
      const response = await apiClient.get(`/tracking/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '배송 상태 조회 중 오류가 발생했습니다.' };
    }
  },
  
  /**
   * 위시리스트 조회 API
   * @param {number} page - 페이지 번호
   * @param {number} limit - 페이지당 아이템 수
   * @returns {Promise} - API 응답
   */
  getWishlist: async (page = 1, limit = 10) => {
    try {
      const response = await apiClient.get('/wishlist', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '위시리스트 조회 중 오류가 발생했습니다.' };
    }
  },
  
  /**
   * 위시리스트 아이템 삭제 API
   * @param {number} wishlistItemId - 위시리스트 아이템 ID
   * @returns {Promise} - API 응답
   */
  removeWishlistItem: async (wishlistItemId) => {
    try {
      const response = await apiClient.delete(`/wishlist/${wishlistItemId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '위시리스트 아이템 삭제 중 오류가 발생했습니다.' };
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
 * 위시리스트에 상품 추가 API
 * @param {number} productId - 추가할 상품 ID
 * @returns {Promise} - API 응답
 */
addToWishlist: async (productId) => {
  try {
    const response = await apiClient.post('/wishlist', {
      productId
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: '위시리스트 추가 중 오류가 발생했습니다.' };
  }
},

/**
 * 위시리스트 상품 확인 API
 * @param {number} productId - 확인할 상품 ID
 * @returns {Promise} - API 응답
 */
checkWishlistItem: async (productId) => {
  try {
    const response = await apiClient.get(`/wishlist/check/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: '위시리스트 확인 중 오류가 발생했습니다.' };
  }
},

/**
 * 위시리스트에서 상품 제거 API
 * @param {number} productId - 제거할 상품 ID
 * @returns {Promise} - API 응답
 */
removeProductFromWishlist: async (productId) => {
  try {
    const response = await apiClient.delete(`/wishlist/product/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: '위시리스트 삭제 중 오류가 발생했습니다.' };
  }
}
};