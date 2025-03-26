import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  loginUser, 
  logoutUser,
  registerUser, 
  fetchCurrentUser,
  sendVerificationCode,
  verifyCode,
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
  clearError,
  localLogout,
  setRegisterStep,
  updateRegisterData,
  resetRegisterForm,
  resetPasswordResetState
} from '../features/auth/authSlice';

/**
 * 인증 관련 커스텀 훅
 * @returns {Object} 인증 관련 상태 및 액션들
 */
const useAuth = () => {
  const dispatch = useDispatch();
  
  // auth 상태 가져오기
  const { 
    user, 
    isAuthenticated, 
    loading, 
    error,
    verificationSent,
    verificationSuccess,
    passwordResetRequested,
    passwordResetVerified,
    passwordResetSuccess,
    passwordResetData,
    registerForm
  } = useSelector((state) => state.auth);
  
  // 로그인 함수
  const login = useCallback((email, password) => {
    return dispatch(loginUser({ email, password }));
  }, [dispatch]);
  
  // 로그아웃 함수 (API 호출)
  const logout = useCallback(() => {
    return dispatch(logoutUser());
  }, [dispatch]);
  
  // 로컬 로그아웃 함수 (API 호출 없이 상태만 변경)
  const localLogoutUser = useCallback(() => {
    dispatch(localLogout());
  }, [dispatch]);
  
  // 회원가입 함수
  const register = useCallback((userData) => {
    return dispatch(registerUser(userData));
  }, [dispatch]);
  
  // 현재 사용자 정보 조회 함수
  const getCurrentUser = useCallback(() => {
    return dispatch(fetchCurrentUser());
  }, [dispatch]);
  
  // 인증번호 발송 함수
  const sendSMSCode = useCallback((phone) => {
    return dispatch(sendVerificationCode(phone));
  }, [dispatch]);
  
  // 인증번호 확인 함수
  const verifySMSCode = useCallback((phone, code) => {
    return dispatch(verifyCode({ phone, code }));
  }, [dispatch]);
  
  // 비밀번호 재설정 요청 함수
  const requestResetPassword = useCallback((email) => {
    return dispatch(requestPasswordReset(email));
  }, [dispatch]);
  
  // 비밀번호 재설정 토큰 검증 함수
  const verifyPasswordResetToken = useCallback((email, token) => {
    return dispatch(verifyResetToken({ email, token }));
  }, [dispatch]);
  
  // 비밀번호 재설정 함수
  const resetUserPassword = useCallback((userId, resetId, password) => {
    return dispatch(resetPassword({ userId, resetId, password }));
  }, [dispatch]);
  
  // 에러 초기화 함수
  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);
  
  // 회원가입 단계 설정 함수
  const setRegistrationStep = useCallback((step) => {
    dispatch(setRegisterStep(step));
  }, [dispatch]);
  
  // 회원가입 데이터 업데이트 함수
  const updateRegistrationData = useCallback((data) => {
    dispatch(updateRegisterData(data));
  }, [dispatch]);
  
  // 회원가입 폼 초기화 함수
  const resetRegistrationForm = useCallback(() => {
    dispatch(resetRegisterForm());
  }, [dispatch]);
  
  // 비밀번호 재설정 상태 초기화 함수
  const resetPasswordState = useCallback(() => {
    dispatch(resetPasswordResetState());
  }, [dispatch]);
  
  return {
    // 상태
    user,
    isAuthenticated,
    loading,
    error,
    verificationSent,
    verificationSuccess,
    passwordResetRequested,
    passwordResetVerified,
    passwordResetSuccess,
    passwordResetData,
    registerForm,
    
    // 액션
    login,
    logout,
    localLogoutUser,
    register,
    getCurrentUser,
    sendSMSCode,
    verifySMSCode,
    requestResetPassword,
    verifyPasswordResetToken,
    resetUserPassword,
    resetError,
    setRegistrationStep,
    updateRegistrationData,
    resetRegistrationForm,
    resetPasswordState
  };
};

export default useAuth;