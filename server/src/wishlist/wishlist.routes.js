const express = require('express');
const router = express.Router();
const wishlistController = require('./wishlist.controller');
const { isAuthenticated } = require('../middleware/auth.middleware');
const { validationMiddleware } = require('../middleware/validation.middleware');
const {
  productIdParamValidation,
  wishlistIdParamValidation,
  addToWishlistValidation
} = require('./wishlist.validation');

// 모든 라우트에 인증 미들웨어 적용
router.use(isAuthenticated);

// 위시리스트 조회
router.get('/', wishlistController.getWishlist);

// 상품이 위시리스트에 있는지 확인
router.get('/check/:productId', productIdParamValidation, validationMiddleware, wishlistController.checkWishlistItem);

// 위시리스트에 상품 추가
router.post('/', addToWishlistValidation, validationMiddleware, wishlistController.addToWishlist);

// 위시리스트에서 상품 제거 (상품 ID 기준)
router.delete('/product/:productId', productIdParamValidation, validationMiddleware, wishlistController.removeFromWishlist);

// 위시리스트 항목 삭제 (위시리스트 항목 ID 기준)
router.delete('/:id', wishlistIdParamValidation, validationMiddleware, wishlistController.deleteWishlistItem);

// 위시리스트 비우기
router.delete('/', wishlistController.clearWishlist);

module.exports = router;