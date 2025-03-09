// src/middleware/auth.middleware.js
/**
 * 인증 미들웨어
 */
const isAuthenticated = (req, res, next) => {
    // 인증 로직은 나중에 구현
    // 지금은 모든 요청 허용
    next();
  };
  
  /**
   * 관리자 권한 확인 미들웨어
   */
  const isAdmin = (req, res, next) => {
    // 관리자 권한 확인 로직은 나중에 구현
    // 지금은 모든 요청 허용
    next();
  };
  
  module.exports = {
    isAuthenticated,
    isAdmin
  };