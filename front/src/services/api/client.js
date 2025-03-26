import axios from 'axios';
import { store } from '../../store';
import { localLogout } from '../../features/auth/authSlice';

// API 기본 URL (환경에 따라 다르게 설정)
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.yourdomain.com' 
  : 'http://localhost:5001';

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15초
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // 로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem('accessToken');
    
    // 토큰이 있는 경우 헤더에 추가
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // 401 에러 (인증 만료) 처리
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // 리프레시 토큰이 있는지 확인
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          // 토큰 갱신 시도
          const response = await apiClient.post('/auth/refresh-token', { refreshToken });
          
          if (response.data && response.data.data && response.data.data.accessToken) {
            // 새 액세스 토큰 저장
            localStorage.setItem('accessToken', response.data.data.accessToken);
            
            // 헤더 업데이트
            apiClient.defaults.headers.common['Authorization'] = 
              `Bearer ${response.data.data.accessToken}`;
            
            // 원래 요청 재시도
            return apiClient(originalRequest);
          }
        }
        
        // 리프레시 토큰이 없거나 갱신에 실패한 경우 로그아웃
        store.dispatch(localLogout());
        return Promise.reject(error);
      } catch (refreshError) {
        // 토큰 갱신 중 오류 발생 시 로그아웃
        store.dispatch(localLogout());
        return Promise.reject(refreshError);
      }
    }
    
    // 그 외 에러는 그대로 전달
    return Promise.reject(error);
  }
);

export default apiClient;