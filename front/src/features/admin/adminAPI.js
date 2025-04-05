import { apiClient } from '../../services/api/client';
import { API_ENDPOINTS } from '../../services/api/endpoints';

export const adminAPI = {
  /**
   * 대시보드 데이터 조회
   * @returns {Promise} - API 응답
   */
  getDashboard: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.DASHBOARD);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: '대시보드 데이터 조회 중 오류가 발생했습니다.',
        }
      );
    }
  },

  // 사용자 관련 API
  users: {
    /**
     * 사용자 목록 조회
     * @param {Object} params - 검색, 필터링, 페이지네이션 파라미터
     * @returns {Promise} - API 응답
     */
    getUsers: async (params = {}) => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.ADMIN.USERS.LIST, {
          params,
        });
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '사용자 목록 조회 중 오류가 발생했습니다.',
          }
        );
      }
    },

    /**
     * 사용자 상세 정보 조회
     * @param {number} userId - 사용자 ID
     * @returns {Promise} - API 응답
     */
    getUserDetail: async (userId) => {
      try {
        const response = await apiClient.get(
          API_ENDPOINTS.ADMIN.USERS.DETAIL(userId),
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '사용자 상세 정보 조회 중 오류가 발생했습니다.',
          }
        );
      }
    },

    /**
     * 사용자 역할 변경
     * @param {number} userId - 사용자 ID
     * @param {string} role - 변경할 역할
     * @returns {Promise} - API 응답
     */
    updateUserRole: async (userId, role) => {
      try {
        const response = await apiClient.patch(
          API_ENDPOINTS.ADMIN.USERS.UPDATE_ROLE(userId),
          { role },
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '사용자 역할 변경 중 오류가 발생했습니다.',
          }
        );
      }
    },
  },

  // 상품 관련 API
  products: {
    /**
     * 상품 목록 조회
     * @param {Object} params - 검색, 필터링, 페이지네이션 파라미터
     * @returns {Promise} - API 응답
     */
    getProducts: async (params = {}) => {
      try {
        const response = await apiClient.get(
          API_ENDPOINTS.ADMIN.PRODUCTS.LIST,
          { params },
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '상품 목록 조회 중 오류가 발생했습니다.',
          }
        );
      }
    },

    /**
     * 상품 상세 조회
     * @param {number} productId - 상품 ID
     * @returns {Promise} - API 응답
     */
    getProductDetail: async (productId) => {
      try {
        const response = await apiClient.get(
          API_ENDPOINTS.ADMIN.PRODUCTS.DETAIL(productId),
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '상품 상세 조회 중 오류가 발생했습니다.',
          }
        );
      }
    },

    /**
     * 상품 생성
     * @param {Object} productData - 상품 데이터
     * @returns {Promise} - API 응답
     */
    createProduct: async (productData) => {
      try {
        const response = await apiClient.post(
          API_ENDPOINTS.ADMIN.PRODUCTS.CREATE,
          productData,
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '상품 생성 중 오류가 발생했습니다.',
          }
        );
      }
    },

    /**
     * 상품 수정
     * @param {number} productId - 상품 ID
     * @param {Object} productData - 수정할 상품 데이터
     * @returns {Promise} - API 응답
     */
    updateProduct: async (productId, productData) => {
      try {
        const response = await apiClient.put(
          API_ENDPOINTS.ADMIN.PRODUCTS.UPDATE(productId),
          productData,
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '상품 수정 중 오류가 발생했습니다.',
          }
        );
      }
    },

    /**
     * 상품 삭제
     * @param {number} productId - 상품 ID
     * @returns {Promise} - API 응답
     */
    deleteProduct: async (productId) => {
      try {
        const response = await apiClient.delete(
          API_ENDPOINTS.ADMIN.PRODUCTS.DELETE(productId),
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '상품 삭제 중 오류가 발생했습니다.',
          }
        );
      }
    },

    /**
     * 품절 상품 목록 조회
     * @returns {Promise} - API 응답
     */
    getOutOfStockProducts: async () => {
      try {
        const response = await apiClient.get(
          API_ENDPOINTS.ADMIN.PRODUCTS.OUT_OF_STOCK,
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '품절 상품 목록 조회 중 오류가 발생했습니다.',
          }
        );
      }
    },

    /**
     * 상품 재고 업데이트
     * @param {number} variantId - 상품 변형 ID
     * @param {number} stock - 업데이트할 재고 수량
     * @returns {Promise} - API 응답
     */
    updateStock: async (variantId, stock) => {
      try {
        const response = await apiClient.patch(
          API_ENDPOINTS.ADMIN.PRODUCTS.UPDATE_STOCK(variantId),
          { stock },
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '상품 재고 업데이트 중 오류가 발생했습니다.',
          }
        );
      }
    },
    /**
     * 상품 변형 생성
     * @param {number} productId - 상품 ID
     * @param {Object} variantData - 변형 데이터
     * @returns {Promise} - API 응답
     */
    createProductVariant: async (productId, variantData) => {
      try {
        const response = await apiClient.post(
          `/products/${productId}/variants`,
          variantData,
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '상품 변형 생성 중 오류가 발생했습니다.',
          }
        );
      }
    },

    /**
     * 상품의 모든 변형 조회
     * @param {number} productId - 상품 ID
     * @returns {Promise} - API 응답
     */
    getAllProductVariants: async (productId) => {
      try {
        const response = await apiClient.get(
          API_ENDPOINTS.PRODUCTS.VARIANTS(productId),
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '상품 변형 목록 조회 중 오류가 발생했습니다.',
          }
        );
      }
    },
    /**
     * 상품의 모든 변형(옵션) 조회 - getProductVariants 별칭
     * @param {number} productId - 상품 ID
     * @returns {Promise} - API 응답
     */
    getProductVariants: async (productId) => {
      try {
        const response = await apiClient.get(`/products/variants/${productId}`);
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '상품 변형 목록 조회 중 오류가 발생했습니다.',
          }
        );
      }
    },

    /**
     * 상품 변형 수정
     * @param {number} variantId - 상품 변형 ID
     * @param {Object} variantData - 변형 데이터
     * @returns {Promise} - API 응답
     */
    updateProductVariant: async (variantId, variantData) => {
      try {
        const response = await apiClient.put(
          `/products/variants/${variantId}`,
          variantData,
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '상품 변형 수정 중 오류가 발생했습니다.',
          }
        );
      }
    },
  },

  // 주문 관련 API
  orders: {
    /**
     * 주문 목록 조회
     * @param {Object} params - 검색, 필터링, 페이지네이션 파라미터
     * @returns {Promise} - API 응답
     */
    getOrders: async (params = {}) => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.ADMIN.ORDERS.LIST, {
          params,
        });
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '주문 목록 조회 중 오류가 발생했습니다.',
          }
        );
      }
    },

    /**
     * 주문 상세 조회
     * @param {number} orderId - 주문 ID
     * @returns {Promise} - API 응답
     */
    getOrderDetail: async (orderId) => {
      try {
        const response = await apiClient.get(
          API_ENDPOINTS.ADMIN.ORDERS.DETAIL(orderId),
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '주문 상세 조회 중 오류가 발생했습니다.',
          }
        );
      }
    },

    /**
     * 주문 상태 및 배송 정보 업데이트
     * @param {number} orderId - 주문 ID
     * @param {Object} orderData - 업데이트할 주문 데이터
     * @returns {Promise} - API 응답
     */
    updateOrder: async (orderId, orderData) => {
      try {
        const response = await apiClient.patch(
          API_ENDPOINTS.ADMIN.ORDERS.UPDATE(orderId),
          orderData,
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '주문 업데이트 중 오류가 발생했습니다.',
          }
        );
      }
    },
  },

  // 카테고리 관련 API
  categories: {
    /**
     * 카테고리 목록 조회
     * @returns {Promise} - API 응답
     */
    getCategories: async () => {
      try {
        const response = await apiClient.get(
          API_ENDPOINTS.ADMIN.CATEGORIES.LIST,
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '카테고리 목록 조회 중 오류가 발생했습니다.',
          }
        );
      }
    },

    /**
     * 카테고리 상세 조회
     * @param {number} categoryId - 카테고리 ID
     * @returns {Promise} - API 응답
     */
    getCategoryDetail: async (categoryId) => {
      try {
        const response = await apiClient.get(
          API_ENDPOINTS.ADMIN.CATEGORIES.DETAIL(categoryId),
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '카테고리 상세 조회 중 오류가 발생했습니다.',
          }
        );
      }
    },

    /**
     * 카테고리 생성
     * @param {Object} categoryData - 카테고리 데이터
     * @returns {Promise} - API 응답
     */
    createCategory: async (categoryData) => {
      try {
        const response = await apiClient.post(
          API_ENDPOINTS.ADMIN.CATEGORIES.CREATE,
          categoryData,
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '카테고리 생성 중 오류가 발생했습니다.',
          }
        );
      }
    },

    /**
     * 카테고리 수정
     * @param {number} categoryId - 카테고리 ID
     * @param {Object} categoryData - 수정할 카테고리 데이터
     * @returns {Promise} - API 응답
     */
    updateCategory: async (categoryId, categoryData) => {
      try {
        const response = await apiClient.put(
          API_ENDPOINTS.ADMIN.CATEGORIES.UPDATE(categoryId),
          categoryData,
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '카테고리 수정 중 오류가 발생했습니다.',
          }
        );
      }
    },

    /**
     * 카테고리 삭제
     * @param {number} categoryId - 카테고리 ID
     * @returns {Promise} - API 응답
     */
    deleteCategory: async (categoryId) => {
      try {
        const response = await apiClient.delete(
          API_ENDPOINTS.ADMIN.CATEGORIES.DELETE(categoryId),
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '카테고리 삭제 중 오류가 발생했습니다.',
          }
        );
      }
    },
  },

  // 옵션 타입 관련 API
  optionTypes: {
    /**
     * 옵션 타입 목록 조회
     * @returns {Promise} - API 응답
     */
    getOptionTypes: async () => {
      try {
        const response = await apiClient.get(
          API_ENDPOINTS.ADMIN.OPTION_TYPES.LIST,
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '옵션 타입 목록 조회 중 오류가 발생했습니다.',
          }
        );
      }
    },

    /**
     * 옵션 타입 상세 조회
     * @param {number} optionTypeId - 옵션 타입 ID
     * @returns {Promise} - API 응답
     */
    getOptionTypeDetail: async (optionTypeId) => {
      try {
        const response = await apiClient.get(
          API_ENDPOINTS.ADMIN.OPTION_TYPES.DETAIL(optionTypeId),
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '옵션 타입 상세 조회 중 오류가 발생했습니다.',
          }
        );
      }
    },

    /**
     * 옵션 타입 생성
     * @param {Object} optionTypeData - 옵션 타입 데이터
     * @returns {Promise} - API 응답
     */
    createOptionType: async (optionTypeData) => {
      try {
        const response = await apiClient.post(
          API_ENDPOINTS.ADMIN.OPTION_TYPES.CREATE,
          optionTypeData,
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '옵션 타입 생성 중 오류가 발생했습니다.',
          }
        );
      }
    },

    /**
     * 옵션 타입 수정
     * @param {number} optionTypeId - 옵션 타입 ID
     * @param {Object} optionTypeData - 수정할 옵션 타입 데이터
     * @returns {Promise} - API 응답
     */
    updateOptionType: async (optionTypeId, optionTypeData) => {
      try {
        const response = await apiClient.put(
          API_ENDPOINTS.ADMIN.OPTION_TYPES.UPDATE(optionTypeId),
          optionTypeData,
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '옵션 타입 수정 중 오류가 발생했습니다.',
          }
        );
      }
    },

    /**
     * 옵션 타입 삭제
     * @param {number} optionTypeId - 옵션 타입 ID
     * @returns {Promise} - API 응답
     */
    deleteOptionType: async (optionTypeId) => {
      try {
        const response = await apiClient.delete(
          API_ENDPOINTS.ADMIN.OPTION_TYPES.DELETE(optionTypeId),
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '옵션 타입 삭제 중 오류가 발생했습니다.',
          }
        );
      }
    },

    /**
     * 옵션 값 생성
     * @param {number} optionTypeId - 옵션 타입 ID
     * @param {Object} optionValueData - 옵션 값 데이터
     * @returns {Promise} - API 응답
     */
    createOptionValue: async (optionTypeId, optionValueData) => {
      try {
        const response = await apiClient.post(
          API_ENDPOINTS.ADMIN.OPTION_TYPES.CREATE_VALUE(optionTypeId),
          optionValueData,
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '옵션 값 생성 중 오류가 발생했습니다.',
          }
        );
      }
    },

    /**
     * 옵션 값 수정
     * @param {number} valueId - 옵션 값 ID
     * @param {Object} optionValueData - 수정할 옵션 값 데이터
     * @returns {Promise} - API 응답
     */
    updateOptionValue: async (valueId, optionValueData) => {
      try {
        const response = await apiClient.put(
          API_ENDPOINTS.ADMIN.OPTION_TYPES.UPDATE_VALUE(valueId),
          optionValueData,
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '옵션 값 수정 중 오류가 발생했습니다.',
          }
        );
      }
    },

    /**
     * 옵션 값 삭제
     * @param {number} valueId - 옵션 값 ID
     * @returns {Promise} - API 응답
     */
    deleteOptionValue: async (valueId) => {
      try {
        const response = await apiClient.delete(
          API_ENDPOINTS.ADMIN.OPTION_TYPES.DELETE_VALUE(valueId),
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '옵션 값 삭제 중 오류가 발생했습니다.',
          }
        );
      }
    },
    /**
     * 모든 옵션 값 조회
     * @returns {Promise} - API 응답
     */
    getAllOptionValues: async () => {
      try {
        const response = await apiClient.get(
          '/option-types/values/optionValues',
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '모든 옵션 값 조회 중 오류가 발생했습니다.',
          }
        );
      }
    },
  },

  // 문의 관련 API
  inquiries: {
    /**
     * 문의 목록 조회
     * @param {Object} params - 검색, 필터링, 페이지네이션 파라미터
     * @returns {Promise} - API 응답
     */
    getInquiries: async (params = {}) => {
      try {
        const response = await apiClient.get(
          API_ENDPOINTS.ADMIN.INQUIRIES.LIST,
          { params },
        );
        return response;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '문의 목록 조회 중 오류가 발생했습니다.',
          }
        );
      }
    },

    /**
     * 문의 상세 조회
     * @param {number} inquiryId - 문의 ID
     * @returns {Promise} - API 응답
     */
    getInquiryDetail: async (inquiryId) => {
      try {
        const response = await apiClient.get(
          API_ENDPOINTS.ADMIN.INQUIRIES.DETAIL(inquiryId),
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '문의 상세 조회 중 오류가 발생했습니다.',
          }
        );
      }
    },

    /**
     * 문의 답변 작성
     * @param {number} inquiryId - 문의 ID
     * @param {Object} answerData - 답변 데이터
     * @returns {Promise} - API 응답
     */
    answerInquiry: async (inquiryId, answerData) => {
      try {
        const response = await apiClient.post(
          API_ENDPOINTS.ADMIN.INQUIRIES.ANSWER(inquiryId),
          answerData,
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '문의 답변 작성 중 오류가 발생했습니다.',
          }
        );
      }
    },

    /**
     * 문의 답변 수정
     * @param {number} answerId - 답변 ID
     * @param {Object} answerData - 수정할 답변 데이터
     * @returns {Promise} - API 응답
     */
    updateAnswer: async (answerId, answerData) => {
      try {
        const response = await apiClient.put(
          API_ENDPOINTS.ADMIN.INQUIRIES.UPDATE_ANSWER(answerId),
          answerData,
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '문의 답변 수정 중 오류가 발생했습니다.',
          }
        );
      }
    },

    /**
     * 문의 상태 변경
     * @param {number} inquiryId - 문의 ID
     * @param {string} status - 변경할 상태
     * @returns {Promise} - API 응답
     */
    updateInquiryStatus: async (inquiryId, status) => {
      try {
        const response = await apiClient.patch(
          API_ENDPOINTS.ADMIN.INQUIRIES.UPDATE_STATUS(inquiryId),
          { status },
        );
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || {
            message: '문의 상태 변경 중 오류가 발생했습니다.',
          }
        );
      }
    },
  },
};
