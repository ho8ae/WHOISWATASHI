const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { authValidation } = require('./auth.validation');

// 회원가입
router.post('/register', authValidation.register, authController.register);

// 로그인
router.post('/login', authValidation.login, authController.login);

// 로그아웃
router.post('/logout', authController.logout);

// 토큰 갱신
router.post('/refresh-token', authController.refreshToken);

// 인증번호 발송
router.post('/send-verification', authValidation.sendVerification, authController.sendVerificationCode);

// 인증번호 확인
router.post('/verify-code', authValidation.verifyCode, authController.verifyCode);

// 현재 사용자 정보 조회
router.get ('/me', authMiddleware.isAuthenticated, authController.getCurrentUser);

// 비밀번호 재설정 요청
router.post('/reset-password', authValidation.resetPassword, authController.requestPasswordReset);

// 소셜 로그인 라우트 (추후 구현)
/*
router.get('/kakao', authController.kakaoLogin);
router.get('/kakao/callback', authController.kakaoCallback);

router.get('/google', authController.googleLogin);
router.get('/google/callback', authController.googleCallback);
*/

module.exports = router;