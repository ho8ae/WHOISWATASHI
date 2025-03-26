import { apiClient } from '../../services/api/client';
import { API_ENDPOINTS } from '../../services/api/endpoints';

export const authAPI = {
  /**
   * 회원가입 API
   * @param {Object} userData - 사용자 등록 정보 (email, password, name 등)
   * @returns {Promise} - API 응답
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '회원가입 중 오류가 발생했습니다.' };
    }
  },

  /**
   * 로그인 API
   * @param {string} email - 사용자 이메일
   * @param {string} password - 사용자 비밀번호
   * @returns {Promise} - API 응답
   */
  login: async (email, password) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '로그인 중 오류가 발생했습니다.' };
    }
  },

  /**
   * 로그아웃 API
   * @returns {Promise} - API 응답
   */
  logout: async () => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '로그아웃 중 오류가 발생했습니다.' };
    }
  },

  /**
   * 문자 인증번호 발송 API
   * @param {string} phone - 전화번호
   * @returns {Promise} - API 응답
   */
  sendVerificationCode: async (phone) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.SEND_VERIFICATION, { phone });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '인증번호 발송 중 오류가 발생했습니다.' };
    }
  },

  /**
   * 인증번호 확인 API
   * @param {string} phone - 전화번호
   * @param {string} code - 인증번호
   * @returns {Promise} - API 응답
   */
  verifyCode: async (phone, code) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_CODE, { phone, code });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '인증번호 확인 중 오류가 발생했습니다.' };
    }
  },

  /**
   * 현재 사용자 정보 조회 API
   * @returns {Promise} - API 응답
   */
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '사용자 정보 조회 중 오류가 발생했습니다.' };
    }
  },

  /**
   * 비밀번호 재설정 요청 API
   * @param {string} email - 사용자 이메일
   * @returns {Promise} - API 응답
   */
  requestPasswordReset: async (email) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REQUEST_RESET, { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '비밀번호 재설정 요청 중 오류가 발생했습니다.' };
    }
  },

  /**
   * 비밀번호 재설정 토큰 검증 API
   * @param {string} email - 사용자 이메일
   * @param {string} token - 재설정 토큰
   * @returns {Promise} - API 응답
   */
  verifyResetToken: async (email, token) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_RESET_TOKEN, { email, token });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '비밀번호 재설정 토큰이 유효하지 않습니다.' };
    }
  },

  /**
   * 비밀번호 재설정 API
   * @param {number} userId - 사용자 ID
   * @param {number} resetId - 재설정 레코드 ID
   * @param {string} password - 새 비밀번호
   * @returns {Promise} - API 응답
   */
  resetPassword: async (userId, resetId, password) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        userId,
        resetId,
        password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '비밀번호 재설정 중 오류가 발생했습니다.' };
    }
  },

  /**
   * 토큰 갱신 API
   * @param {string} refreshToken - 리프레시 토큰
   * @returns {Promise} - API 응답
   */
  refreshToken: async (refreshToken) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: '토큰 갱신 중 오류가 발생했습니다.' };
    }
  }
};