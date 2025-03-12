const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { isAuthenticated } = require('../middleware/auth.middleware');
const { validationMiddleware } = require('../middleware/validation.middleware');
const { updateProfileValidation } = require('./user.validation');

// 모든 경로에 인증 미들웨어 적용
router.use(isAuthenticated);

// 사용자 프로필 조회
router.get('/profile', userController.getUserProfile);

// 사용자 프로필 수정
router.put('/profile', updateProfileValidation, validationMiddleware, userController.updateUserProfile);

module.exports = router;