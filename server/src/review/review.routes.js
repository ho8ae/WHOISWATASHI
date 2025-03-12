const express = require('express');
const router = express.Router();
const reviewController = require('./review.controller');
const { isAuthenticated } = require('../middleware/auth.middleware');
const { validationMiddleware } = require('../middleware/validation.middleware');
const {
  getProductReviewsValidation,
  reviewIdParamValidation,
  createReviewValidation,
  updateReviewValidation
} = require('./review.validation');

// 상품별 리뷰 목록 조회 (인증 불필요)
router.get('/products/:productId', getProductReviewsValidation, validationMiddleware, reviewController.getProductReviews);

// 리뷰 상세 조회 (인증 불필요)
router.get('/:id', reviewIdParamValidation, validationMiddleware, reviewController.getReviewById);

// 인증이 필요한 라우트
router.use(isAuthenticated);

// 사용자 리뷰 목록 조회
router.get('/my-reviews', reviewController.getUserReviews);

// 작성 가능한 리뷰 목록 조회
router.get('/reviewable', reviewController.getReviewableOrders);

// 리뷰 작성
router.post('/', createReviewValidation, validationMiddleware, reviewController.createReview);

// 리뷰 수정
router.put('/:id', updateReviewValidation, validationMiddleware, reviewController.updateReview);

// 리뷰 삭제
router.delete('/:id', reviewIdParamValidation, validationMiddleware, reviewController.deleteReview);

module.exports = router;